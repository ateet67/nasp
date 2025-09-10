import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { UserRole } from '@models/user.model';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  regionId?: string;

  @IsString()
  @IsOptional()
  schoolId?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  regionId?: string;

  @IsString()
  @IsOptional()
  schoolId?: string;
}

export class UsersListQuery {
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
  role?: string;
}

export class UpdateMeDto {
  @IsString()
  @IsOptional()
  fullName?: string;
}

