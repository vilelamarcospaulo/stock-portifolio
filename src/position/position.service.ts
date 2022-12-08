import { ConflictException, Injectable } from '@nestjs/common';

import { PositionRepository } from './position.repo';

@Injectable()
export class PositionService {
  constructor(private positionRepository: PositionRepository) {}

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
