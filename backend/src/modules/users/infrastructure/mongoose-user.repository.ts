import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { User } from '../domain/user.entity';
import type { UserRepository } from '../domain/user.repository';
import { UserMongo, type UserMongoDocument } from './user.schema';

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserMongo.name)
    private readonly model: Model<UserMongoDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const document = await this.model.findById(id).lean().exec();
    return document ? this.toDomain(document) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const document = await this.model
      .findOne({ email: email.trim().toLowerCase() })
      .lean()
      .exec();
    return document ? this.toDomain(document) : null;
  }

  async findAll(): Promise<User[]> {
    const documents = await this.model.find().sort({ createdAt: -1 }).lean().exec();
    return documents.map((document) => this.toDomain(document));
  }

  async save(user: User): Promise<User> {
    const properties = user.toObject();
    const document = await this.model
      .findByIdAndUpdate(
        properties.id,
        {
          _id: properties.id,
          email: properties.email,
          displayName: properties.displayName,
          tenantId: properties.tenantId,
          createdAt: properties.createdAt,
          updatedAt: properties.updatedAt,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .lean()
      .exec();

    return this.toDomain(document);
  }

  async delete(id: string): Promise<void> {
    await this.model.deleteOne({ _id: id }).exec();
  }

  private toDomain(document: {
    _id: string;
    email: string;
    displayName: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return User.rehydrate({
      id: document._id,
      email: document.email,
      displayName: document.displayName,
      tenantId: document.tenantId,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }
}
