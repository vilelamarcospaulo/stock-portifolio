import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.service';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { UserPortfolioDto } from './dto/user-portfolio.dto';
import { PortfolioDistribution } from './use-case/portfolio-distribution.service';
import { PortfolioService } from './portfolio.service';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly portfolioDistribution: PortfolioDistribution,
  ) {}

  @Get()
  async get(@User() user: AuthUserDto): Promise<UserPortfolioDto> {
    const userStocks = await this.portfolioService.findByUser(user.userId);

    // TODO :: return all analyses results, from user wallet
    return new UserPortfolioDto(userStocks);
  }

  @Get('distribution')
  async distribution(@User() user: AuthUserDto) {
    return this.portfolioDistribution.calcPortfolioDistribution(user.userId);
  }

  // @Get('aport-suggestion')
  // async getAportSuggestion(
  //   @User() user: AuthUserDto,
  //   @Query('amount') amount: number,
  // ): Promise<{ [key: string]: number }> {}
}
