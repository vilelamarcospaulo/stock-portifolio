import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async buildPortfolioForUser(userId: number) {
    const userStocks = await this.prisma.stock.findMany({
      where: { userId: userId },
    });

    return userStocks;
  }
}
