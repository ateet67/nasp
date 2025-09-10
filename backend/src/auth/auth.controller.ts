import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto, SetPasswordDto } from '../dtos/auth.dto';
import { SignupDto } from '../dtos/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto.email, dto.fullName, dto.password);
  }

  @Post('forgot-password')
  forgot(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  reset(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('set-password')
  setPassword(@Req() req: any, @Body() dto: SetPasswordDto) {
    const id = req.user?.sub;
    return this.authService.setPassword(id, dto.newPassword);
  }
}
