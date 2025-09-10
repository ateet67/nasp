import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateRegionDto, RegionsListQuery } from '@dtos/regions.dto';
import { RegionsService } from './regions.service';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() dto: CreateRegionDto) {
    return this.regionsService.create(dto);
  }

  @Get()
  list(@Query() q: RegionsListQuery) {
    const { page = 1, limit = 10, search } = q;
    return this.regionsService.findAll(page, limit, search);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.regionsService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  update(@Param('id') id: string, @Body() dto: Partial<CreateRegionDto>) {
    return this.regionsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.regionsService.remove(id);
  }
}

