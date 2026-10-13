import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AbacService } from './abac.service';
import type { PermissionRequirement, Principal } from './abac.types';
import { ABAC_REQUIREMENT_KEY } from './require-permission.decorator';

interface AuthenticatedRequest extends Request {
  user?: Principal;
  resourceAttributes?: Record<string, unknown>;
}

@Injectable()
export class AbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abac: AbacService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requirement = this.reflector.getAllAndOverride<PermissionRequirement>(
      ABAC_REQUIREMENT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requirement) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) {
      throw new UnauthorizedException('Authenticated principal is required');
    }

    if (!this.abac.can(request.user, requirement, request.resourceAttributes)) {
      throw new ForbiddenException('Insufficient attributes or permissions');
    }

    return true;
  }
}
