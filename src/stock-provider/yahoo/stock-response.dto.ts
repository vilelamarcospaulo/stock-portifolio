class StockInfo {
  regularMarketPrice?: number;
}

class QuoteResponse {
  result?: StockInfo[];
}

export class YahooStockResponseDto {
  quoteResponse?: QuoteResponse;
}
