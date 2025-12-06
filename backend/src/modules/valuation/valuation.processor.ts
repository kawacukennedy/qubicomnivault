import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValuationJob } from '../../entities/valuationJob.entity';
import { Document } from '../../entities/document.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import * as AWS from 'aws-sdk';

@Injectable()
@Processor('valuation')
export class ValuationProcessor {
  private logger = new Logger(ValuationProcessor.name);
  private s3: AWS.S3;

  constructor(
    @InjectRepository(ValuationJob)
    private valuationJobRepository: Repository<ValuationJob>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private websocketGateway: WebsocketGateway,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  @Process('process-valuation')
  async handleValuation(job: Job<{ jobId: string; documentId: string; fileKeys: string[]; userData: any }>) {
    const { jobId, documentId, fileKeys, userData } = job.data;

    this.logger.log(`Processing valuation job ${jobId} for document ${documentId}`);

    try {
      // Update job status to processing
      await this.valuationJobRepository.update(jobId, { status: 'pending' });

      // Emit progress update
      this.websocketGateway.emitValuationUpdate(jobId, {
        status: 'processing',
        progress: 10,
        message: 'Analyzing document content...',
      });

      // Simulate document analysis
      await this.delay(2000);

      this.websocketGateway.emitValuationUpdate(jobId, {
        status: 'processing',
        progress: 30,
        message: 'Extracting financial data...',
      });

      // Simulate AI analysis
      await this.delay(3000);

      this.websocketGateway.emitValuationUpdate(jobId, {
        status: 'processing',
        progress: 60,
        message: 'Consulting oracle sources...',
      });

      // Mock oracle consultation
      const oracleSources = [
        { name: 'Chainlink', value: userData.amount * 0.95, confidence: 0.85 },
        { name: 'Custom API', value: userData.amount * 1.02, confidence: 0.78 },
        { name: 'Market Data', value: userData.amount * 0.98, confidence: 0.92 },
      ];

      await this.delay(2000);

      this.websocketGateway.emitValuationUpdate(jobId, {
        status: 'processing',
        progress: 90,
        message: 'Finalizing valuation...',
      });

      // Calculate weighted average
      const totalWeight = oracleSources.reduce((sum, oracle) => sum + oracle.confidence, 0);
      const suggestedValue = oracleSources.reduce(
        (sum, oracle) => sum + (oracle.value * oracle.confidence),
        0,
      ) / totalWeight;

      const averageConfidence = totalWeight / oracleSources.length;

      // Update job with results
      await this.valuationJobRepository.update(jobId, {
        suggested_value: Math.round(suggestedValue * 100) / 100,
        confidence: Math.round(averageConfidence * 100) / 100,
        oracle_sources: oracleSources,
        status: averageConfidence > 0.7 ? 'done' : 'manual_review',
      });

      // Update document status
      await this.documentRepository.update(documentId, {
        status: averageConfidence > 0.7 ? 'valued' : 'uploaded',
      });

      // Emit completion
      this.websocketGateway.emitValuationUpdate(jobId, {
        status: 'completed',
        progress: 100,
        message: 'Valuation completed',
        result: {
          suggested_value_usd: Math.round(suggestedValue * 100) / 100,
          confidence: Math.round(averageConfidence * 100) / 100,
          oracle_sources: oracleSources,
          manual_review_required: averageConfidence <= 0.7,
        },
      });

      this.logger.log(`Valuation job ${jobId} completed successfully`);

    } catch (error) {
      this.logger.error(`Error processing valuation job ${jobId}:`, error);

      // Update job status to failed
      await this.valuationJobRepository.update(jobId, {
        status: 'manual_review',
        oracle_sources: [{ name: 'Error', value: userData.amount, confidence: 0 }],
      });

      // Emit error
      this.websocketGateway.emitValuationUpdate(jobId, {
        status: 'error',
        progress: 0,
        message: 'Valuation failed, requires manual review',
        error: error.message,
      });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}