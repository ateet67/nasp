import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  fullName: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  regionId?: string;

  @IsString()
  @IsOptional()
  schoolId?: string;

  @IsString()
  @IsOptional()
  teacherId?: string;
}

export class ListStudentsQuery {
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
  schoolId?: string;

  @IsString()
  @IsOptional()
  teacherId?: string;

  @IsBoolean()
  @IsOptional()
  approved?: boolean;
}


