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

  async processNewOrder(userId: number, orderParams: CreateOrderDto) {
    const currentPosition = await this.userPositionForStock(
      userId,
      orderParams.ticker,
    );

    const nextPosition = await this.calculatePositionAfterOrder(
      currentPosition,
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
        data: {
          userId,
          ...orderParams,
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
    const { newAmount, newMiddlePrice } =
      createOrderParams.type === OrderType.BUY
        ? this.calculatePositionForBuying(current, createOrderParams)
        : this.calculatePositionForSelling(current, createOrderParams);

    if (newAmount < 0) {
      throw new ConflictException('Current portfolio can`t process this ORDER');
    }

    return {
      id: current.id,
      amount: parseFloat(newAmount.toFixed(2)),
      middlePrice: parseFloat(newMiddlePrice.toFixed(2)),
    };
  }

  private calculatePositionForSelling(
    current: IPositionValues,
    newOrderParams: CreateOrderDto,
  ) {
    const newAmount = current.amount - newOrderParams.amount;
    const newMiddlePrice = current.middlePrice; // WHEN SELLING STOCKS, YOUR PM DON'T CHANGE

    return { newAmount, newMiddlePrice };
  }

  private calculatePositionForBuying(
    current: IPositionValues,
    newOrderParams: CreateOrderDto,
  ) {
    const totalInvested = current.amount * current.middlePrice;
    const orderTotalValue = newOrderParams.amount * newOrderParams.price;
    const totalInvestedAfter = totalInvested + orderTotalValue;

    const newAmount = current.amount + newOrderParams.amount;
    const newMiddlePrice = totalInvestedAfter / newAmount;

    return { newAmount, newMiddlePrice };
  }
}
