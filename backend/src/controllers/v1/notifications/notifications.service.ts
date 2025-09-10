import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from '../../../models/notification.model';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: Record<string, any>;
  }) {
    return this.notificationModel.create({
      userId: new Types.ObjectId(data.userId),
      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata || {},
    });
  }

  async getUserNotifications(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find({ userId: new Types.ObjectId(userId) })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.notificationModel.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return { notifications, total, page, limit };
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.updateOne(
      { _id: notificationId, userId: new Types.ObjectId(userId) },
      { $set: { read: true } }
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId: new Types.ObjectId(userId) },
      { $set: { read: true } }
    );
  }

  async getUnreadCount(userId: string) {
    return this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      read: false,
    });
  }

  async notifyStudentApproval(studentId: string, studentName: string, teacherId: string) {
    return this.createNotification({
      userId: teacherId,
      type: NotificationType.STUDENT_APPROVAL,
      title: 'Student Approval Required',
      message: `${studentName} has been added and requires your approval.`,
      metadata: { studentId },
    });
  }

  async notifyBadgeEarned(userId: string, badgeName: string) {
    return this.createNotification({
      userId,
      type: NotificationType.BADGE_EARNED,
      title: 'Badge Earned!',
      message: `Congratulations! You've earned the "${badgeName}" badge.`,
      metadata: { badgeName },
    });
  }

  async notifyAssessmentCompleted(userId: string, assessmentName: string, score: number, total: number) {
    const percentage = Math.round((score / total) * 100);
    return this.createNotification({
      userId,
      type: NotificationType.ASSESSMENT_COMPLETED,
      title: 'Assessment Completed',
      message: `You completed "${assessmentName}" with a score of ${score}/${total} (${percentage}%).`,
      metadata: { assessmentName, score, total, percentage },
    });
  }

  async notifyConservationUnlocked(userId: string, conservationName: string) {
    return this.createNotification({
      userId,
      type: NotificationType.CONSERVATION_UNLOCKED,
      title: 'New Conservation Unlocked!',
      message: `You've unlocked "${conservationName}" conservation. Start exploring!`,
      metadata: { conservationName },
    });
  }
}
