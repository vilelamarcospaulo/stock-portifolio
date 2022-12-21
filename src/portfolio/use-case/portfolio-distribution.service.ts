import { Injectable } from '@nestjs/common';
import { PortfolioValuation } from './portfolio-valuation.service';

@Injectable()
export class PortfolioDistribution {
  constructor(private portfolioValuation: PortfolioValuation) {}

  async calcPortfolioDistribution(userId: number) {
    const portfolio =
      await this.portfolioValuation.calcPortfolioCurrentValuation(userId);

    const portfolioTotalScore = portfolio.positions
      .map((p) => p.score)
      .reduce((acc, curr) => acc + curr, 0);

    const positions = portfolio.positions.map((position) => {
      const current = position.investedAmount / portfolio.investedAmount;
      const suggestion = position.score / portfolioTotalScore;

      return {
        ...position,
        distribution: {
          current,
          suggestion,
        },
      };
    });

    return {
      ...portfolio,
      portfolioTotalScore,
      positions,
    };
  }
}
