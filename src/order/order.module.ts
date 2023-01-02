import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProcessOrderService } from './use-case/process-order';

@Module({
  controllers: [OrderController],
  providers: [PrismaService, ProcessOrderService, OrderService],
})
export class OrderModule {}
