import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiDocumentService } from './ai-document.service';

@Module({
  controllers: [AiController],
  providers: [AiDocumentService],
  exports: [AiDocumentService],
})
export class AiModule {}
