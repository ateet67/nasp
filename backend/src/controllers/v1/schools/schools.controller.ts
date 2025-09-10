import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Res, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { CreateSchoolDto, SchoolsListQuery } from '@dtos/schools.dto';
import { SchoolsService } from './schools.service';
import { Types } from 'mongoose';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  create(@Req() req: any, @Body() dto: CreateSchoolDto) {
    const payload: any = { ...dto };
    // Regional admin defaults regionId to own region if not provided
    if (!payload.regionId && req.user?.role === 'REGIONAL_ADMIN' && req.user?.regionId) {
      payload.regionId = req.user.regionId;
    }
    if (payload.regionId) payload.regionId = new Types.ObjectId(payload.regionId);
    return this.schoolsService.create(payload);
  }

  @Get()
  list(@Req() req: any, @Query() q: SchoolsListQuery) {
    let { page = 1, limit = 10, search, regionId } = q;
    if (!regionId && req.user?.role === 'REGIONAL_ADMIN' && req.user?.regionId) {
      regionId = req.user.regionId;
    }
    return this.schoolsService.findAll(page, limit, search, regionId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: Partial<CreateSchoolDto>) {
    const payload: any = { ...dto };
    if (!payload.regionId && req.user?.role === 'REGIONAL_ADMIN' && req.user?.regionId) {
      payload.regionId = req.user.regionId;
    }
    if (payload.regionId) payload.regionId = new Types.ObjectId(payload.regionId);
    return this.schoolsService.update(id, payload);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(id);
  }

  @Get('export')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  async exportSchools(@Res() res: Response) {
    const { items } = await this.schoolsService.findAll(1, 100000);
    const headers = ['name', 'regionId', 'address', 'imageUrl'];
    const lines = [headers.join(',')].concat(
      items.map((s: any) => [s.name, s.regionId || '', s.address || '', s.imageUrl || ''].join(',')),
    );
    const csv = lines.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="schools.csv"');
    res.send(csv);
  }

  @Post('import')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  async importSchools(@UploadedFile() file?: Express.Multer.File) {
    if (!file || !file.buffer) return { imported: 0 };
    const text = file.buffer.toString('utf-8');
    const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',').map((h) => h.trim());
    const nameIdx = headers.indexOf('name');
    const regionIdx = headers.indexOf('regionId');
    const addressIdx = headers.indexOf('address');
    const imageIdx = headers.indexOf('imageUrl');
    let imported = 0;
    for (const row of rows) {
      const cols = row.split(',');
      const name = cols[nameIdx]?.trim();
      if (!name) continue;
      const payload: any = {
        name,
        regionId: cols[regionIdx]?.trim() || undefined,
        address: cols[addressIdx]?.trim() || undefined,
        imageUrl: cols[imageIdx]?.trim() || undefined,
      };
      await this.schoolsService.create(payload);
      imported++;
    }
    return { imported };
  }
}
