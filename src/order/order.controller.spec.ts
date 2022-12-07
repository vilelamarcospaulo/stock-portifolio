import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { prismaServiceMocked } from '../prisma/prisma.service.mock';
import { AppModule } from '../app.module';
import { CreateOrderDto, OrderType } from './dto/create-order.dto';

describe('PortfolioController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMocked)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  const createBuyOrderParams: CreateOrderDto = {
    type: OrderType.BUY,
    ticker: 'FOO3',
    amount: 2,
    price: 100,
    executionDate: new Date(2021, 9, 15),
  };

  it('should throw conflict when selling more than have', async () => {
    // ARRANGE
    prismaServiceMocked.position.findFirst.mockResolvedValue(null);

    // ACT
    const result = await request(app.getHttpServer())
      .post('/order')
      .send({
        ...createBuyOrderParams,
        type: OrderType.SELL,
      })
      .expect(409);

    // ASSERT
    expect(result.body).toEqual({
      error: 'Conflict',
      message: 'Current portfolio can`t process this ORDER',
      statusCode: 409,
    });

    expect(prismaServiceMocked.position.findFirst).toBeCalledWith({
      where: { userId: 1, ticker: 'FOO3' },
    });

    expect(prismaServiceMocked.order.create).toBeCalledTimes(0);
    expect(prismaServiceMocked.position.upsert).toBeCalledTimes(0);
  });

  it('should add new order and a position to user`s portfolio', async () => {
    // ARRANGE
    prismaServiceMocked.position.findFirst.mockResolvedValue(null);

    // ACT
    await request(app.getHttpServer())
      .post('/order')
      .send(createBuyOrderParams)
      .expect(204);

    // ASSERT
    expect(prismaServiceMocked.position.findFirst).toBeCalledWith({
      where: { userId: 1, ticker: 'FOO3' },
    });

    expect(prismaServiceMocked.order.create).toBeCalledWith({
      data: {
        amount: 2,
        executionDate: '2021-10-15T03:00:00.000Z',
        price: 100,
        ticker: 'FOO3',
        type: 'BUY',
        userId: 1,
      },
    });

    expect(prismaServiceMocked.position.upsert).toBeCalledWith({
      where: { id: 0 },
      create: {
        id: 0,
        ticker: 'FOO3',
        amount: 2,
        middlePrice: 100,
        userId: 1,
      },
      update: {
        id: 0,
        amount: 2,
        middlePrice: 100,
      },
    });
  });

  it('should add new order and update the existent position', async () => {
    // ARRANGE
    prismaServiceMocked.position.findFirst.mockResolvedValue({
      id: 1,
      ticker: 'FOO3',
      amount: 10,
      middlePrice: 50,
      userId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ACT
    await request(app.getHttpServer())
      .post('/order')
      .send(createBuyOrderParams)
      .expect(204);

    // ASSERT
    expect(prismaServiceMocked.position.findFirst).toBeCalledWith({
      where: { userId: 1, ticker: 'FOO3' },
    });

    expect(prismaServiceMocked.order.create).toBeCalledWith({
      data: {
        amount: 2,
        executionDate: '2021-10-15T03:00:00.000Z',
        price: 100,
        ticker: 'FOO3',
        type: 'BUY',
        userId: 1,
      },
    });

    expect(prismaServiceMocked.position.upsert).toBeCalledWith({
      where: { id: 1 },
      create: {
        id: 1,
        ticker: 'FOO3',
        amount: 12,
        middlePrice: 58.33,
        userId: 1,
      },
      update: {
        id: 1,
        amount: 12,
        middlePrice: 58.33,
      },
    });
  });
});
