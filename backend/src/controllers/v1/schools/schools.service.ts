import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { School, SchoolDocument } from './schools.schema';

@Injectable()
export class SchoolsService {
  constructor(@InjectModel(School.name) private readonly schoolModel: Model<SchoolDocument>) {}

  create(data: Partial<School>) {
    return this.schoolModel.create(data);
  }

  async findAll(page = 1, limit = 10, search?: string, regionId?: string) {
    const filter: any = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (regionId) filter.regionId = new Types.ObjectId(regionId);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.schoolModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      this.schoolModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const school = await this.schoolModel.findById(id).lean();
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async update(id: string, data: Partial<School>) {
    const updated = await this.schoolModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) throw new NotFoundException('School not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.schoolModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('School not found');
    return { deleted: true };
  }
}

