import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.service';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(204)
  async registerNewOrder(
    @User() user: AuthUserDto,
    @Body() createOrderParams: CreateOrderDto,
  ): Promise<void> {
    return this.orderService.newOrder(user.userId, createOrderParams);
  }

  @Get()
  @HttpCode(200)
  async listUserOrders(
    @User() user: AuthUserDto,
    @Query('ticker') ticker: string | undefined,
  ) {
    return this.orderService.listUserOrders(user.userId, ticker);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @User() user: AuthUserDto,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    await this.orderService.delete(user.userId, orderId);
  }
}
