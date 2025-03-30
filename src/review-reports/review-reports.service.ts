import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewReport } from './dto/create-review-report.dto';
import { DeleteReviewReport } from './dto/delete-review-report.dto';

@Injectable()
export class ReviewReportsService {
  constructor(private prisma: PrismaService) {}

  async createReport(reporterId: number, dto: CreateReviewReport) {
    const report = await this.prisma.reviewReport.create({
      data: {
        reporterId: reporterId,
        businessId: dto.businessId,
        customerId: dto.customerId,
        reason: dto.reason,
      },
    });

    return report;
  }

  async getReports() {
    const reports = await this.prisma.reviewReport.findMany({
      include: {
        review: {
          include: {
            business: {
              omit: {
                password: true,
                refreshToken: true,
              },
            },
          },
        },
      },
    });
    return reports;
  }

  async deleteReport(param: DeleteReviewReport) {
    await this.prisma.reviewReport.delete({
      where: {
        id: param.id,
      },
    });
  }
}
