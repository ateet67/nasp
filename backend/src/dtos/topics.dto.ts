import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  title: string;

  @IsString()
  conservationId: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class TopicsListQuery {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  conservationId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  unlockedOnly?: string;
}

export class ReorderDto {
  @IsString()
  id: string;

  @IsInt()
  order: number;
}

export class ReorderListDto {
  items: ReorderDto[];
}

