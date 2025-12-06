import { Controller, Post, Get, Param, Body, UseGuards, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TokenizeService } from './tokenize.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tokenize')
@UseGuards(JwtAuthGuard)
export class TokenizeController {
  constructor(private readonly tokenizeService: TokenizeService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('documents'))
  async tokenize(
    @Body() body: { title: string; amount: number; due_date: string },
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.tokenizeService.tokenize(body, files);
  }

  @Get('valuation/:jobId')
  async getValuation(@Param('jobId') jobId: string) {
    return this.tokenizeService.getValuation(jobId);
  }

  @Post('mint')
  async mint(@Body() body: { document_id: string; accepted_value_usd: number }) {
    return this.tokenizeService.mint(body);
  }
}