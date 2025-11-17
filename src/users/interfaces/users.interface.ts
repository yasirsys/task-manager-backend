// interfaces/users.interface.ts
import { User } from '../schemas/user.schema';

export interface UsersPagination {
  skip: number;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface UsersResponse {
  users: User[];
  pagination: UsersPagination;
}
