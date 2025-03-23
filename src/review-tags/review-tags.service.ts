import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewTagsService {
  constructor(private prisma: PrismaService) {}

  getReviewTags() {
    return this.prisma.reviewTag.findMany();
  }
}
