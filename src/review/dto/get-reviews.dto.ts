import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetReviews {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  customerId: number;
}

export class GetReviewsQuery {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  cursor?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Max(5)
  @Min(1)
  rating?: number;

  @IsOptional()
  @IsEnum(['updatedAt', 'createdAt'])
  sortBy?: 'updatedAt' | 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
