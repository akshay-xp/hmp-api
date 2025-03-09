import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetReview {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  customerId: number;
}
