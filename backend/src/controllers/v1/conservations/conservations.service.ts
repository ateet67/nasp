import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conservation, ConservationDocument } from '../../../models/conservation.model';

@Injectable()
export class ConservationsService {
  constructor(@InjectModel(Conservation.name) private readonly consModel: Model<ConservationDocument>) {}

  create(data: Partial<Conservation>) {
    return this.consModel.create(data);
  }

  async findAll(page = 1, limit = 10, regionId?: string, search?: string) {
    const filter: any = {};
    if (regionId) filter.regionId = new Types.ObjectId(regionId);
    if (search) filter.title = { $regex: search, $options: 'i' };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.consModel.find(filter).skip(skip).limit(limit).sort({ order: 1, createdAt: -1 }).lean(),
      this.consModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const doc = await this.consModel.findById(id).lean();
    if (!doc) throw new NotFoundException('Conservation not found');
    return doc;
  }

  async update(id: string, data: Partial<Conservation>) {
    const updated = await this.consModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) throw new NotFoundException('Conservation not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.consModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('Conservation not found');
    return { deleted: true };
  }
}
