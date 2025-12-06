import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { wallet_address: string; email?: string; referral_code?: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { wallet_address: string; signature: string; nonce: string }) {
    return this.authService.login(body);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refresh(body.refresh_token);
  }
}