import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PositionService {
  constructor(private prisma: PrismaService) {}

  async deletePosition(userId: number, positionId: number) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
    });

    if (!position) throw new NotFoundException();
    if (position.userId !== userId)
      throw new ForbiddenException(`Only able to DELETE your own position`);
    if (position.amount !== 0)
      throw new ConflictException(`Only able to DELETE zeroed positions`);

    await this.prisma.position.delete({ where: { id: positionId } });
  }

  async byUser(userId: number) {
    return this.prisma.position.findMany({
      where: { userId },
    });
  }
}
