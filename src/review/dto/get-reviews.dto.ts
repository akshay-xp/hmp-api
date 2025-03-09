import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetReviews {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  customerId: number;
}
