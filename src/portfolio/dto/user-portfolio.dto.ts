import { Position } from '@prisma/client';

class UserStock {
  ticker: string;

  amount: number;

  middlePrice: number;

  total: number;
}

export class UserPortfolioDto {
  stocks: UserStock[];

  constructor(userStocks: Position[]) {
    this.stocks = userStocks.map(({ ticker, amount, middlePrice }) => ({
      ticker,
      amount,
      middlePrice,
      total: 190,
    }));
  }
}
