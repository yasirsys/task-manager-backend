import { TaskDocument } from '../schemas/task.schema';

export interface TasksPagination {
  skip: number;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface TasksResponse {
  tasks: TaskDocument[];
  pagination: TasksPagination;
}
