export type StockPrice = number;
export type StockPricesMap = { [key: string]: StockPrice };

export interface StockProviderService {
  getStockPrices(tickers: string[]): Promise<StockPricesMap>;
  getLastStockPrice(ticker: string): Promise<StockPrice>;
}

export const StockProviderService = Symbol('StockProviderService');
