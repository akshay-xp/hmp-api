import { Controller, Get } from '@nestjs/common';
import { ReviewTagsService } from './review-tags.service';

@Controller('review-tags')
export class ReviewTagsController {
  constructor(private reviewTagsService: ReviewTagsService) {}

  @Get()
  getReviewTags() {
    return this.reviewTagsService.getReviewTags();
  }
}
