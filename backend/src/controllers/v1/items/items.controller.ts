import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, BadRequestException, Req, ForbiddenException } from '@nestjs/common';
import { CreateItemDto, ItemsListQuery, ReorderItemsDto } from '@dtos/items.dto';
import { ItemsService } from './items.service';
import { Types } from 'mongoose';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Topic, TopicDocument } from '@models/topic.model';
import { Student, StudentDocument } from '@models/student.model';
import { Model } from 'mongoose';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    @InjectModel(Topic.name) private readonly topicModel: Model<TopicDocument>,
    @InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>,
  ) {}

  @Post()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  create(@Body() dto: CreateItemDto) {
    const payload: any = { ...dto };
    if (payload.topicId) payload.topicId = new Types.ObjectId(payload.topicId);
    return this.itemsService.create(payload);
  }

  @Get()
  async list(@Req() req: any, @Query() q: ItemsListQuery) {
    const { page = 1, limit = 10, topicId, search, studentId } = q as any;
    const result = await this.itemsService.findAll(page, limit, topicId, search);
    if (!studentId || !topicId) return result;
    const student = await this.studentModel.findById(studentId).lean();
    if (!student) return result;
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
    // Check if topic is unlocked: first topic of its conservation or previous topic completed
    const topic = await this.topicModel.findById(topicId).lean();
    if (!topic) return result;
    const sameTopics = await this.topicModel
      .find({ conservationId: (topic as any).conservationId })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    const idx = sameTopics.findIndex((t: any) => String(t._id) === String(topicId));
    let unlocked = true;
    if (idx > 0) {
      const prior = sameTopics[idx - 1];
      unlocked = Boolean(progress[`topic_${prior._id}`]?.completed);
    }
    if (!unlocked) {
      return { items: [], total: 0, page, limit };
    }
    return result;
  }

  @Get('unlocked')
  async unlocked(@Req() req: any, @Query() q: ItemsListQuery) {
    return this.list(req, q as any);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  update(@Param('id') id: string, @Body() dto: Partial<CreateItemDto>) {
    const payload: any = { ...dto };
    if (payload.topicId) payload.topicId = new Types.ObjectId(payload.topicId);
    return this.itemsService.update(id, payload);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }

  @Post('reorder')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async reorder(@Body() body: ReorderItemsDto) {
    const ops = (body.items || []).map((it) => ({ updateOne: { filter: { _id: new Types.ObjectId(it.id) }, update: { $set: { order: it.order } } } }));
    if (ops.length === 0) return { updated: 0 };
    await (this as any).itemsService['itemModel'].bulkWrite(ops);
    return { updated: ops.length };
  }
}

