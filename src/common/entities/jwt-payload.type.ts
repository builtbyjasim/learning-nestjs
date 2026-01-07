import { Role } from 'src/common/enum/role.enum';

export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: Role;
  iat?: number;
  exp?: number;
}
