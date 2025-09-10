import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Topic, TopicDocument } from '../../../models/topic.model';

@Injectable()
export class TopicsService {
  constructor(@InjectModel(Topic.name) private readonly topicModel: Model<TopicDocument>) {}

  create(data: Partial<Topic>) {
    return this.topicModel.create(data);
  }

  async findAll(page = 1, limit = 10, conservationId?: string, search?: string) {
    const filter: any = {};
    if (conservationId) filter.conservationId = new Types.ObjectId(conservationId);
    if (search) filter.title = { $regex: search, $options: 'i' };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.topicModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      this.topicModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const doc = await this.topicModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Topic not found');
    return doc;
  }

  async update(id: string, data: Partial<Topic>) {
    const updated = await this.topicModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) throw new NotFoundException('Topic not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.topicModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('Topic not found');
    return { deleted: true };
  }
}
