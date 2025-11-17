import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class GetTasksQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
