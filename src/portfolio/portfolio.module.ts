import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PositionModule } from 'src/position/position.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PositionRepository } from 'src/position/position.repo';

@Module({
  imports: [PrismaService, PositionModule],
  providers: [PrismaService, PositionRepository, PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
