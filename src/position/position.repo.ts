import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PositionRepository {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: number) {
    return this.prisma.position.findMany({
      where: { userId },
    });
  }

  async findOneByIdAndUser(positionId: number, userId?: number) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
    });

    if (!position) throw new NotFoundException();
    if (userId && position.userId !== userId)
      throw new ForbiddenException(`Only able to manage your own position`);

    return position;
  }

  async deleteById(positionId: number) {
    return this.prisma.position.delete({ where: { id: positionId } });
  }
}
