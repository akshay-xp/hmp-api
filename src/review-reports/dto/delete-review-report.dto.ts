import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteReviewReport {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id: number;
}
