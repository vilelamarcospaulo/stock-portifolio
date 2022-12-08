import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.service';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { PatchPositionDto } from './dto/patch-position.dto';
import { PositionDto } from './dto/position.dto';
import { PositionRepository } from './position.repo';
import { PositionService } from './position.service';

@ApiTags('Position')
@Controller('position')
export class PositionController {
  constructor(
    private readonly positionService: PositionService,
    private readonly positionRepository: PositionRepository,
  ) {}

  @Get()
  async get(@User() user: AuthUserDto): Promise<PositionDto[]> {
    const positions = await this.positionRepository.findByUser(user.userId);
    const data = positions.map(PositionDto.fromModel);

    return data;
  }

  @Patch(':id')
  @HttpCode(204)
  async patch(
    @User() user: AuthUserDto,
    @Param('id', ParseIntPipe) positionId: number,
    @Body() patchPosition: PatchPositionDto,
  ) {
    await this.positionService.patchPosition(
      user.userId,
      positionId,
      patchPosition,
    );
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
