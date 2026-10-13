import { Injectable } from '@nestjs/common';
import type {
  PermissionRequirement,
  Principal,
  ResourceAttributes,
} from './abac.types';

@Injectable()
export class AbacService {
  can(
    principal: Principal,
    requirement: PermissionRequirement,
    resource: ResourceAttributes = {},
  ): boolean {
    if (principal.roles.includes('admin')) {
      return true;
    }

    const permission = `${requirement.resource}:${requirement.action}`;
    const hasPermission =
      principal.permissions.includes(permission) ||
      principal.permissions.includes(`${requirement.resource}:manage`);

    if (!hasPermission) {
      return false;
    }

    const principalTenant = principal.attributes.tenantId;
    if (resource.tenantId && principalTenant !== resource.tenantId) {
      return false;
    }

    if (requirement.conditions?.ownerOnly === true) {
      return resource.ownerId === principal.id;
    }

    return true;
  }
}
