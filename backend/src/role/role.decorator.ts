import { SetMetadata } from '@nestjs/common';
export const role_keys = 'role';
export const Role = (...roles: string[]) => SetMetadata(role_keys, roles);
