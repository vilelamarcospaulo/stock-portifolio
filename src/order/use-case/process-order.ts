import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto, OrderType } from '../dto/create-order.dto';

interface IPositionValues {
  id?: number;
  amount: number;
  middlePrice: number;
}

@Injectable()
export class ProcessOrderService {
  constructor(private prisma: PrismaService) {}

  async registerNewOrder(userId: number, orderParams: CreateOrderDto) {
    const { nextPosition, order } = await this.processNewOrder(
      userId,
      orderParams,
    );

    await this.prisma.$transaction([
      this.prisma.position.upsert({
        where: {
          id: nextPosition.id,
        },
        create: {
          userId,
          ticker: orderParams.ticker,
          score: 0,
          ...nextPosition,
        },
        update: nextPosition,
      }),

      this.prisma.order.create({
        data: order,
      }),
    ]);
  }

  async deleteOrder(userId: number, orderId: number) {
    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id: orderId },
    });

    const reversedOrder = {
      ...order,
      type: order.type === OrderType.BUY ? OrderType.BUY : OrderType.SELL,
      amount: -order.amount,
      executionDate: order.executionDate || undefined,
    };

    const { nextPosition } = await this.processNewOrder(userId, reversedOrder);

    await this.prisma.$transaction([
      this.prisma.position.update({
        where: {
          id: nextPosition.id,
        },
        data: {
          amount: nextPosition.amount,
          middlePrice: nextPosition.middlePrice,
        },
      }),

      this.prisma.order.delete({ where: { id: orderId } }),
    ]);
  }

  private async processNewOrder(userId: number, orderParams: CreateOrderDto) {
    const currentPosition = await this.userPositionForStock(
      userId,
      orderParams.ticker,
    );

    const nextPosition = this.positionAfterOrder(currentPosition, orderParams);

    return {
      currentPosition,
      nextPosition,
      order: { ...orderParams, userId },
    };
  }

  private async userPositionForStock(
    userId: number,
    ticker: string,
  ): Promise<IPositionValues> {
    const position = await this.prisma.position.findFirst({
      where: { userId, ticker },
    });

    return position ?? { id: 0, amount: 0, middlePrice: 0 };
  }

  private positionAfterOrder(
    current: IPositionValues,
    createOrderParams: CreateOrderDto,
  ): IPositionValues {
    const { newAmount, newMiddlePrice } = this.calculateNewPosition(
      current,
      createOrderParams,
    );

    if (newAmount < 0) {
      throw new ConflictException('Current portfolio can`t process this ORDER');
    }

    return {
      id: current.id,
      amount: parseFloat(newAmount.toFixed(2)),
      middlePrice: parseFloat(newMiddlePrice.toFixed(2)),
    };
  }

  private calculateNewPosition(
    current: IPositionValues,
    newOrderParams: CreateOrderDto,
  ) {
    if (newOrderParams.type === OrderType.SELL) {
      const newAmount = current.amount - newOrderParams.amount;
      return {
        newAmount,
        newMiddlePrice: current.middlePrice, // WHEN SELLING STOCKS, YOUR PM DON'T CHANGE
      };
    }

    // $$
    const totalInvested = current.amount * current.middlePrice;
    const orderTotalValue = newOrderParams.amount * newOrderParams.price;
    const totalInvestedAfter = totalInvested + orderTotalValue;

    // qtde
    const newAmount = current.amount + newOrderParams.amount;

    // pm
    const newMiddlePrice = totalInvestedAfter / newAmount;

    return { newAmount, newMiddlePrice };
  }
}
