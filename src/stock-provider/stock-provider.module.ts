import { Module } from '@nestjs/common';
import { StockProviderService } from './stock-provider.service';

@Module({
  providers: [StockProviderService]
})
export class StockProviderModule {}
