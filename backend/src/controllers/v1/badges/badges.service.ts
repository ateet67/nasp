import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Badge, BadgeDocument, BadgeType } from '../../../models/badge.model';
import { StudentBadge, StudentBadgeDocument } from '../../../models/student-badge.model';
import { CreateBadgeDto } from '../../../dtos/badges.dto';

@Injectable()
export class BadgesService {
  constructor(
    @InjectModel(Badge.name) private readonly badgeModel: Model<BadgeDocument>,
    @InjectModel(StudentBadge.name) private readonly studentBadgeModel: Model<StudentBadgeDocument>,
  ) {}

  async createBadge(dto: CreateBadgeDto) {
    const payload: Partial<Badge> = {
      name: dto.name,
      description: dto.description,
      type: dto.type,
      iconUrl: dto.iconUrl,
      points: dto.points,
      requiredScore: dto.requiredScore,
      conservationId: dto.conservationId ? new Types.ObjectId(dto.conservationId) : undefined,
      topicId: dto.topicId ? new Types.ObjectId(dto.topicId) : undefined,
    };
    return this.badgeModel.create(payload);
  }

  async getAllBadges() {
    return this.badgeModel.find().sort({ points: 1 }).lean();
  }

  async getStudentBadges(studentId: string) {
    return this.studentBadgeModel
      .find({ studentId: new Types.ObjectId(studentId) })
      .populate('badgeId')
      .sort({ earnedAt: -1 })
      .lean();
  }

  async checkAndAwardBadges(studentId: string, assessmentResult: {
    assessmentId: string;
    score: number;
    total: number;
    topicId?: string;
    conservationId?: string;
  }) {
    const percentage = Math.round((assessmentResult.score / assessmentResult.total) * 100);
    const badges: any[] = [];

    // Check for assessment excellence badge
    if (percentage >= 80) {
      const excellenceBadge = await this.badgeModel.findOne({
        type: BadgeType.ASSESSMENT_EXCELLENCE,
        requiredScore: { $lte: percentage },
      }).lean();

      if (excellenceBadge) {
        const existing = await this.studentBadgeModel.findOne({
          studentId: new Types.ObjectId(studentId),
          badgeId: excellenceBadge._id,
        }).lean();

        if (!existing) {
          await this.studentBadgeModel.create({
            studentId: new Types.ObjectId(studentId),
            badgeId: excellenceBadge._id,
            score: percentage,
          });
          badges.push(excellenceBadge);
        }
      }
    }

    // Check for topic completion badge
    if (assessmentResult.topicId && percentage >= 60) {
      const topicBadge = await this.badgeModel.findOne({
        type: BadgeType.TOPIC_COMPLETION,
        topicId: new Types.ObjectId(assessmentResult.topicId),
      }).lean();

      if (topicBadge) {
        const existing = await this.studentBadgeModel.findOne({
          studentId: new Types.ObjectId(studentId),
          badgeId: topicBadge._id,
        }).lean();

        if (!existing) {
          await this.studentBadgeModel.create({
            studentId: new Types.ObjectId(studentId),
            badgeId: topicBadge._id,
            score: percentage,
          });
          badges.push(topicBadge);
        }
      }
    }

    // Check for conservation completion badge
    if (assessmentResult.conservationId && percentage >= 60) {
      const conservationBadge = await this.badgeModel.findOne({
        type: BadgeType.CONSERVATION_COMPLETION,
        conservationId: new Types.ObjectId(assessmentResult.conservationId),
      }).lean();

      if (conservationBadge) {
        const existing = await this.studentBadgeModel.findOne({
          studentId: new Types.ObjectId(studentId),
          badgeId: conservationBadge._id,
        }).lean();

        if (!existing) {
          await this.studentBadgeModel.create({
            studentId: new Types.ObjectId(studentId),
            badgeId: conservationBadge._id,
            score: percentage,
          });
          badges.push(conservationBadge);
        }
      }
    }

    return badges;
  }

  async getStudentProgress(studentId: string) {
    const badges = await this.getStudentBadges(studentId);
    const totalPoints = badges.reduce((sum, sb: any) => sum + (sb.badgeId?.points || 0), 0);
    
    return {
      totalBadges: badges.length,
      totalPoints,
      badges: badges.map((sb: any) => ({
        ...sb.badgeId,
        earnedAt: sb.earnedAt,
        score: sb.score,
      })),
    };
  }
}
