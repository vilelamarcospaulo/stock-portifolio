import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PositionService } from 'src/position/position.service';
import { PositionModule } from 'src/position/position.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaService, PositionModule],
  providers: [PrismaService, PositionService, PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
