import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperAdminSeedService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async seedSuperAdmin() {
    const superAdminEmail = 'superadmin@nasp.com';
    
    // Check if super admin already exists
    const existingAdmin = await this.userModel.findOne({ 
      email: superAdminEmail 
    }).lean();
    
    if (existingAdmin) {
      console.log('Super Admin already exists');
      return existingAdmin;
    }

    // Create super admin
    const passwordHash = await bcrypt.hash('SuperAdmin123!', 10);
    const superAdmin = await this.userModel.create({
      email: superAdminEmail,
      fullName: 'Super Administrator',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    });

    console.log('Super Admin created successfully');
    return superAdmin;
  }

  async runSeed() {
    try {
      await this.seedSuperAdmin();
      console.log('Super Admin seeding completed');
    } catch (error) {
      console.error('Super Admin seeding failed:', error);
      throw error;
    }
  }
}
