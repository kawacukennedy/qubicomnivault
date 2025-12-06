import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import * as ethers from 'ethers';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: { wallet_address: string; email?: string; referral_code?: string }) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { wallet_address: data.wallet_address },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      wallet_address: data.wallet_address,
      email: data.email,
      q_score: 50, // Default Q-score
      kyc_status: 'unverified',
    });

    const savedUser = await this.userRepository.save(user);

    const payload = { sub: savedUser.id, wallet: savedUser.wallet_address };
    const jwt = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      user_id: savedUser.id,
      jwt,
      refresh_token: refreshToken,
      user: {
        id: savedUser.id,
        wallet_address: savedUser.wallet_address,
        email: savedUser.email,
        q_score: savedUser.q_score,
        kyc_status: savedUser.kyc_status,
      },
    };
  }

  async login(data: { wallet_address: string; signature: string; nonce: string }) {
    // Verify signature
    const message = `Login to Qubic OmniVault with nonce: ${data.nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, data.signature);

    if (recoveredAddress.toLowerCase() !== data.wallet_address.toLowerCase()) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Find or create user
    let user = await this.userRepository.findOne({
      where: { wallet_address: data.wallet_address },
    });

    if (!user) {
      user = this.userRepository.create({
        wallet_address: data.wallet_address,
        q_score: 50,
        kyc_status: 'unverified',
      });
      user = await this.userRepository.save(user);
    }

    const payload = { sub: user.id, wallet: user.wallet_address };
    const jwt = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    return {
      jwt,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        wallet_address: user.wallet_address,
        email: user.email,
        q_score: user.q_score,
        kyc_status: user.kyc_status,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newJwt = this.jwtService.sign({ sub: payload.sub, wallet: payload.wallet });
      const newRefresh = this.jwtService.sign({ sub: payload.sub, wallet: payload.wallet }, { expiresIn: '30d' });
      return { jwt: newJwt, refresh_token: newRefresh };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getNonce(): Promise<{ nonce: string }> {
    // Generate a random nonce
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return { nonce };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      wallet_address: user.wallet_address,
      email: user.email,
      q_score: user.q_score,
      kyc_status: user.kyc_status,
      created_at: user.created_at,
    };
  }
}