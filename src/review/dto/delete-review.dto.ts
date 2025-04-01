import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteReviewParams {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  reviewId: number;
}
