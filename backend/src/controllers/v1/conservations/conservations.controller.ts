import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CreateConservationDto, ConservationsListQuery } from '@dtos/conservations.dto';
import { ConservationsService } from './conservations.service';
import { Types, Model } from 'mongoose';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Topic, TopicDocument } from '@models/topic.model';
import { Student, StudentDocument } from '@models/student.model';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('conservations')
export class ConservationsController {
  constructor(
    private readonly conservationsService: ConservationsService,
    @InjectModel(Topic.name) private readonly topicModel: Model<TopicDocument>,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) {}

  @Post()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  create(@Body() dto: CreateConservationDto) {
    const payload: any = { ...dto };
    if (payload.regionId) payload.regionId = new Types.ObjectId(payload.regionId);
    return this.conservationsService.create(payload);
  }

  @Get()
  list(@Query() q: ConservationsListQuery) {
    const { page = 1, limit = 10, regionId, search } = q;
    return this.conservationsService.findAll(page, limit, regionId, search);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.conservationsService.findOne(id);
  }

  @Get(':id/progress')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER')
  async progress(@Req() req: any, @Param('id') id: string, @Query('studentId') studentId?: string) {
    if (!studentId) return { completedTopics: 0, totalTopics: 0, eligibleForFinal: false };
    const student = await this.studentModel.findById(studentId).lean();
    if (!student) return { completedTopics: 0, totalTopics: 0, eligibleForFinal: false };
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
    const topics = await this.topicModel.find({ conservationId: new Types.ObjectId(id) }).lean();
    const progress = (student as any).progress || {};
    const totals = { completedTopics: 0, totalTopics: topics.length };
    topics.forEach((t: any) => {
      if (progress[`topic_${t._id}`]?.completed) totals.completedTopics++;
    });
    const eligibleForFinal = totals.totalTopics > 0 && totals.completedTopics === totals.totalTopics;
    return { ...totals, eligibleForFinal };
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  update(@Param('id') id: string, @Body() dto: Partial<CreateConservationDto>) {
    const payload: any = { ...dto };
    if (payload.regionId) payload.regionId = new Types.ObjectId(payload.regionId);
    return this.conservationsService.update(id, payload);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  remove(@Param('id') id: string) {
    return this.conservationsService.remove(id);
  }
}
