import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatchPositionDto } from './dto/patch-position.dto';

import { PositionRepository } from './position.repo';

@Injectable()
export class PositionService {
  constructor(
    private prisma: PrismaService,
    private positionRepository: PositionRepository,
  ) {}

  async patchPosition(
    userId: number,
    positionId: number,
    patchPosition: PatchPositionDto,
  ) {
    await this.positionRepository.findOneByIdAndUser(positionId, userId);
    await this.prisma.position.update({
      where: { id: positionId },
      data: { score: patchPosition.score },
    });
  }

  async deletePosition(userId: number, positionId: number) {
    const position = await this.positionRepository.findOneByIdAndUser(
      positionId,
      userId,
    );

    if (position.amount !== 0)
      throw new ConflictException(`Only able to DELETE zeroed positions`);

    await this.positionRepository.deleteById(positionId);
  }
}
