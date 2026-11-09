import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignupDto } from 'dto/credentials.dto';
import { Model } from 'mongoose';
import { User } from 'schema/crednetials.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly JwtService: JwtService,
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  // Generate refresh token and access token
  async generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const access_token = this.JwtService.sign(payload, {
      secret: process.env.JWT_secret || 'access_token_secret',
      expiresIn: '10m',
    });
    const refresh_token = this.JwtService.sign(payload, {
      secret: process.env.JWT_secret || 'refresh_token_secret',
      expiresIn: '7d',
    });

    // Hash the refresh token
    const hashrt = await bcrypt.hash(refresh_token, 10);

    // Save using the correct field name: hashed_refresh_token
    await this.UserModel.findByIdAndUpdate(userId, {
      hashed_refresh_token: hashrt,
    });

    return { access_token, refresh_token };
  }

  async SignUp(dto: SignupDto) {
    const existingUser = await this.UserModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new Error('user with this email already exist');
    }

    const hashpassword = await bcrypt.hash(dto.password, 10);

    const createuser = await this.UserModel.create({
      ...dto,
      password: hashpassword,
    });

    const tokens = await this.generateToken(
      createuser.id,
      createuser.email,
      createuser.role,
    );

    return {
      ...tokens,
      user: {
        email: createuser.email,
        role: createuser.role,
      },
    };
  }

  async ValidateUser(email: string, password: string) {
    const user = await this.UserModel.findOne({ email: email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: userPassword, ...result } = user.toObject();
    return result;
  }

  async Signin(user: any) {
    const tokens = await this.generateToken(user._id, user.email, user.role);
    return {
      ...tokens,
      user: {
        email: user.email,
        role: user.role,
      },
    };
  }

  // Refresh token match logic
  async refreshtoken_rotation(userId: string, rt: string) {
    const finduser = await this.UserModel.findById(userId);

    // Check against hashed_refresh_token instead of refreshtoken
    if (!finduser || !finduser.hashed_refresh_token) {
      throw new Error('user or the refresh token is missing');
    }

    // Compare incoming refresh token with the stored hash
    const compareToken = await bcrypt.compare(
      rt,
      finduser.hashed_refresh_token,
    );
    if (!compareToken) {
      throw new Error('comparison failed');
    }

    // Generate new tokens
    const tokens = await this.generateToken(
      userId,
      finduser.email,
      finduser.role,
    );

    return {
      tokens,
    };
  }

  async admin(user: 'admin') {
    return { message: 'welcome admin' };
  }
}
