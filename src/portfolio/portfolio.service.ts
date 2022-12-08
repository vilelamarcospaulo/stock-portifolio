import { Injectable } from '@nestjs/common';
import { PositionRepository } from 'src/position/position.repo';

@Injectable()
export class PortfolioService {
  constructor(private positionRepository: PositionRepository) {}

  async findByUser(userId: number) {
    return this.positionRepository.findByUser(userId);
  }
}
