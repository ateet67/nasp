import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from '@models/student.model';

@Injectable()
export class StudentsService {
  constructor(@InjectModel(Student.name) private readonly studentModel: Model<StudentDocument>) {}

  create(data: Partial<Student>) {
    return this.studentModel.create(data);
  }

  async findAll(page = 1, limit = 10, filters: any = {}) {
    const filter: any = { ...filters };
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.studentModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      this.studentModel.countDocuments(filter),
    ]);
    return { items, total, page, limit };
  }

  findOne(id: string) {
    return this.studentModel.findById(id).lean();
  }

  async update(id: string, data: Partial<Student>) {
    const updated = await this.studentModel.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!updated) throw new NotFoundException('Student not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.studentModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('Student not found');
    return { deleted: true };
  }
}

