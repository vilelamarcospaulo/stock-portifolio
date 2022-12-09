import { Injectable } from '@nestjs/common';
import { PositionRepository } from 'src/position/position.repo';

@Injectable()
export class PortfolioDistributionService {
  constructor(private positionRepository: PositionRepository) {}

  async calcPortfolioDistribution(userId: number) {
    const portfolio = await this.positionRepository.findByUser(userId);

    const sumReduce = (acc: number, curr: number) => acc + curr;
    const portfolioScore = portfolio.map((x) => x.score).reduce(sumReduce);

    // TODO ::fetch stock prince in the moment (YAHOO or another provider)
    const portfolioAmount = portfolio
      .map((x) => x.amount * x.middlePrice)
      .reduce(sumReduce);

    const proportions = portfolio.map((position) => {
      const { ticker, amount, middlePrice, score } = position;
      const investedAmount = amount * middlePrice;

      const current = investedAmount / portfolioAmount;
      const suggestion = score / portfolioScore;

      return {
        ticker,
        current: current.toFixed(2),
        suggestion: suggestion.toFixed(2),
      };
    });

    return { portfolioScore, portfolioAmount, proportions };
  }
}
