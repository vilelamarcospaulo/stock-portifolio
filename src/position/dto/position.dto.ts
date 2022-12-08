import { Position } from '@prisma/client';

export class PositionDto {
  id: number;
  ticker: string;
  amount: number;
  middlePrice: number;
  score: number;

  static fromModel(position: Position): PositionDto {
    const { id, ticker, amount, middlePrice, score } = position;
    return { id, ticker, amount, middlePrice, score };
  }
}
