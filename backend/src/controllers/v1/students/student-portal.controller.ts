import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { StudentsService } from './students.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from '@models/student.model';
import { Conservation, ConservationDocument } from '@models/conservation.model';
import { Topic, TopicDocument } from '@models/topic.model';
import { Item, ItemDocument } from '@models/item.model';
import { Assessment, AssessmentDocument } from '@models/assessment.model';
import { CreateStudentDto } from '@dtos/students.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('student-portal')
export class StudentPortalController {
  constructor(
    private readonly authService: AuthService,
    private readonly studentsService: StudentsService,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel(Conservation.name)
    private readonly conservationModel: Model<ConservationDocument>,
    @InjectModel(Topic.name) private readonly topicModel: Model<TopicDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(Assessment.name)
    private readonly assessmentModel: Model<AssessmentDocument>,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateStudentDto & { password: string }) {
    // Create student record
    const student = await this.studentsService.create({
      fullName: dto.fullName,
      email: dto.email,
      regionId: dto.regionId ? new Types.ObjectId(dto.regionId) : undefined,
      schoolId: dto.schoolId ? new Types.ObjectId(dto.schoolId) : undefined,
      teacherId: dto.teacherId ? new Types.ObjectId(dto.teacherId) : undefined,
      approved: false, // Needs admin approval
    });

    // Create user account for login
    const userResult = await this.authService.signup(
      dto.email!,
      dto.fullName,
      dto.password,
    );

    return {
      student,
      user: userResult.user,
      accessToken: userResult.accessToken,
    };
  }

