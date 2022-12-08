import { Injectable } from '@nestjs/common';
import { PositionService } from 'src/position/position.service';

@Injectable()
export class PortfolioService {
  constructor(private positionService: PositionService) {}

  async byUser(userId: number) {
    return this.positionService.byUser(userId);
  }
}
