import { TaskDocument } from 'src/tasks/schemas/task.schema';

export interface CardsStatistics {
  totalTasks: number;
  totalCompletedTasks: number;
  totalInProgressTasks: number;
  totalUsers: number;
  totalActiveUsers: number;
  taskCompletionPercentage: number;
}

export interface TaskAnalytics {
  latestTasks: TaskDocument[];
  taskDistribution: Record<string, number>;
}
