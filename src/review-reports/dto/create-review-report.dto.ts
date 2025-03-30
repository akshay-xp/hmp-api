import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewReport {
  @IsOptional()
  @IsString()
  reason?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  customerId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  businessId: number;
}
