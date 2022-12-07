import { Controller, Get } from '@nestjs/common';
import { UserPortfolioDto } from './dto/user-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly stockService: PortfolioService) {}

  @Get()
  async get(): Promise<UserPortfolioDto> {
    const userId = 1; // TODO :: get logged user with authModule
    const userStocks = await this.stockService.buildPortfolioForUser(userId);
    return new UserPortfolioDto(userStocks);
  }
}
