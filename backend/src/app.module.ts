import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './controllers/v1/users/users.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './controllers/v1/uploads/uploads.module';
import { RegionsModule } from './controllers/v1/regions/regions.module';
import { SchoolsModule } from './controllers/v1/schools/schools.module';
import { ConservationsModule } from './controllers/v1/conservations/conservations.module';
import { TopicsModule } from './controllers/v1/topics/topics.module';
import { ItemsModule } from './controllers/v1/items/items.module';
import { AssessmentsModule } from './controllers/v1/assessments/assessments.module';
import { StudentsModule } from './controllers/v1/students/students.module';
import { StudentPortalModule } from './controllers/v1/students/student-portal.module';
import { BadgesModule } from './controllers/v1/badges/badges.module';
import { NotificationsModule } from './controllers/v1/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        // Allow running without a local MongoDB by using an in-memory server in dev
        if (process.env.USE_IN_MEMORY_DB === 'true') {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongoServer = await MongoMemoryServer.create();
          const uri = mongoServer.getUri();
          return { uri };
        }
        return { uri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/cap_nasp' };
      },
    }),
    UsersModule,
    AuthModule,
    UploadsModule,
    RegionsModule,
    SchoolsModule,
    ConservationsModule,
    TopicsModule,
    ItemsModule,
    AssessmentsModule,
    StudentsModule,
    StudentPortalModule,
    BadgesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
