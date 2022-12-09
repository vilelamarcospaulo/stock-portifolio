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

  const baseRecord = {
    userId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const stock1 = {
    id: 1,
    ticker: 'FOO3',
    amount: 7,
    middlePrice: 10,
    score: 8,
    ...baseRecord,
  };
  const stock2 = {
    id: 2,
    ticker: 'TRAB3',
    amount: 5,
    middlePrice: 3,
    score: 4,
    ...baseRecord,
  };

  describe('get portfolio', () => {
    it('should return user portfolio based on his stocks', async () => {
      // ARRANGE
      prismaServiceMocked.position.findMany.mockResolvedValue([stock1, stock2]);

      // ACT
      const result = await request(app.getHttpServer())
        .get('/portfolio')
        .expect(200);

      // ASSERT
      expect(result.body).toEqual({
        stocks: [
          {
            amount: 7,
            middlePrice: 10,
            ticker: 'FOO3',
            total: 190,
          },
          {
            amount: 5,
            middlePrice: 3,
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

  describe('get portfolio distribution', () => {
    it('should return user portfolio distribution goal and current distribution', async () => {
      // ARRANGE
      prismaServiceMocked.position.findMany.mockResolvedValue([stock1, stock2]);

      // ACT
      const result = await request(app.getHttpServer())
        .get('/portfolio/distribution')
        .expect(200);

      // ASSERT
      expect(result.body).toEqual([
        { suggestion: '0.67', current: '0.82', ticker: 'FOO3' },
        { suggestion: '0.33', current: '0.18', ticker: 'TRAB3' },
      ]);
      expect(prismaServiceMocked.position.findMany).toBeCalledWith({
        where: { userId: 1 },
      });
    });
  });
});
