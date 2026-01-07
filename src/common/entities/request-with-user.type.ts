import { Role } from 'src/common/enum/role.enum';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email?: string;
    role?: Role;
  };
}
