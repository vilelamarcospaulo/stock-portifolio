import { Inject, Injectable } from '@nestjs/common';
import { PositionRepository } from 'src/position/position.repo';
import { StockProviderService } from 'src/portfolio/ports/stock-provider.service';

@Injectable()
export class PortfolioValuation {
  constructor(
    private positionRepository: PositionRepository,

    @Inject(StockProviderService)
    private stockProviderService: StockProviderService,
  ) {}

  async calcPortfolioCurrentValuation(userId: number) {
    const portfolio = await this.positionRepository.findByUser(userId);
    const portfolioTickers = portfolio.map((x) => x.ticker);
    const portfolioPrices = await this.stockProviderService.getStockPrices(
      portfolioTickers,
    );

    let investedAmount = 0;
    let currentAmount = 0;
    const positions = portfolio.map((position) => {
      const { ticker, amount, middlePrice } = position;
      const price = portfolioPrices[ticker];

      const invested = amount * middlePrice;
      const current = amount * price;

      investedAmount += invested;
      currentAmount += current;

      return {
        ...position,
        price,
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
}
