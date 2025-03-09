import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddReview, GetReview, GetReviews, PatchReview } from './dto';
import { DeleteReview } from './dto/delete-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async addReview(userId: number, dto: AddReview) {
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        businessId: userId,
        customerId: dto.customerId,
      },
    });
  }

  async getCustomerReview(userId: number, query: GetReview) {
    const review = await this.prisma.review.findUnique({
      where: {
        businessId_customerId: {
          businessId: userId,
          customerId: query.customerId,
        },
      },
    });

    return review;
  }

  async getCustomerReviews(query: GetReviews) {
    const data = await this.prisma.customer.findUnique({
      where: {
        id: query.customerId,
      },
      select: {
        reviews: true,
      },
    });

    if (data) {
      return {
        reviews: data.reviews,
      };
    }
  }

  patchReview(userId: number, dto: PatchReview) {
    // update only those that are defined
    return this.prisma.review.update({
      where: {
        businessId_customerId: {
          businessId: userId,
          customerId: dto.customerId,
        },
      },
      data: {
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async deleteReview(userId: number, dto: DeleteReview) {
    await this.prisma.review.delete({
      where: {
        businessId_customerId: {
          businessId: userId,
          customerId: dto.customerId,
        },
      },
    });
  }
}
