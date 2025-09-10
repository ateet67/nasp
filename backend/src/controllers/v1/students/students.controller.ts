import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, Req, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { StudentsService } from './students.service';
import { CreateStudentDto, ListStudentsQuery } from '@dtos/students.dto';
import { Types, Model } from 'mongoose';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserRole } from '@models/user.model';
import { Topic, TopicDocument } from '@models/topic.model';
import { Item, ItemDocument } from '@models/item.model';

 

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Topic.name) private readonly topicModel: Model<TopicDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
  ) {}

  @Post()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER')
  create(@Req() req: any, @Body() dto: CreateStudentDto) {
    const payload: any = { ...dto };
    const role: UserRole = req.user?.role;
    const userId: string = req.user?.sub;
    if (role === 'TEACHER') {
      payload.teacherId = new Types.ObjectId(userId);
    }
    if (payload.regionId) payload.regionId = new Types.ObjectId(payload.regionId);
    if (payload.schoolId) payload.schoolId = new Types.ObjectId(payload.schoolId);
    if (payload.teacherId) payload.teacherId = new Types.ObjectId(payload.teacherId);
    // Teacher-created students default approved=false
    return this.studentsService.create(payload);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER')
  list(@Req() req: any, @Query() q: ListStudentsQuery) {
    const { page = 1, limit = 10, ...filters } = q as any;
    const casted: any = { ...filters };
    const role: UserRole = req.user?.role;
    const userId: string = req.user?.sub;
    if (role === 'TEACHER') {
      casted.teacherId = new Types.ObjectId(userId);
    }
    if (role === 'REGIONAL_ADMIN' && casted.regionId == null) {
      // default to own region if not provided
      casted.regionId = req.user?.regionId ? new Types.ObjectId(req.user.regionId) : undefined;
    }
    if (casted.regionId) casted.regionId = new Types.ObjectId(casted.regionId);
    if (casted.schoolId) casted.schoolId = new Types.ObjectId(casted.schoolId);
    if (casted.teacherId) casted.teacherId = new Types.ObjectId(casted.teacherId);
    return this.studentsService.findAll(page, limit, casted);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER')
  get(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: Partial<CreateStudentDto>) {
    const payload: any = { ...dto };
    const role: UserRole = req.user?.role;
    if (payload.regionId) payload.regionId = new Types.ObjectId(payload.regionId);
    if (payload.schoolId) payload.schoolId = new Types.ObjectId(payload.schoolId);
    if (payload.teacherId) payload.teacherId = new Types.ObjectId(payload.teacherId);
    if (role === 'REGIONAL_ADMIN') {
      const me = await this.userModel.findById(req.user?.sub).lean();
      const student = await this.studentsService.findOne(id);
      if (me?.regionId && student && String((student as any).regionId || '') !== String(me.regionId)) {
        throw new ForbiddenException('Cannot modify student outside your region');
      }
    }
    return this.studentsService.update(id, payload);
  }

  @Patch(':id/approve')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async approve(@Req() req: any, @Param('id') id: string) {
    const me = await this.userModel.findById(req.user?.sub).lean();
    const student = await this.studentsService.findOne(id);
    if (me?.regionId && student && String((student as any).regionId || '') !== String(me.regionId)) {
      throw new ForbiddenException('Cannot approve student outside your region');
    }
    return this.studentsService.update(id, { approved: true } as any);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }

  @Get('export')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async export(@Res() res: Response) {
    const { items } = await this.studentsService.findAll(1, 100000);
    const headers = ['fullName', 'email', 'regionId', 'schoolId', 'teacherId', 'approved'];
    const lines = [headers.join(',')].concat(
      items.map((s: any) => [
        s.fullName || '',
        s.email || '',
        s.regionId || '',
        s.schoolId || '',
        s.teacherId || '',
        s.approved ? 'true' : 'false',
      ].join(',')),
    );
    const csv = lines.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
    res.send(csv);
  }

  @Post('import')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  async import(@UploadedFile() file?: Express.Multer.File) {
    if (!file || !file.buffer) return { imported: 0 };
    const text = file.buffer.toString('utf-8');
    const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',').map((h) => h.trim());
    const idx = (h: string) => headers.indexOf(h);
    const fullNameIdx = idx('fullName');
    const emailIdx = idx('email');
    const regionIdx = idx('regionId');
    const schoolIdx = idx('schoolId');
    const teacherIdx = idx('teacherId');
    const approvedIdx = idx('approved');
    let imported = 0;
    for (const row of rows) {
      const cols = row.split(',');
      const fullName = cols[fullNameIdx]?.trim();
      if (!fullName) continue;
      const payload: any = {
        fullName,
        email: cols[emailIdx]?.trim() || undefined,
        regionId: cols[regionIdx]?.trim() || undefined,
        schoolId: cols[schoolIdx]?.trim() || undefined,
        teacherId: cols[teacherIdx]?.trim() || undefined,
        approved: (cols[approvedIdx]?.trim() || '').toLowerCase() === 'true',
      };
      if (payload.regionId) payload.regionId = new Types.ObjectId(payload.regionId);
      if (payload.schoolId) payload.schoolId = new Types.ObjectId(payload.schoolId);
      if (payload.teacherId) payload.teacherId = new Types.ObjectId(payload.teacherId);
      await this.studentsService.create(payload);
      imported++;
    }
    return { imported };
  }

  @Get(':id/progress')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER')
  async progress(@Req() req: any, @Param('id') id: string) {
    const role: UserRole = req.user?.role;
    const me = await this.userModel.findById(req.user?.sub).lean();
    const student = await this.studentsService.findOne(id);
    if (!student) return { items: [], totals: { completed: 0, total: 0 } };
    if (role === 'REGIONAL_ADMIN' && me?.regionId && String((student as any).regionId || '') !== String(me.regionId)) {
      throw new ForbiddenException('Cannot view student outside your region');
    }
    if (role === 'TEACHER' && String((student as any).teacherId || '') !== String(req.user?.sub || '')) {
      throw new ForbiddenException('Cannot view student who is not yours');
    }
    const progress = (student as any).progress || {};
    const items = Object.keys(progress)
      .filter((k) => k.startsWith('assessment_'))
      .map((k) => ({ assessmentId: k.replace('assessment_', ''), ...progress[k] }));
    const completed = items.filter((i) => typeof i.score === 'number').length;
    const total = items.length;
    return { items, totals: { completed, total } };
  }

  @Get(':id/next-step')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER')
  async nextStep(@Req() req: any, @Param('id') id: string) {
    const role: UserRole = req.user?.role;
    const me = await this.userModel.findById(req.user?.sub).lean();
    const student = await this.studentsService.findOne(id);
    if (!student) return { nextTopic: null, nextItem: null };
    if (role === 'REGIONAL_ADMIN' && me?.regionId && String((student as any).regionId || '') !== String(me.regionId)) {
      throw new ForbiddenException('Cannot view student outside your region');
    }
    if (role === 'TEACHER' && String((student as any).teacherId || '') !== String(req.user?.sub || '')) {
      throw new ForbiddenException('Cannot view student who is not yours');
    }
    const progress = (student as any).progress || {};
    // Find next topic within student's region's conservations is broad; instead, pick next incomplete topic globally by order
    const topics = await this.topicModel.find({}).sort({ order: 1, createdAt: 1 }).lean();
    let nextTopic: any = null;
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      const completed = Boolean(progress[`topic_${t._id}`]?.completed);
      if (!completed) {
        // check prior topic completion within same conservation
        const same = topics.filter((x) => String(x.conservationId) === String(t.conservationId));
        same.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        const idx = same.findIndex((x) => String(x._id) === String(t._id));
        if (idx > 0) {
          const prior = same[idx - 1];
          const priorCompleted = Boolean(progress[`topic_${prior._id}`]?.completed);
          if (!priorCompleted) continue;
        }
        nextTopic = t;
        break;
      }
    }
    if (!nextTopic) return { nextTopic: null, nextItem: null };
    const firstItem = await this.itemModel.findOne({ topicId: nextTopic._id }).sort({ order: 1, createdAt: 1 }).lean();
    return { nextTopic, nextItem: firstItem || null };
  }
}

