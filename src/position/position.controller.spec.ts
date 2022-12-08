import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { prismaServiceMocked } from '../prisma/prisma.service.mock';
import { AppModule } from '../app.module';

describe('PositionController', () => {
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

  it('should return all user positions', async () => {
    // ARRANGE
    const position1 = {
      id: 1,
      ticker: 'FOO3',
      amount: 10,
      middlePrice: 10,
      userId: 0,
      score: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const position2 = { ...position1, id: 11, ticker: 'TRAB3', amount: 5 };
    prismaServiceMocked.position.findMany.mockResolvedValue([
      position1,
      position2,
    ]);

    // ACT
    const result = await request(app.getHttpServer())
      .get('/position')
      .expect(200);

    // ASSERT
    expect(result.body).toEqual([
      {
        id: 1,
        amount: 10,
        middlePrice: 10,
        ticker: 'FOO3',
        score: 1,
      },
      {
        id: 11,
        amount: 5,
        middlePrice: 10,
        ticker: 'TRAB3',
        score: 1,
      },
    ]);
    expect(prismaServiceMocked.position.findMany).toBeCalledWith({
      where: { userId: 1 },
    });
  });
});
