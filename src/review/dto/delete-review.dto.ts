import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteReview {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  customerId: number;
}
