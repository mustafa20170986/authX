import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignupDto } from 'dto/credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role/role.guard';
import { Role } from 'src/role/role.decorator';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly JWTService: JwtService,
  ) {}
  @Post('refresh')
  async RefreshToken(@Body('refreshToken') refreshToken: string) {
    try {
      const payload = await this.JWTService.verify(refreshToken, {
        secret: process.env.JWT_secret || 'refresh_token_secret',
      });
      await this.authservice.refreshtoken_rotation(payload.sub, refreshToken);
    } catch (error) {
      console.log(error);
    }
  }
  @Post('SignUp')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async Signup(@Body() dto: SignupDto) {
    return this.authservice.SignUp(dto);
  }
  @Post('login')
  @UseGuards(AuthGuard('local'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async Sigin(@Request() req, @Body() dto: SignupDto) {
    return this.authservice.Signin(req.user);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role('admin')
  @Get('admin')
  getadmin(@Req() req) {
    return this.authservice.admin(req.user);
  }
}
