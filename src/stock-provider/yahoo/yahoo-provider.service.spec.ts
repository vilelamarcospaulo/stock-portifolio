import * as nock from 'nock';
import { Test, TestingModule } from '@nestjs/testing';
import { YahooStockProvider } from './yahoo-provider.service';
import { StockProviderModule } from '../stock-provider.module';
import { StockProviderService } from '../../portfolio/ports/stock-provider.service';

describe('YahooProvider', () => {
  let service: StockProviderService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StockProviderModule],
    }).compile();

    const app = module.createNestApplication();
    service = app.get<StockProviderService>(YahooStockProvider);
  });

  describe('getLastStockPrice', () => {
    it('should call yahoo v7 api with ticker name and return regularMarketPrice', async () => {
      // ARRANGE
      nockYahoo('B3SA3.SA', 200, 10.52);

      // ACT
      const result = await service.getLastStockPrice('B3SA3');

      // ASSERT
      expect(result).toEqual(10.52);
    });

    it('should throw not found when api response without info data', async () => {
      // ARRANGE
      nockYahoo('FOO3.SA', 200);

      // ACT
      let result: any;
      try {
        await service.getLastStockPrice('FOO3');
      } catch (err) {
        result = err;
      }

      // ASSERT
      expect(result.message).toEqual('Not Found');
    });

    it('should throw Server Error when api response non success code', async () => {
      // ARRANGE
      nockYahoo('FOO3.SA', 400);

      // ACT
      let result;
      try {
        await service.getLastStockPrice('FOO3');
      } catch (err) {
        result = err;
      }

      // ASSERT
      expect(result.message).toEqual('Error during HTTP request to Yahoo');
    });
  });

  describe('getStockPrices', () => {
    it('should call yahoo v7 api to each ticker and build price map', async () => {
      // ARRANGE
      nockYahoo('B3SA3.SA', 200, 10.52);
      nockYahoo('TRAB3.SA', 200, 13.51);

      // ACT
      const result = await service.getStockPrices(['B3SA3', 'TRAB3']);

      // ASSERT
      expect(result).toEqual({
        B3SA3: 10.52,
        TRAB3: 13.51,
      });
    });

    it('should throw Server Error when api response non success code', async () => {
      // ARRANGE
      nockYahoo('FOO3.SA', 400);

      // ACT
      let result;
      try {
        await service.getStockPrices(['FOO3']);
      } catch (err) {
        result = err;
      }

      // ASSERT
      expect(result.message).toEqual('Error during HTTP request to Yahoo');
    });
  });
});

export function nockYahoo(
  symbols: string,
  responseStatus: number,
  price?: number,
) {
  const responseBody =
    price !== undefined
      ? { quoteResponse: { result: [{ regularMarketPrice: price }] } }
      : undefined;

  return nock('https://query1.finance.yahoo.com')
    .get('/v7/finance/quote')
    .query({ symbols, fields: 'regularMarketPrice' })
    .reply(responseStatus, responseBody);
}
