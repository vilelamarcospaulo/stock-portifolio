import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { YahooStockResponseDto } from './stock-response.dto';
import { StockProviderService } from '../stock-provider.service';

@Injectable()
export class YahooStockProvider implements StockProviderService {
  constructor(private readonly httpService: HttpService) {}

  async getLastStockPrice(ticker: string): Promise<number> {
    const response = await this.fetchYahooStock(ticker);
    const yahooStock = response.quoteResponse.result[0];
    if (!yahooStock) {
      throw new NotFoundException();
    }

    return yahooStock.regularMarketPrice;
  }

  async fetchYahooStock(ticker: string): Promise<YahooStockResponseDto> {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}&fields=regularMarketPrice`;

    const response = await this.httpService.axiosRef.get(url);
    if (response.status !== 200) {
      throw new InternalServerErrorException(
        'Error during HTTP request to Yahoo',
      );
    }

    return response.data;
  }
}
