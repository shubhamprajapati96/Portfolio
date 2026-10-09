import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { StoreService } from '../../common/services/store.service';

@Injectable()
export class AuthService {
  constructor(private readonly storeService: StoreService) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required.');
    }

    const admin = await this.storeService.findAdminByEmail(email);
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    await this.storeService.updateAdminLastLogin(admin._id);

    const secret = process.env.JWT_SECRET || 'shubham_portfolio_secure_jwt_secret_token_2026_xyz';
    const payload = {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    };

    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    return {
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };
  }

  async getProfile(userId: string) {
    const admin = await this.storeService.findAdminByEmail(
      process.env.ADMIN_EMAIL || 'shubh-tech96@gmail.com'
    );
    return {
      success: true,
      user: {
        id: admin?._id || userId,
        email: admin?.email,
        name: admin?.name,
        role: admin?.role || 'admin',
        lastLoginAt: admin?.lastLoginAt
      }
    };
  }
}
