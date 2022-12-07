import { Body, Controller, HttpCode, Post } from '@nestjs/common';
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
    return this.orderService.registerOrder(user.userId, createOrderParams);
  }
}
