import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetUser } from 'src/decorators';
import { AddReview, AddReviewParams } from './dto/add-review.dto.js';
import { GetReviews, GetReviewsQuery } from './dto/get-reviews.dto.js';
import { PatchReview, PatchReviewParams } from './dto/patch-review.dto.js';
import { DeleteReview } from './dto/delete-review.dto.js';
import { GetReview } from './dto/get-review.dto.js';
import { GetReviewsCount } from './dto/get-reviews-count.dto.js';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post(':customerId')
  addReview(
    @GetUser('userId') userId: number,
    @Param() params: AddReviewParams,
    @Body() dto: AddReview,
  ) {
    return this.reviewService.addReview(userId, params, dto);
  }

  @Get(':customerId')
  getCustomerReview(
    @GetUser('userId') userId: number,
    @Param() params: GetReview,
  ) {
    return this.reviewService.getCustomerReview(userId, params);
  }

  @Get(':customerId/all')
  getCustomerReviews(
    @Param() params: GetReviews,
    @Query() query: GetReviewsQuery,
  ) {
    return this.reviewService.getCustomerReviews(params, query);
  }

  @Get(':customerId/count')
  getCustomerReviewsCount(@Param() params: GetReviewsCount) {
    return this.reviewService.getCustomerReviewsCount(params);
  }

  @Patch(':customerId')
  pathReview(
    @GetUser('userId') userId: number,
    @Param() params: PatchReviewParams,
    @Body() dto: PatchReview,
  ) {
    return this.reviewService.patchReview(userId, params, dto);
  }

  @Delete()
  deleteReview(@Body() dto: DeleteReview) {
    return this.reviewService.deleteReview(dto);
  }
}
