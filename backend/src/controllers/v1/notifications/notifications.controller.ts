import { Controller, Get, Patch, Param, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER', 'STUDENT')
  async getNotifications(@Req() req: any, @Query() query: { page?: number; limit?: number }) {
    const userId = req.user?.sub;
    const { page = 1, limit = 10 } = query;
    return this.notificationsService.getUserNotifications(userId, page, limit);
  }

  @Get('unread-count')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER', 'STUDENT')
  async getUnreadCount(@Req() req: any) {
    const userId = req.user?.sub;
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER', 'STUDENT')
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.sub;
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('mark-all-read')
  @Roles('SUPER_ADMIN', 'REGIONAL_ADMIN', 'TEACHER', 'STUDENT')
  async markAllAsRead(@Req() req: any) {
    const userId = req.user?.sub;
    return this.notificationsService.markAllAsRead(userId);
  }
}
