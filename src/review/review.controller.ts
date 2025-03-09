import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetUser } from 'src/decorators';
import {
  AddReview,
  DeleteReview,
  GetReview,
  GetReviews,
  PatchReview,
} from './dto';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  addReview(@GetUser('userId') userId: number, @Body() dto: AddReview) {
    return this.reviewService.addReview(userId, dto);
  }

  // get should be with email or phone
  @Get()
  getCustomerReview(
    @GetUser('userId') userId: number,
    @Query() query: GetReview,
  ) {
    return this.reviewService.getCustomerReview(userId, query);
  }

  // add pagination
  @Get('/all')
  getCustomerReviews(@Query() query: GetReviews) {
    return this.reviewService.getCustomerReviews(query);
  }

  @Patch()
  pathReview(@GetUser('userId') userId: number, @Body() dto: PatchReview) {
    return this.reviewService.patchReview(userId, dto);
  }

  @Delete()
  deleteReview(@GetUser('userId') userId: number, @Body() dto: DeleteReview) {
    return this.reviewService.deleteReview(userId, dto);
  }
}
