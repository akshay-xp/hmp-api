import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class AddReview {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];
}

export class AddReviewParams {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  customerId: number;
}
