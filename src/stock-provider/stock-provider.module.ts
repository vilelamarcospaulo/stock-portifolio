import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { YahooStockProvider } from './yahoo/yahoo-provider.service';
import { StockProviderService } from '../portfolio/ports/stock-provider.service';

const YahooAsStockProvider: Provider = {
  provide: StockProviderService,
  useClass: YahooStockProvider,
};

@Module({
  imports: [HttpModule],
  providers: [YahooStockProvider, YahooAsStockProvider],
  exports: [YahooAsStockProvider],
})
export class StockProviderModule {}
