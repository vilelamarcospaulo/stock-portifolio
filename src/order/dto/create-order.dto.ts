export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}
export class CreateOrderDto {
  type: OrderType;
  ticker: string;
  amount: number;
  price: number;
  executionDate?: Date;
}
