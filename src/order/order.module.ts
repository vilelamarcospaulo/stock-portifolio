import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [PrismaService, OrderService],
})
export class OrderModule {}
