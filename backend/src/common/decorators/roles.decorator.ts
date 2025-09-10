import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../../constants';

export type AppRole = 'SUPER_ADMIN' | 'REGIONAL_ADMIN' | 'TEACHER' | 'STUDENT';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
export default Roles;
