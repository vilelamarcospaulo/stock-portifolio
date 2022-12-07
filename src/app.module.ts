import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [PrismaModule, PortfolioModule],
})
export class AppModule {}
