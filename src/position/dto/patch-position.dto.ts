import { Max, Min } from '@nestjs/class-validator';

export class PatchPositionDto {
  @Min(0)
  @Max(15)
  score: number;
}
