import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.service';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { UserPortfolioDto } from './dto/user-portfolio.dto';
import { PortfolioDistributionService } from './portfolio-distribution.service';
import { PortfolioService } from './portfolio.service';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly portfolioDistributionService: PortfolioDistributionService,
  ) {}

  @Get()
  async get(@User() user: AuthUserDto): Promise<UserPortfolioDto> {
    const userStocks = await this.portfolioService.findByUser(user.userId);

    // TODO :: return all analyses results, from user wallet
    return new UserPortfolioDto(userStocks);
  }

  @Get('distribution')
  async distribution(@User() user: AuthUserDto) {
    const { proportions } =
      await this.portfolioDistributionService.calcPortfolioDistribution(
        user.userId,
      );

    return proportions;
  }

  // @Get('aport-suggestion')
  // async getAportSuggestion(
  //   @User() user: AuthUserDto,
  //   @Query('amount') amount: number,
  // ): Promise<{ [key: string]: number }> {}
}
