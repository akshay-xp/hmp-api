import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteReviewParams } from './dto/delete-review.dto';
import { AddReview } from './dto/add-review.dto.js';
import { GetReview } from './dto/get-review.dto.js';
import { GetReviews, GetReviewsQuery } from './dto/get-reviews.dto.js';
import { PatchReview, PatchReviewParams } from './dto/patch-review.dto.js';
import { GetReviewsCount } from './dto/get-reviews-count.dto.js';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async addReview(userId: number, dto: AddReview) {
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
        customerId: dto.customerId,
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
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor
        ? {
            id: query.cursor,
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
      cursor: hasMore ? reviews[take - 1].id : -1,
      hasMore,
    };
  }

  patchReview(userId: number, params: PatchReviewParams, dto: PatchReview) {
    // update only those that are defined
    return this.prisma.review.update({
      where: {
        id: params.reviewId,
      },
      data: {
        rating: dto.rating,
        comment: dto.comment,
        tags: {
          deleteMany: {
            reviewId: params.reviewId,
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
  async deleteReview(dto: DeleteReviewParams) {
    await this.prisma.review.delete({
      where: {
        id: dto.reviewId,
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
