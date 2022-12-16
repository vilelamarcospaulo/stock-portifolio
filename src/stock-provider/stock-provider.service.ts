export interface StockProviderService {
  getLastStockPrice(ticker: string): Promise<number>;
}
