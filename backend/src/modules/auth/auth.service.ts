import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(data: { wallet_address: string; email?: string; referral_code?: string }) {
    // TODO: Save to DB
    const userId = 'uuid-1234';
    const payload = { sub: userId, wallet: data.wallet_address };
    const jwt = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    return { user_id: userId, jwt, refresh_token: refreshToken };
  }

  async login(data: { wallet_address: string; signature: string; nonce: string }) {
    // TODO: Verify signature
    const payload = { sub: 'uuid-1234', wallet: data.wallet_address };
    const jwt = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    return { jwt, refresh_token: refreshToken };
  }

  async refresh(refreshToken: string) {
    // TODO: Validate refresh token
    const payload = this.jwtService.verify(refreshToken);
    const newJwt = this.jwtService.sign({ sub: payload.sub, wallet: payload.wallet });
    const newRefresh = this.jwtService.sign({ sub: payload.sub, wallet: payload.wallet }, { expiresIn: '30d' });
    return { jwt: newJwt, refresh_token: newRefresh };
  }
}