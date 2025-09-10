import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateConservationDto {
  @IsString()
  title: string;

  @IsString()
  regionId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  order?: number;
}

export class ConservationsListQuery {
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
  regionId?: string;

  @IsString()
  @IsOptional()
  search?: string;
}

