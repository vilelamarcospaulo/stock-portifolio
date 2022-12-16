export interface StockProviderService {
  getLastStockPrice(ticker: string): number;
}
