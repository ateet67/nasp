import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '@models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async createSuperAdminIfMissing(): Promise<void> {
    const existing = await this.userModel.findOne({ role: UserRole.SUPER_ADMIN }).lean();
    if (existing) return;
    const email = process.env.SEED_SUPER_ADMIN_EMAIL ?? 'admin@capnasp.local';
    const password = process.env.SEED_SUPER_ADMIN_PASSWORD ?? 'ChangeMe123!';
    const passwordHash = await bcrypt.hash(password, 10);
    await this.userModel.create({ email, passwordHash, fullName: 'Super Admin', role: UserRole.SUPER_ADMIN });
  }
}
