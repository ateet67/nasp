import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Assessment, AssessmentDocument } from '../../../models/assessment.model';

@Injectable()
export class AssessmentsService {
  constructor(@InjectModel(Assessment.name) private readonly assessModel: Model<AssessmentDocument>) {}

  create(data: Partial<Assessment>) {
    return this.assessModel.create(data);
  }

  async findAll(page = 1, limit = 10, topicId?: string, conservationId?: string) {
    const filter: any = {};
    if (topicId) filter.topicId = new Types.ObjectId(topicId);
    if (conservationId) filter.conservationId = new Types.ObjectId(conservationId);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.assessModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      this.assessModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const doc = await this.assessModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Assessment not found');
    return doc;
  }

  async update(id: string, data: Partial<Assessment>) {
    const updated = await this.assessModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) throw new NotFoundException('Assessment not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.assessModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('Assessment not found');
    return { deleted: true };
  }
}
