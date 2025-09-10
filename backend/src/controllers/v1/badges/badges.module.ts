import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';
import { Badge, BadgeSchema } from '../../../models/badge.model';
import { StudentBadge, StudentBadgeSchema } from '../../../models/student-badge.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Badge.name, schema: BadgeSchema },
      { name: StudentBadge.name, schema: StudentBadgeSchema },
    ]),
  ],
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}
