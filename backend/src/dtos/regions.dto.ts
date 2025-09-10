import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  conservationTitles?: string[];
}

export class RegionsListQuery {
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
}

