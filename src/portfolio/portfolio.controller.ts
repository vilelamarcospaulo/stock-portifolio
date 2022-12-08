import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.service';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { UserPortfolioDto } from './dto/user-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly stockService: PortfolioService) {}

  @Get()
  async get(@User() user: AuthUserDto): Promise<UserPortfolioDto> {
    const userStocks = await this.stockService.findByUser(user.userId);

    // TODO :: return all analyses results, from user wallet
    return new UserPortfolioDto(userStocks);
  }
}
