import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  title: string;

  @IsString()
  topicId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videoUrls?: string[];
}

export class ItemsListQuery {
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
  topicId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  studentId?: string;
}

export class ReorderItemsDto {
  items: { id: string; order: number }[];
}

