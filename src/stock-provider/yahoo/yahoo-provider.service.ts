import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { YahooStockResponseDto } from './stock-response.dto';
import {
  StockPrice,
  StockPricesMap,
  StockProviderService,
} from '../../portfolio/ports/stock-provider.service';

@Injectable()
export class YahooStockProvider implements StockProviderService {
  constructor(private readonly httpService: HttpService) {}

  async getLastStockPrice(ticker: string): Promise<StockPrice> {
    const response = await this.fetchYahooStock(ticker);
    const yahooStock = response.quoteResponse.result[0];
    if (!yahooStock) {
      throw new NotFoundException();
    }

    return yahooStock.regularMarketPrice;
  }

  async getStockPrices(tickers: string[]): Promise<StockPricesMap> {
    const portfolioStocks = await Promise.all(
      tickers.map(async (ticker) => [
        ticker,
        await this.getLastStockPrice(ticker),
      ]),
    );

    return Object.fromEntries(portfolioStocks);
  }

  private async fetchYahooStock(
    ticker: string,
  ): Promise<YahooStockResponseDto> {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}.SA&fields=regularMarketPrice`;

    try {
      const response = await this.httpService.axiosRef.get(url);
      return response.data;
    } catch (err) {
      throw new InternalServerErrorException(
        'Error during HTTP request to Yahoo',
      );
    }
  }
}
