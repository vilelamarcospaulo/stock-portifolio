import { Controller, Get } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { UserPortfolioDto } from './dto/user-portfolio.dto';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async listStocks(): Promise<UserPortfolioDto> {
    const userId = 1; // TODO :: get logged user with authModule
  }
}
