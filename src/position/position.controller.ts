import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.service';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { PositionDto } from './dto/position.dto';
import { PositionService } from './position.service';

@ApiTags('Position')
@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get()
  async get(@User() user: AuthUserDto): Promise<PositionDto[]> {
    const positions = await this.positionService.byUser(user.userId);
    const data = positions.map(PositionDto.fromModel);

    return data;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @User() user: AuthUserDto,
    @Param('id', ParseIntPipe) positionId: number,
  ) {
    await this.positionService.deletePosition(user.userId, positionId);
  }
}
