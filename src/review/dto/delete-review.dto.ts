import { IsNumber } from 'class-validator';

export class DeleteReview {
  @IsNumber()
  customerId: number;
}
