import { Module } from '@nestjs/common';
import { ReviewReportsController } from './review-reports.controller';
import { ReviewReportsService } from './review-reports.service';

@Module({
  controllers: [ReviewReportsController],
  providers: [ReviewReportsService]
})
export class ReviewReportsModule {}
