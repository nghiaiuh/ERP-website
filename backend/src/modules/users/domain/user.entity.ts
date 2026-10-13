export interface UserProperties {
  id: string;
  email: string;
  displayName: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly properties: UserProperties) {}

  static create(input: {
    id: string;
    email: string;
    displayName: string;
    tenantId: string;
  }): User {
    const now = new Date();
    return new User({
      ...input,
      email: input.email.trim().toLowerCase(),
      displayName: input.displayName.trim(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static rehydrate(properties: UserProperties): User {
    return new User(properties);
  }

  get id(): string {
    return this.properties.id;
  }

  get email(): string {
    return this.properties.email;
  }

  get displayName(): string {
    return this.properties.displayName;
  }

  get tenantId(): string {
    return this.properties.tenantId;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }

  get updatedAt(): Date {
    return this.properties.updatedAt;
  }

  toObject(): UserProperties {
    return { ...this.properties };
  }
}
