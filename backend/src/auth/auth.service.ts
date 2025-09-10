import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../controllers/v1/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import { ResetToken, ResetTokenDocument } from '../models/reset-token.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ResetToken.name) private readonly resetModel: Model<ResetTokenDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, (user as any).passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: (user as any)._id.toString(), role: (user as any).role };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token, user };
  }

  async signup(email: string, fullName: string, password: string) {
    const existing = await this.userModel.findOne({ email }).lean();
    if (existing) throw new BadRequestException('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await this.userModel.create({ email, fullName, passwordHash, role: 'STUDENT' });
    const payload = { sub: (created as any)._id.toString(), role: 'STUDENT' };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token, user: { _id: (created as any)._id, email, fullName, role: 'STUDENT' } };
  }

  async setPassword(userId: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne({ _id: userId }, { $set: { passwordHash } });
    return { ok: true };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email }).lean();
    if (!user) return { ok: true };
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    await this.resetModel.create({ userId: (user as any)._id, token, expiresAt, used: false });
    // TODO: integrate mailer - for now return token for testing
    return { ok: true, token };
  }

  async resetPassword(token: string, newPassword: string) {
    const entry = await this.resetModel.findOne({ token, used: false, expiresAt: { $gt: new Date() } });
    if (!entry) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne({ _id: entry.userId }, { $set: { passwordHash } });
    entry.used = true;
    await entry.save();
    return { ok: true };
  }
}
