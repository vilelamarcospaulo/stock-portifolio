import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProcessOrderService } from './use-case/process-order';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private processOrderService: ProcessOrderService,
  ) {}

  async listUserOrders(userId: number, ticker?: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId, ticker },
    });

    return orders;
  }

  async processNewOrder(userId: number, createOrderParams: CreateOrderDto) {
    return this.processOrderService.processNewOrder(userId, createOrderParams);
  }
}
