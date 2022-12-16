import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { YahooStockResponseDto } from './stock-response.dto';
import { StockProviderService } from '../stock-provider.service';

@Injectable()
export class YahooStockProvider implements StockProviderService {
  constructor(private readonly httpService: HttpService) {}

  async getLastStockPrice(ticker: string): Promise<number> {
    const response = await this.fetchYahooStock(ticker);
    if (response.status !== HttpStatusCode.Ok) {
      throw new InternalServerErrorException();
    }

    const yahooStock = response.data.quoteResponse[0];
    if (!yahooStock) {
      throw new InternalServerErrorException();
    }

    return yahooStock.regularMarketPrice;
  }

  fetchYahooStock(
    ticker: string,
  ): Promise<AxiosResponse<YahooStockResponseDto>> {
    const url = `'https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}&fields=regularMarketPrice'`;
    return this.httpService.axiosRef.get(url);
  }
}
