import { Controller, Get } from '@nestjs/common';
import { User } from 'src/auth/auth.service';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { UserPortfolioDto } from './dto/user-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly stockService: PortfolioService) {}

  @Get()
  async get(@User() user: AuthUserDto): Promise<UserPortfolioDto> {
    const userStocks = await this.stockService.byUser(user.userId);
    return new UserPortfolioDto(userStocks);
  }
}
