export type AbacAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

export interface Principal {
  id: string;
  roles: string[];
  permissions: string[];
  attributes: Record<string, unknown>;
}

export interface ResourceAttributes {
  id?: string;
  ownerId?: string;
  tenantId?: string;
  [key: string]: unknown;
}

export interface PermissionRequirement {
  action: AbacAction;
  resource: string;
  conditions?: Record<string, unknown>;
}
