import { Module } from '@nestjs/common';
import { ReviewTagsController } from './review-tags.controller';
import { ReviewTagsService } from './review-tags.service';

@Module({
  controllers: [ReviewTagsController],
  providers: [ReviewTagsService]
})
export class ReviewTagsModule {}
