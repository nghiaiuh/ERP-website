import { SetMetadata } from '@nestjs/common';
import type { PermissionRequirement } from './abac.types';

export const ABAC_REQUIREMENT_KEY = 'abac:requirement';

export const RequirePermission = (requirement: PermissionRequirement) =>
  SetMetadata(ABAC_REQUIREMENT_KEY, requirement);
