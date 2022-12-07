import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

interface IPositionValues {
  id?: number;
  amount: number;
  middlePrice: number;
}

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async processNewOrder(userId: number, createOrderParams: CreateOrderDto) {
    const currentPosition = await this.userPositionForStock(
      userId,
      createOrderParams.ticker,
    );

    const nextPosition = await this.calculatePositionAfterOrder(
      currentPosition,
      createOrderParams,
    );

    await this.prisma.$transaction([
      this.prisma.position.upsert({
        where: {
          id: nextPosition.id,
        },
        create: {
          userId,
          ticker: createOrderParams.ticker,
          ...nextPosition,
        },
        update: nextPosition,
      }),

      this.prisma.order.create({
        data: {
          userId,
          ...createOrderParams,
        },
      }),
    ]);
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

  private calculatePositionAfterOrder(
    current: IPositionValues,
    createOrderParams: CreateOrderDto,
  ): IPositionValues {
    const totalInvested = current.amount * current.middlePrice;
    const orderTotalValue = createOrderParams.amount * createOrderParams.price;

    const totalInvestedAfter = totalInvested + orderTotalValue;
    const newAmount = current.amount + createOrderParams.amount;
    const newMiddlePrice = totalInvestedAfter / newAmount;

    return {
      id: current.id,
      amount: parseFloat(newAmount.toFixed(2)),
      middlePrice: parseFloat(newMiddlePrice.toFixed(2)),
    };
  }
}
