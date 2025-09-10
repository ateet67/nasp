import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CreateTopicDto, TopicsListQuery, ReorderListDto } from '@dtos/topics.dto';
import { TopicsService } from './topics.service';
import { Types } from 'mongoose';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from '@models/student.model';
import { Model } from 'mongoose';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) {}

  @Post()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  create(@Body() dto: CreateTopicDto) {
    const payload: any = { ...dto };
    if (payload.conservationId) payload.conservationId = new Types.ObjectId(payload.conservationId);
    return this.topicsService.create(payload);
  }

  @Get()
  async list(@Req() req: any, @Query() q: TopicsListQuery) {
    const { page = 1, limit = 10, conservationId, search, studentId, unlockedOnly } = q as any;
    const result = await this.topicsService.findAll(page, limit, conservationId, search);
    if (!studentId) return result;
    const student = await this.studentModel.findById(studentId).lean();
    if (!student) return result;
    // scope check for RA/Teacher
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
    const progress = (student as any)?.progress || {};
    let items = (result.items as any[]).map((t) => {
      const completed = Boolean(progress[`topic_${t._id}`]?.completed);
      return { ...t, completed };
    });
    if (String(unlockedOnly || '').toLowerCase() === 'true') {
      // unlocked rule: first topic always unlocked; subsequent require previous completed
      items = items.sort((a, b) => (a.order || 0) - (b.order || 0));
      let priorCompleted = true;
      items = items.map((t, idx) => {
        const unlocked = idx === 0 ? true : priorCompleted;
        priorCompleted = priorCompleted && t.completed;
        return { ...t, unlocked };
      }).filter((t) => t.unlocked);
    }
    return { ...result, items };
  }

  @Get('unlocked')
  async unlocked(@Req() req: any, @Query() q: TopicsListQuery) {
    const { conservationId, studentId } = q as any;
    const result = await this.list(req, { ...q, unlockedOnly: 'true' } as any);
    return result;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  update(@Param('id') id: string, @Body() dto: Partial<CreateTopicDto>) {
    const payload: any = { ...dto };
    if (payload.conservationId) payload.conservationId = new Types.ObjectId(payload.conservationId);
    return this.topicsService.update(id, payload);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }

  @Post('reorder')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async reorder(@Body() body: ReorderListDto) {
    const ops = (body.items || []).map((it) => ({ updateOne: { filter: { _id: new Types.ObjectId(it.id) }, update: { $set: { order: it.order } } } }));
    if (ops.length === 0) return { updated: 0 };
    await (this as any).topicsService['topicModel'].bulkWrite(ops);
    return { updated: ops.length };
  }
}

