import { Controller, Get } from '@nestjs/common';
import { AiDocumentService } from './ai-document.service';

@Controller('ai')
export class AiController {
  constructor(private readonly documents: AiDocumentService) {}

  @Get('vector-store/status')
  status() {
    return this.documents.vectorStoreStatus();
  }
}
