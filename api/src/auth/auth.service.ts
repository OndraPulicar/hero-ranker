import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { UserInfoSchema } from '@hero-ranker/shared/schemas/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private static readonly INVALID_CREDENTIALS = `Invalid email or password.`;

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException(AuthService.INVALID_CREDENTIALS);
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException(AuthService.INVALID_CREDENTIALS);
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id });

    return { accessToken };
  }

  async getMe(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
      },
    });
    return UserInfoSchema.parse(user);
  }
}
