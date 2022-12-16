import { Injectable } from '@nestjs/common';
import { StockProviderService } from './stock-provider.service';

@Injectable()
export class YahooStockProvider implements StockProviderService {
  getLastStockPrice(ticker: string): number {
    throw new Error('Method not implemented.');
  }
}
