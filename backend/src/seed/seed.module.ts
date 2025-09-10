import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperAdminSeedService } from './super-admin.seed';
import { User, UserSchema } from '../models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [SuperAdminSeedService],
  exports: [SuperAdminSeedService],
})
export class SeedModule {}
