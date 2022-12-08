import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { PositionModule } from './position/position.module';

@Module({
  imports: [AuthModule, PrismaModule, PortfolioModule, OrderModule, PositionModule],
})
export class AppModule {}
