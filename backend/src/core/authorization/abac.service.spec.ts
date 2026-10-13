import { AbacService } from './abac.service';

describe('AbacService', () => {
  const service = new AbacService();

  it('allows an admin to perform any action', () => {
    expect(
      service.can(
        { id: '1', roles: ['admin'], permissions: [], attributes: {} },
        { resource: 'user', action: 'delete' },
      ),
    ).toBe(true);
  });

  it('denies cross-tenant access', () => {
    expect(
      service.can(
        {
          id: '1',
          roles: ['accountant'],
          permissions: ['invoice:read'],
          attributes: { tenantId: 'tenant-a' },
        },
        { resource: 'invoice', action: 'read' },
        { tenantId: 'tenant-b' },
      ),
    ).toBe(false);
  });
});
