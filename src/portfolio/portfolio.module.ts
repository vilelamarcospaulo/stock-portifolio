import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { PositionModule } from 'src/position/position.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { PositionRepository } from 'src/position/position.repo';
import { PortfolioValuation } from './use-case/portfolio-valuation.service';
import { PortfolioDistribution } from './use-case/portfolio-distribution.service';
import { StockProviderModule } from 'src/stock-provider/stock-provider.module';

@Module({
  imports: [PrismaService, PositionModule, StockProviderModule],
  providers: [
    PrismaService,
    PositionRepository,
    PortfolioValuation,
    PortfolioDistribution,
    PortfolioService,
  ],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
