import { Body, Controller, Get, Post, UseGuards, Req, Param } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from '@dtos/badges.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN')
  create(@Body() dto: CreateBadgeDto) {
    return this.badgesService.createBadge(dto);
  }

  @Get()
  async getAllBadges() {
    return this.badgesService.getAllBadges();
  }

  @Get('my-badges')
  @Roles('STUDENT')
  async getMyBadges(@Req() req: any) {
    // For students, we need to get student ID from user
    // This would need to be implemented based on your user-student relationship
    const userId = req.user?.sub;
    // You might need to find student by user ID or email
    return this.badgesService.getStudentProgress(userId);
  }

  @Get('student/:studentId')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER')
  async getStudentBadges(@Param('studentId') studentId: string) {
    return this.badgesService.getStudentBadges(studentId);
  }
}
