import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsString()
  regionId: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class SchoolsListQuery {
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
  search?: string;

  @IsString()
  @IsOptional()
  regionId?: string;
}

