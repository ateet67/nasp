import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Region, RegionDocument } from '@models/region.model';

@Injectable()
export class RegionsService {
  constructor(@InjectModel(Region.name) private readonly regionModel: Model<RegionDocument>) {}

  create(data: Partial<Region>) {
    return this.regionModel.create(data);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.regionModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      this.regionModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const region = await this.regionModel.findById(id).lean();
    if (!region) throw new NotFoundException('Region not found');
    return region;
  }

  async update(id: string, data: Partial<Region>) {
    const updated = await this.regionModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) throw new NotFoundException('Region not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.regionModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('Region not found');
    return { deleted: true };
  }
}

