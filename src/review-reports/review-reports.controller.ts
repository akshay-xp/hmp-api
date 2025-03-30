import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReviewReportsService } from './review-reports.service';
import { GetUser } from 'src/decorators';
import { CreateReviewReport } from './dto/create-review-report.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { DeleteReviewReport } from './dto/delete-review-report.dto';

@Controller('review-reports')
export class ReviewReportsController {
  constructor(private reviewReportsService: ReviewReportsService) {}

  @Post()
  createReport(
    @GetUser('userId') reporterId: number,
    @Body() dto: CreateReviewReport,
  ) {
    return this.reviewReportsService.createReport(reporterId, dto);
  }

  @Get()
  @Roles('ADMIN')
  getReports() {
    return this.reviewReportsService.getReports();
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteReport(@Param() param: DeleteReviewReport) {
    return this.reviewReportsService.deleteReport(param);
  }
}
