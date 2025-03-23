import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetReviewsCount {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  customerId: number;
}
