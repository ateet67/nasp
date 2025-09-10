import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MCQOptionDto {
  @IsString()
  text: string;
  @IsBoolean()
  isCorrect: boolean;
}

export class MCQQuestionDto {
  @IsString()
  prompt: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MCQOptionDto)
  options: MCQOptionDto[];
}

export class CreateAssessmentDto {
  @IsString()
  @IsOptional()
  topicId?: string;

  @IsString()
  @IsOptional()
  conservationId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MCQQuestionDto)
  questions: MCQQuestionDto[];
}

export class AssessmentsListQuery {
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
  conservationId?: string;
}

export class SubmitAssessmentDto {
  @IsString()
  assessmentId: string;

  @IsString()
  studentId: string;

  // Array of selected option indexes per question
  @IsArray()
  answers: number[];
}

