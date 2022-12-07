export class CreateOrderDto {
  ticker: string;
  amount: number;
  price: number;
  executionDate?: Date;
}
