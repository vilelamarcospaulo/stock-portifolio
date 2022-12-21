import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { YahooStockProvider } from './yahoo/yahoo-provider.service';

@Module({
  imports: [HttpModule],
  providers: [YahooStockProvider],
  exports: [YahooStockProvider],
})
export class StockProviderModule {}
