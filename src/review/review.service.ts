import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteReviewParams } from './dto/delete-review.dto';
import { AddReview } from './dto/add-review.dto.js';
import { GetReview } from './dto/get-review.dto.js';
import { GetReviews, GetReviewsQuery } from './dto/get-reviews.dto.js';
import { PatchReview, PatchReviewParams } from './dto/patch-review.dto.js';
import { GetReviewsCount } from './dto/get-reviews-count.dto.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Role } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async addReview(userId: number, dto: AddReview) {
    try {
      const response = await this.prisma.review.create({
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

      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException('Review already exists');
          case 'P2003':
            throw new NotFoundException('Customer does not exist');
          case 'P2025':
            throw new NotFoundException('One or more tags not found');
        }
      }
      throw error;
    }
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

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async getCustomerReviews(params: GetReviews, query: GetReviewsQuery) {
    const take = 10;

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
        comment: { not: null },
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

    if (!reviews.length) {
      throw new NotFoundException('No reviews found');
    }

    const hasMore = reviews.length > take;

    return {
      reviews: hasMore ? reviews.slice(0, take) : reviews,
      cursor: hasMore ? reviews[take - 1].id : -1,
      hasMore,
    };
  }

  async patchReview(
    userId: number,
    params: PatchReviewParams,
    dto: PatchReview,
  ) {
    try {
      const response = await this.prisma.review.update({
        where: {
          id: params.reviewId,
          businessId: userId,
        },
        data: {
          rating: dto.rating,
          comment: dto.comment,
          tags: {
            deleteMany: {},
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

      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new NotFoundException('Review and/or tag(s) not found');
        }
      }
      throw error;
    }
  }

  async deleteReview(userId: number, role: Role, dto: DeleteReviewParams) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: dto.reviewId,
      },
      select: {
        businessId: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (role !== 'ADMIN' && review.businessId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    const response = await this.prisma.review.delete({
      where: {
        id: dto.reviewId,
      },
    });

    return response;
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
        review: {
          customerId: params.customerId,
        },
      },
      _count: {
        tagId: true,
      },
    });

    const [ratingsCountList, tagsCountList] = await Promise.all([
      ratingsCountPromise,
      tagsCountPromise,
    ]);

    if (ratingsCountList.length === 0 && tagsCountList.length === 0) {
      throw new NotFoundException('No reviews found for this customer');
    }

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
