import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Document } from '../../entities/document.entity';
import { oqAsset } from '../../entities/oqAsset.entity';
import { ValuationJob } from '../../entities/valuationJob.entity';
import { User } from '../../entities/user.entity';
import { BlockchainService } from '../blockchain/blockchain.service';
import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';
import * as ethers from 'ethers';

@Injectable()
export class TokenizeService {
  private s3: AWS.S3;

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(oqAsset)
    private oqAssetRepository: Repository<oqAsset>,
    @InjectRepository(ValuationJob)
    private valuationJobRepository: Repository<ValuationJob>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectQueue('valuation')
    private valuationQueue: Queue,
    private blockchainService: BlockchainService,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  async tokenize(
    userId: string,
    data: { title: string; amount: number; due_date: string },
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Upload files to S3
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');
        const key = `documents/${userId}/${Date.now()}-${file.originalname}`;

        await this.s3
          .upload({
            Bucket: process.env.AWS_S3_BUCKET || 'qubic-omnivault',
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
          .promise();

        return { key, hash };
      }),
    );

    // Create document record
    const document = this.documentRepository.create({
      user_id: userId,
      object_store_key: uploadedFiles[0].key, // Use first file as primary
      hash: uploadedFiles[0].hash,
      status: 'uploaded',
    });

    const savedDocument = await this.documentRepository.save(document);

    // Create valuation job
    const valuationJob = this.valuationJobRepository.create({
      document_id: savedDocument.id,
      suggested_value: data.amount, // Initial estimate
      confidence: 0,
      oracle_sources: [],
      status: 'pending',
    });

    const savedJob = await this.valuationJobRepository.save(valuationJob);

    // Add to valuation queue
    await this.valuationQueue.add('process-valuation', {
      jobId: savedJob.id,
      documentId: savedDocument.id,
      fileKeys: uploadedFiles.map(f => f.key),
      userData: data,
    });

    return {
      document_id: savedDocument.id,
      valuation_job_id: savedJob.id,
      status: 'processing',
    };
  }

  async getValuation(jobId: string) {
    const job = await this.valuationJobRepository.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Valuation job not found');
    }

    return {
      job_id: job.id,
      suggested_value_usd: job.suggested_value,
      confidence: job.confidence,
      oracle_sources: job.oracle_sources,
      status: job.status,
      manual_review_required: job.status === 'manual_review',
    };
  }

  async mint(userId: string, data: { document_id: string; accepted_value_usd: number }) {
    const document = await this.documentRepository.findOne({
      where: { id: data.document_id, user_id: userId },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.status !== 'valued') {
      throw new BadRequestException('Document must be valued before minting');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prepare metadata for blockchain minting
    const maturityDate = new Date();
    maturityDate.setFullYear(maturityDate.getFullYear() + 1); // 1 year maturity

    const metadata = {
      documentHash: document.hash,
      valuation: Math.floor(data.accepted_value_usd * 100), // Convert to cents
      maturityDate: Math.floor(maturityDate.getTime() / 1000), // Unix timestamp
      assetType: 'invoice',
    };

    // Mint on blockchain
    const txHash = await this.blockchainService.mintOqAsset(
      user.wallet_address,
      (data.accepted_value_usd / 100).toString(), // Convert USD to token amount (assuming 1:100 ratio)
      metadata
    );

    // Generate token ID from transaction
    const tokenId = ethers.keccak256(
      ethers.toUtf8Bytes(`${document.id}-${txHash}`),
    );

    // Create oqAsset record
    const oqAssetEntity = this.oqAssetRepository.create({
      document_id: document.id,
      token_id: tokenId,
      face_value_usd: data.accepted_value_usd,
      mint_tx_hash: txHash,
      owner_address: user.wallet_address,
    });

    const savedOqAsset = await this.oqAssetRepository.save(oqAssetEntity);

    // Update document status
    document.status = 'minted';
    await this.documentRepository.save(document);

    return {
      tx_hash: txHash,
      oqAsset_id: savedOqAsset.id,
      token_id: tokenId,
      face_value_usd: data.accepted_value_usd,
    };
  }

  async getDocuments(userId: string) {
    const documents = await this.documentRepository.find({
      where: { user_id: userId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return documents.map(doc => ({
      id: doc.id,
      status: doc.status,
      hash: doc.hash,
      created_at: doc.created_at,
    }));
  }

  async getOqAssets(userId: string) {
    const oqAssets = await this.oqAssetRepository.find({
      where: { owner_address: await this.getWalletAddress(userId) },
      relations: ['document'],
      order: { created_at: 'DESC' },
    });

    return oqAssets.map(asset => ({
      id: asset.id,
      token_id: asset.token_id,
      face_value_usd: asset.face_value_usd,
      mint_tx_hash: asset.mint_tx_hash,
      owner_address: asset.owner_address,
      document: {
        id: asset.document.id,
        hash: asset.document.hash,
      },
      created_at: asset.created_at,
    }));
  }

  private async getWalletAddress(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.wallet_address;
  }
}