import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { TokenizeService } from './tokenize.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('tokenize')
@Controller('tokenize')
@UseGuards(JwtAuthGuard)
export class TokenizeController {
  constructor(private readonly tokenizeService: TokenizeService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('documents', 10, {
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
        return callback(new BadRequestException('Only PDF and DOC files are allowed'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }))
  @ApiOperation({ summary: 'Upload documents for tokenization' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        amount: { type: 'number' },
        due_date: { type: 'string' },
        documents: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Documents uploaded successfully' })
  async tokenize(
    @Request() req,
    @Body() body: { title: string; amount: number; due_date: string },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.tokenizeService.tokenize(req.user.userId, body, files);
  }

  @Get('valuation/:jobId')
  @ApiOperation({ summary: 'Get valuation result' })
  @ApiResponse({ status: 200, description: 'Valuation retrieved successfully' })
  async getValuation(@Param('jobId') jobId: string) {
    return this.tokenizeService.getValuation(jobId);
  }

  @Post('mint')
  @ApiOperation({ summary: 'Mint oqAsset token' })
  @ApiResponse({ status: 201, description: 'oqAsset minted successfully' })
  async mint(
    @Request() req,
    @Body() body: { document_id: string; accepted_value_usd: number },
  ) {
    return this.tokenizeService.mint(req.user.userId, body);
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get user documents' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  async getDocuments(@Request() req) {
    return this.tokenizeService.getDocuments(req.user.userId);
  }

  @Get('oq-assets')
  @ApiOperation({ summary: 'Get user oqAssets' })
  @ApiResponse({ status: 200, description: 'oqAssets retrieved successfully' })
  async getOqAssets(@Request() req) {
    return this.tokenizeService.getOqAssets(req.user.userId);
  }
}