  @Post('login')
  async login(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('dashboard')
  @Roles('STUDENT')
  async getDashboard(@Req() req: any) {
    const userId = req.user?.sub;

    // Find student by email (assuming email is same as user email)
    const user = await this.authService['userModel'].findById(userId).lean();
    if (!user) throw new Error('User not found');

    const student = await this.studentModel
      .findOne({ email: user.email })
      .lean();
    if (!student) throw new Error('Student record not found');

    // Get student's region conservations
    const conservations = await this.conservationModel
      .find({ regionId: (student as any).regionId })
      .sort({ order: 1 })
      .lean();

    // Calculate progress for each conservation
    const progress = (student as any).progress || {};
    const conservationProgress = await Promise.all(
      conservations.map(async (conservation: any) => {
        const topics = await this.topicModel
          .find({ conservationId: conservation._id })
          .sort({ order: 1 })
          .lean();

        const completedTopics = topics.filter((topic: any) =>
          Boolean(progress[`topic_${topic._id}`]?.completed),
        ).length;

        const totalTopics = topics.length;
        const eligibleForFinal =
          totalTopics > 0 && completedTopics === totalTopics;

        return {
          ...conservation,
          progress: {
            completedTopics,
            totalTopics,
            eligibleForFinal,
          },
        };
      }),
    );

    // Get recent achievements/badges
    const achievements = Object.keys(progress)
      .filter((key) => key.startsWith('assessment_'))
      .map((key) => ({
        assessmentId: key.replace('assessment_', ''),
        ...progress[key],
      }))
      .filter(
        (achievement) =>
          achievement.score >= Math.ceil(achievement.total * 0.6),
      )
      .slice(-5); // Last 5 achievements

    return {
      student,
      conservations: conservationProgress,
      achievements,
      totalProgress: {
        completedAssessments: achievements.length,
        totalConservations: conservations.length,
        completedConservations: conservationProgress.filter(
          (c) => c.progress.eligibleForFinal,
        ).length,
      },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('conservations')
  @Roles('STUDENT')
  async getConservations(@Req() req: any) {
    const userId = req.user?.sub;

    const user = await this.authService['userModel'].findById(userId).lean();
    if (!user) throw new Error('User not found');

    const student = await this.studentModel
      .findOne({ email: user.email })
      .lean();
    if (!student) throw new Error('Student record not found');

    const conservations = await this.conservationModel
      .find({ regionId: (student as any).regionId })
      .sort({ order: 1 })
      .lean();

    return conservations;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('conservations/:conservationId/topics')
  @Roles('STUDENT')
  async getTopics(
    @Req() req: any,
    @Query('conservationId') conservationId: string,
  ) {
    const userId = req.user?.sub;

    const user = await this.authService['userModel'].findById(userId).lean();
    if (!user) throw new Error('User not found');

    const student = await this.studentModel
      .findOne({ email: user.email })
      .lean();
    if (!student) throw new Error('Student record not found');

    const topics = await this.topicModel
      .find({ conservationId: new Types.ObjectId(conservationId) })
      .sort({ order: 1 })
      .lean();

    const progress = (student as any).progress || {};

    // Check which topics are unlocked
    const unlockedTopics = await Promise.all(
      topics.map(async (topic: any, index: number) => {
        let unlocked = true;

        // First topic is always unlocked
        if (index > 0) {
          const previousTopic = topics[index - 1];
          unlocked = Boolean(progress[`topic_${previousTopic._id}`]?.completed);
        }

        return {
          ...topic,
          unlocked,
          completed: Boolean(progress[`topic_${topic._id}`]?.completed),
        };
      }),
    );

    return unlockedTopics;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('topics/:topicId/items')
  @Roles('STUDENT')
  async getItems(@Req() req: any, @Query('topicId') topicId: string) {
    const userId = req.user?.sub;

    const user = await this.authService['userModel'].findById(userId).lean();
    if (!user) throw new Error('User not found');

    const student = await this.studentModel
      .findOne({ email: user.email })
      .lean();
    if (!student) throw new Error('Student record not found');

    const items = await this.itemModel
      .find({ topicId: new Types.ObjectId(topicId) })
      .sort({ order: 1 })
      .lean();

    return items;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('topics/:topicId/assessment')
  @Roles('STUDENT')
  async getTopicAssessment(@Req() req: any, @Query('topicId') topicId: string) {
    const userId = req.user?.sub;

    const user = await this.authService['userModel'].findById(userId).lean();
    if (!user) throw new Error('User not found');

    const student = await this.studentModel
      .findOne({ email: user.email })
      .lean();
    if (!student) throw new Error('Student record not found');

    const assessment = await this.assessmentModel
      .findOne({ topicId: new Types.ObjectId(topicId) })
      .lean();

    return assessment;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('conservations/:conservationId/assessment')
  @Roles('STUDENT')
  async getConservationAssessment(
    @Req() req: any,
    @Query('conservationId') conservationId: string,
  ) {
    const userId = req.user?.sub;

    const user = await this.authService['userModel'].findById(userId).lean();
    if (!user) throw new Error('User not found');

    const student = await this.studentModel
      .findOne({ email: user.email })
      .lean();
    if (!student) throw new Error('Student record not found');

    const assessment = await this.assessmentModel
      .findOne({ conservationId: new Types.ObjectId(conservationId) })
      .lean();

    return assessment;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('assessments/submit')
  @Roles('STUDENT')
  async submitAssessment(
    @Req() req: any,
    @Body() dto: { assessmentId: string; answers: number[] },
  ) {
    const userId = req.user?.sub;

    const user = await this.authService['userModel'].findById(userId).lean();
    if (!user) throw new Error('User not found');

    const student = await this.studentModel
      .findOne({ email: user.email })
      .lean();
    if (!student) throw new Error('Student record not found');

    const assessment = await this.assessmentModel
      .findById(dto.assessmentId)
      .lean();
    if (!assessment) return { ok: false, score: 0, total: 0 };

    const answers = dto.answers || [];
    const total = assessment.questions.length;
    let score = 0;

    assessment.questions.forEach((q: any, idx: number) => {
      const selected = answers[idx];
      if (typeof selected !== 'number') return;
      if (q.options?.[selected]?.isCorrect) score++;
    });

    // Update student progress
    const updates: any = { $set: {} };
    updates.$set[`progress.assessment_${dto.assessmentId}`] = {
      score,
      total,
      at: new Date(),
    };

    const completion = score >= Math.ceil(total * 0.6);
    if (assessment.topicId) {
      updates.$set[`progress.topic_${assessment.topicId}`] = {
        completed: completion,
        lastAt: new Date(),
      };
    }
    if (assessment.conservationId && completion) {
      updates.$set[`progress.conservation_${assessment.conservationId}`] = {
        lastAssessmentPassed: true,
        lastAt: new Date(),
      };
    }

    await this.studentModel.updateOne({ _id: (student as any)._id }, updates);

    // Check if student earned a badge
    const badgeEarned = completion && score >= Math.ceil(total * 0.8); // 80% for badge

    return {
      ok: true,
      score,
      total,
      passed: completion,
      badgeEarned,
      percentage: Math.round((score / total) * 100),
    };
  }
}
