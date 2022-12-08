import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PositionService {
  constructor(private prisma: PrismaService) {}

  async byUser(userId: number) {
    return this.prisma.position.findMany({
      where: { userId },
    });
  }
}
