import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto, AssessmentsListQuery, SubmitAssessmentDto } from '@dtos/assessments.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Assessment, AssessmentDocument } from '@models/assessment.model';
import { Student, StudentDocument } from '@models/student.model';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assessments')
export class AssessmentsController {
  constructor(
    private readonly assessmentsService: AssessmentsService,
    @InjectModel(Assessment.name) private readonly assessModel: Model<AssessmentDocument>,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) {}

  @Post()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  create(@Body() dto: CreateAssessmentDto) {
    const payload: any = { ...dto };
    if (payload.topicId) payload.topicId = new Types.ObjectId(payload.topicId);
    if (payload.conservationId) payload.conservationId = new Types.ObjectId(payload.conservationId);
    return this.assessmentsService.create(payload);
  }

  @Get()
  list(@Query() q: AssessmentsListQuery) {
    const { page = 1, limit = 10, topicId, conservationId } = q;
    return this.assessmentsService.findAll(page, limit, topicId, conservationId);
  }

  @Get('conservation/:id/eligible')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER')
  async isConservationEligible(@Req() req: any, @Param('id') conservationId: string, @Query('studentId') studentId?: string) {
    if (!studentId) return { eligible: false };
    const student = await this.studentModel.findById(studentId).lean();
    if (!student) return { eligible: false };
    if (req.user?.role === 'REGIONAL_ADMIN') {
      if (String((student as any).regionId || '') !== String(req.user?.regionId || '')) {
        throw new ForbiddenException('Student outside your region');
      }
    }
    if (req.user?.role === 'TEACHER') {
      if (String((student as any).teacherId || '') !== String(req.user?.sub || '')) {
        throw new ForbiddenException('Student not assigned to you');
      }
    }
    const topics = await this.assessModel.db.model('Topic').find({ conservationId: new (this.assessModel.db as any).base.Types.ObjectId(conservationId) }).lean();
    const progress = (student as any).progress || {};
    const allCompleted = topics.length > 0 && topics.every((t: any) => Boolean(progress[`topic_${t._id}`]?.completed));
    return { eligible: allCompleted };
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  update(@Param('id') id: string, @Body() dto: Partial<CreateAssessmentDto>) {
    const payload: any = { ...dto };
    if (payload.topicId) payload.topicId = new Types.ObjectId(payload.topicId);
    if (payload.conservationId) payload.conservationId = new Types.ObjectId(payload.conservationId);
    return this.assessmentsService.update(id, payload);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(id);
  }

  @Post('submit')
  @Roles('STUDENT', 'TEACHER', 'REGIONAL_ADMIN', 'SUPER_ADMIN')
  async submit(@Body() dto: SubmitAssessmentDto) {
    const assessment = await this.assessModel.findById(dto.assessmentId).lean();
    if (!assessment) return { ok: false, score: 0, total: 0 };
    const answers = dto.answers || [];
    const total = assessment.questions.length;
    let score = 0;
    assessment.questions.forEach((q: any, idx: number) => {
      const selected = answers[idx];
      if (typeof selected !== 'number') return;
      if (q.options?.[selected]?.isCorrect) score++;
    });
    // persist basic progress for student
    const updates: any = { $set: {} };
    updates.$set[`progress.assessment_${dto.assessmentId}`] = { score, total, at: new Date() };

    // stage progression flags
    const completion = score >= Math.ceil(total * 0.6);
    if (assessment.topicId) {
      updates.$set[`progress.topic_${assessment.topicId}`] = { completed: completion, lastAt: new Date() };
    }
    if (assessment.conservationId && completion) {
      // mark conservation assessment completion gate
      updates.$set[`progress.conservation_${assessment.conservationId}`] = { lastAssessmentPassed: true, lastAt: new Date() };
    }

    await this.studentModel.updateOne({ _id: new Types.ObjectId(dto.studentId) }, updates);
    return { ok: true, score, total, passed: completion };
  }
}
