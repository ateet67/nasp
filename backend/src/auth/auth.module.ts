import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ResetToken, ResetTokenSchema } from '../models/reset-token.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../controllers/v1/users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'please_change_me',
    }),
    MongooseModule.forFeature([{ name: ResetToken.name, schema: ResetTokenSchema }]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
