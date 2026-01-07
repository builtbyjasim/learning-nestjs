import { Role } from 'src/users/enum/role.enum';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email?: string;
    role?: Role;
  };
}
