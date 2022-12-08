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

  describe('list position', () => {
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

  describe('delete position', () => {
    const position = {
      id: 1,
      ticker: 'FOO3',
      amount: 10,
      middlePrice: 10,
      userId: 1,
      score: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should throw 404 when not found', async () => {
      // ARRANGE
      prismaServiceMocked.position.findUnique.mockResolvedValue(null);

      // ACT
      const result = await request(app.getHttpServer())
        .delete('/position/121')
        .expect(404);

      // ASSERT
      expect(result.body).toEqual({
        message: 'Not Found',
        statusCode: 404,
      });
      expect(prismaServiceMocked.position.findUnique).toBeCalledWith({
        where: { id: 121 },
      });
      expect(prismaServiceMocked.position.delete).toHaveBeenCalledTimes(0);
    });

    it('should throw 403 when not position belongs to another user', async () => {
      // ARRANGE
      prismaServiceMocked.position.findUnique.mockResolvedValue({
        ...position,
        userId: 2,
      });

      // ACT
      const result = await request(app.getHttpServer())
        .delete('/position/121')
        .expect(403);

      // ASSERT
      expect(result.body).toEqual({
        error: 'Forbidden',
        message: 'Only able to manage your own position',
        statusCode: 403,
      });
      expect(prismaServiceMocked.position.findUnique).toBeCalledWith({
        where: { id: 121 },
      });
      expect(prismaServiceMocked.position.delete).toHaveBeenCalledTimes(0);
    });

    it('should throw 409 when not position not zeroed', async () => {
      // ARRANGE
      prismaServiceMocked.position.findUnique.mockResolvedValue(position);

      // ACT
      const result = await request(app.getHttpServer())
        .delete('/position/121')
        .expect(409);

      // ASSERT
      expect(result.body).toEqual({
        error: 'Conflict',
        message: 'Only able to DELETE zeroed positions',
        statusCode: 409,
      });
      expect(prismaServiceMocked.position.findUnique).toBeCalledWith({
        where: { id: 121 },
      });
      expect(prismaServiceMocked.position.delete).toHaveBeenCalledTimes(0);
    });

    it('should delete the position', async () => {
      // ARRANGE
      prismaServiceMocked.position.findUnique.mockResolvedValue({
        ...position,
        amount: 0,
      });

      // ACT
      await request(app.getHttpServer()).delete('/position/121').expect(204);

      // ASSERT
      expect(prismaServiceMocked.position.findUnique).toBeCalledWith({
        where: { id: 121 },
      });
      expect(prismaServiceMocked.position.delete).toHaveBeenCalledWith({
        where: { id: 121 },
      });
    });
  });
});
