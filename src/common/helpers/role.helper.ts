import { UserRoles } from '../../common/types';

export const isSuperAdmin = (role: UserRoles) => {
  return UserRoles.SUPER_ADMIN === role;
};
