import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: request.user!.userId },
      select: { role: true },
    });

    return user.role === 'ADMIN';
  }
}
