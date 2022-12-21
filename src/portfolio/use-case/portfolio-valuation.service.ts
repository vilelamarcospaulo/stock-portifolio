import { Injectable } from '@nestjs/common';
import { Position } from '@prisma/client';
import { PositionRepository } from 'src/position/position.repo';
import { StockProviderService } from 'src/stock-provider/stock-provider.service';

@Injectable()
export class PortfolioValuation {
  constructor(
    private positionRepository: PositionRepository,
    private stockProviderService: StockProviderService,
  ) {}

  async calcPortfolioCurrentValuation(userId: number) {
    const portfolio = await this.positionRepository.findByUser(userId);
    const portfolioPrices = await this.indexedStockPrices(portfolio);

    let investedAmount = 0;
    let currentAmount = 0;
    const positions = portfolio.map((position) => {
      const { ticker, amount, middlePrice } = position;
      const invested = amount * middlePrice;
      const current = amount * portfolioPrices[ticker];

      investedAmount += invested;
      currentAmount += current;

      return {
        ...position,
        investedAmount: invested,
        currentAmount: current,
      };
    });

    return {
      investedAmount,
      currentAmount,
      positions,
    };
  }

  private async indexedStockPrices(
    portfolio: Position[],
  ): Promise<{ [key: string]: number }> {
    const portfolioStocks = await Promise.all(
      portfolio
        .map((position) => position.ticker)
        .map(async (ticker) => ({
          ticker,
          value: await this.stockProviderService.getLastStockPrice(ticker),
        })),
    );

    return Object.fromEntries(portfolioStocks.map((x) => [x.ticker, x.value]));
  }
}
