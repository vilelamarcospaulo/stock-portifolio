import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { PositionModule } from './position/position.module';
import { StockProviderModule } from './stock-provider/stock-provider.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    StockProviderModule,
    PortfolioModule,
    OrderModule,
    PositionModule,
  ],
})
export class AppModule {}
