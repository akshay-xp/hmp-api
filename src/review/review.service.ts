import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteReview } from './dto/delete-review.dto';
import { AddReview, AddReviewParams } from './dto/add-review.dto.js';
import { GetReview } from './dto/get-review.dto.js';
import { GetReviews, GetReviewsQuery } from './dto/get-reviews.dto.js';
import { PatchReview, PatchReviewParams } from './dto/patch-review.dto.js';
import { GetReviewsCount } from './dto/get-reviews-count.dto.js';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async addReview(userId: number, params: AddReviewParams, dto: AddReview) {
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        tags: {
          create: dto.tags?.map((tagId) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })),
        },
        businessId: userId,
        customerId: params.customerId,
      },
      include: {
        tags: true,
      },
    });
  }

  async getCustomerReview(userId: number, params: GetReview) {
    const review = await this.prisma.review.findUnique({
      where: {
        businessId_customerId: {
          businessId: userId,
          customerId: params.customerId,
        },
      },
      include: {
        tags: true,
      },
    });

    return review;
  }

  // todo: only get those with a comment
  async getCustomerReviews(params: GetReviews, query: GetReviewsQuery) {
    // todo: change this to 10
    const take = 2;

    const reviews = await this.prisma.review.findMany({
      take: take + 1, // fetching one extra to check for more results
      skip: query.cursorA && query.cursorB ? 1 : 0,
      cursor:
        query.cursorA && query.cursorB
          ? {
              businessId_customerId: {
                businessId: query.cursorA,
                customerId: query.cursorB,
              },
            }
          : undefined,
      where: {
        customerId: params.customerId,
        rating: query.rating,
      },
      include: {
        tags: true,
      },
      orderBy: query.sortBy
        ? {
            [query.sortBy]: query.order || 'desc',
          }
        : { createdAt: 'desc' },
    });

    const hasMore = reviews.length > take;

    return {
      reviews: hasMore ? reviews.slice(0, take) : reviews,
      cursorA: hasMore ? reviews[take - 1].businessId : -1,
      cursorB: hasMore ? reviews[take - 1].customerId : -1,
      hasMore,
    };
  }

  patchReview(userId: number, params: PatchReviewParams, dto: PatchReview) {
    // update only those that are defined
    return this.prisma.review.update({
      where: {
        businessId_customerId: {
          businessId: userId,
          customerId: params.customerId,
        },
      },
      data: {
        rating: dto.rating,
        comment: dto.comment,
        tags: {
          deleteMany: {
            reviewId: params.customerId,
          },
          create: dto.tags?.map((tagId) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  // todo: allow delete only if it's admin or the reviewer
  async deleteReview(dto: DeleteReview) {
    await this.prisma.review.delete({
      where: {
        businessId_customerId: {
          businessId: dto.businessId,
          customerId: dto.customerId,
        },
      },
    });
  }

  async getCustomerReviewsCount(params: GetReviewsCount) {
    const ratingsCountPromise = this.prisma.review.groupBy({
      by: ['rating'],
      where: {
        customerId: params.customerId,
      },
      _count: {
        rating: true,
      },
    });

    const tagsCountPromise = this.prisma.tagsOnReviews.groupBy({
      by: ['tagId'],
      where: {
        reviewId: params.customerId,
      },
      _count: {
        tagId: true,
      },
    });

    const [ratingsCountList, tagsCountList] = await Promise.all([
      ratingsCountPromise,
      tagsCountPromise,
    ]);
    const ratings: Record<number, number> = {};
    const tags: Record<number, number> = {};
    for (const count of ratingsCountList) {
      ratings[count.rating] = count._count.rating;
    }
    for (const count of tagsCountList) {
      tags[count.tagId] = count._count.tagId;
    }
    return {
      ratings,
      tags,
    };
  }
}
