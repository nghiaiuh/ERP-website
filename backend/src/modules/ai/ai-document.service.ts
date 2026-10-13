import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import type { QdrantClient } from '@qdrant/js-client-rest';
import { QDRANT_CLIENT } from '../../infrastructure/tokens';

@Injectable()
export class AiDocumentService {
  constructor(
    @Inject(QDRANT_CLIENT) private readonly qdrant: QdrantClient,
    private readonly config: ConfigService,
  ) {}

  async splitText(
    content: string,
    metadata: Record<string, unknown>,
  ): Promise<Document[]> {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1_000,
      chunkOverlap: 150,
    });

    return splitter.splitDocuments([
      new Document({ pageContent: content, metadata }),
    ]);
  }

  async vectorStoreStatus() {
    const collection = this.config.getOrThrow<string>('qdrant.collection');

    try {
      const result = await this.qdrant.getCollection(collection);
      return { available: true, collection, status: result.status };
    } catch {
      return { available: false, collection };
    }
  }
}
