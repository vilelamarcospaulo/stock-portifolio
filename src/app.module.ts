import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [PrismaModule, StockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
