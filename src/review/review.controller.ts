import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetUser } from 'src/decorators';
import { AddReview } from './dto/add-review.dto.js';
import { GetReviews, GetReviewsQuery } from './dto/get-reviews.dto.js';
import { PatchReview, PatchReviewParams } from './dto/patch-review.dto.js';
import { DeleteReviewParams } from './dto/delete-review.dto.js';
import { GetReview } from './dto/get-review.dto.js';
import { GetReviewsCount } from './dto/get-reviews-count.dto.js';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  addReview(@GetUser('userId') userId: number, @Body() dto: AddReview) {
    return this.reviewService.addReview(userId, dto);
  }

  @Get('business/customer/:customerId')
  getCustomerReview(
    @GetUser('userId') userId: number,
    @Param() params: GetReview,
  ) {
    return this.reviewService.getCustomerReview(userId, params);
  }

  @Get('customer/:customerId')
  getCustomerReviews(
    @Param() params: GetReviews,
    @Query() query: GetReviewsQuery,
  ) {
    return this.reviewService.getCustomerReviews(params, query);
  }

  @Get('customer/:customerId/counts')
  getCustomerReviewsCount(@Param() params: GetReviewsCount) {
    return this.reviewService.getCustomerReviewsCount(params);
  }

  @Patch('review/:reviewId')
  pathReview(
    @GetUser('userId') userId: number,
    @Param() params: PatchReviewParams,
    @Body() dto: PatchReview,
  ) {
    return this.reviewService.patchReview(userId, params, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('review/:reviewId')
  deleteReview(
    @GetUser('userId') userId: number,
    @GetUser('role') role: Role,
    @Param() params: DeleteReviewParams,
  ) {
    return this.reviewService.deleteReview(userId, role, params);
  }
}
