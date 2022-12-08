import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { prismaServiceMocked } from '../prisma/prisma.service.mock';
import { AppModule } from '../app.module';

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

  it('should return user portfolio based on his stocks', async () => {
    // ARRANGE
    const stock1 = {
      id: 1,
      ticker: 'FOO3',
      amount: 10,
      middlePrice: 10,
      userId: 0,
      score: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const stock2 = { ...stock1, ticker: 'TRAB3', amount: 5 };
    prismaServiceMocked.position.findMany.mockResolvedValue([stock1, stock2]);

    // ACT
    const result = await request(app.getHttpServer())
      .get('/portfolio')
      .expect(200);

    // ASSERT
    expect(result.body).toEqual({
      stocks: [
        {
          amount: 10,
          middlePrice: 10,
          ticker: 'FOO3',
          total: 190,
        },
        {
          amount: 5,
          middlePrice: 10,
          ticker: 'TRAB3',
          total: 190,
        },
      ],
    });
    expect(prismaServiceMocked.position.findMany).toBeCalledWith({
      where: { userId: 1 },
    });
  });
});
