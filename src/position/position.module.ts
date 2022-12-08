import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PositionController } from './position.controller';
import { PositionRepository } from './position.repo';
import { PositionService } from './position.service';

@Module({
  imports: [PrismaService],
  providers: [PrismaService, PositionRepository, PositionService],
  controllers: [PositionController],
})
export class PositionModule {}
