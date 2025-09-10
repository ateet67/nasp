import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from '../../../models/item.model';

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>) {}

  create(data: Partial<Item> & { topicId?: string | Types.ObjectId }) {
    const payload: any = { ...data };
    if (typeof payload.topicId === 'string') {
      payload.topicId = new Types.ObjectId(payload.topicId);
    }
    return this.itemModel.create(payload);
  }

  async findAll(page = 1, limit = 10, topicId?: string, search?: string) {
    const filter: any = {};
    if (topicId) filter.topicId = new Types.ObjectId(topicId);
    if (search) filter.title = { $regex: search, $options: 'i' };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.itemModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      this.itemModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const doc = await this.itemModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Item not found');
    return doc;
  }

  async update(id: string, data: Partial<Item> & { topicId?: string | Types.ObjectId }) {
    const payload: any = { ...data };
    if (typeof payload.topicId === 'string') {
      payload.topicId = new Types.ObjectId(payload.topicId);
    }
    const updated = await this.itemModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!updated) throw new NotFoundException('Item not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.itemModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('Item not found');
    return { deleted: true };
  }
}
