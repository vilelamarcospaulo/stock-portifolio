class UserStock {
  ticker: string;

  amount: number;

  middlePrice: number;

  total: number;
}

export class UserPortfolioDto {
  stocks: UserStock[];
}
