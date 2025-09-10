import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards, UploadedFile, UseInterceptors, Res, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '@models/user.model';
import { Roles } from '@common/decorators';
import { CreateUserDto, UpdateUserDto, UsersListQuery, UpdateMeDto } from '@dtos/users.dto';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

 

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  @Get('me')
  async me(@Req() req: any) {
    const id = req.user?.sub;
    const user = await this.userModel.findById(id).lean();
    return user;
  }

  @Put('me')
  async updateMe(@Req() req: any, @Body() dto: UpdateMeDto) {
    const id = req.user?.sub;
    await this.userModel.updateOne({ _id: id }, { $set: dto });
    return { ok: true };
  }

  @Post()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async create(@Req() req: any, @Body() dto: CreateUserDto) {
    const password = Math.random().toString(36).slice(2, 10) + 'A1!';
    const passwordHash = await bcrypt.hash(password, 10);
    const payload: any = { ...dto, passwordHash };
    if (req.user?.role === 'REGIONAL_ADMIN') {
      if (payload.role && payload.role !== UserRole.TEACHER) {
        throw new ForbiddenException('Regional Admin can only create TEACHER users');
      }
      payload.role = UserRole.TEACHER;
      payload.regionId = req.user?.regionId || payload.regionId;
    }
    return this.userModel.create(payload);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async list(@Req() req: any, @Query() q: UsersListQuery) {
    const { page = 1, limit = 10, search } = q;
    let { role } = q as any;
    const filter: any = {};
    if (req.user?.role === 'REGIONAL_ADMIN') {
      filter.regionId = req.user.regionId || undefined;
      role = role || UserRole.TEACHER;
    }
    if (search) filter.$or = [{ email: { $regex: search, $options: 'i' } }, { fullName: { $regex: search, $options: 'i' } }];
    if (role) filter.role = role;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).lean(),
      this.userModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }

  @Get(':id')
  @Roles('SUPER_ADMIN')
  getOne(@Param('id') id: string) {
    return this.userModel.findById(id).lean();
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    if (req.user?.role === 'REGIONAL_ADMIN') {
      const target = await this.userModel.findById(id).lean();
      if (!target || String(target.regionId || '') !== String(req.user?.regionId || '')) {
        throw new ForbiddenException('Cannot modify user outside your region');
      }
      if (dto.role && dto.role !== UserRole.TEACHER) {
        throw new ForbiddenException('Regional Admin can only manage TEACHER role');
      }
      // force region
      (dto as any).regionId = req.user?.regionId;
    }
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async remove(@Req() req: any, @Param('id') id: string) {
    if (req.user?.role === 'REGIONAL_ADMIN') {
      const target = await this.userModel.findById(id).lean();
      if (!target || String(target.regionId || '') !== String(req.user?.regionId || '')) {
        throw new ForbiddenException('Cannot delete user outside your region');
      }
    }
    return this.userModel.findByIdAndDelete(id).lean();
  }

  @Get('export')
  @Roles('SUPER_ADMIN')
  async exportUsers(@Res() res: Response) {
    const users = await this.userModel.find({}).lean();
    const headers = ['email', 'fullName', 'role', 'regionId', 'schoolId'];
    const lines = [headers.join(',')].concat(
      users.map((u: any) => [u.email, u.fullName, u.role || '', u.regionId || '', u.schoolId || ''].join(',')),
    );
    const csv = lines.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv);
  }

  @Post('import')
  @Roles('SUPER_ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  async importUsers(@UploadedFile() file?: Express.Multer.File) {
    if (!file || !file.buffer) return { imported: 0 };
    const text = file.buffer.toString('utf-8');
    const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',').map((h) => h.trim());
    const emailIdx = headers.indexOf('email');
    const fullNameIdx = headers.indexOf('fullName');
    const roleIdx = headers.indexOf('role');
    const regionIdx = headers.indexOf('regionId');
    const schoolIdx = headers.indexOf('schoolId');
    let imported = 0;
    for (const row of rows) {
      const cols = row.split(',');
      const email = cols[emailIdx]?.trim();
      if (!email) continue;
      const payload: any = {
        email,
        fullName: cols[fullNameIdx]?.trim() || '',
        role: (cols[roleIdx]?.trim() as UserRole) || UserRole.TEACHER,
        regionId: cols[regionIdx]?.trim() || undefined,
        schoolId: cols[schoolIdx]?.trim() || undefined,
      };
      const existing = await this.userModel.findOne({ email }).lean();
      if (existing) {
        await this.userModel.updateOne({ email }, { $set: payload });
      } else {
        const password = Math.random().toString(36).slice(2, 10) + 'A1!';
        payload.passwordHash = await bcrypt.hash(password, 10);
        await this.userModel.create(payload);
      }
      imported++;
    }
    return { imported };
  }
}

