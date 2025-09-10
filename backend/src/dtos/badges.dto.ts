import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { BadgeType } from '@models/badge.model';

export class CreateBadgeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(BadgeType)
  type: BadgeType;

  @IsString()
  iconUrl: string;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsString()
  @IsOptional()
  conservationId?: string;

  @IsString()
  @IsOptional()
  topicId?: string;

  @IsNumber()
  @IsOptional()
  requiredScore?: number;
}
