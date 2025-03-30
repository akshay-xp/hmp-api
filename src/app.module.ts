import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { ReviewModule } from './review/review.module';
import { UsersModule } from './users/users.module';
import { ReviewTagsModule } from './review-tags/review-tags.module';
import { ReviewReportsModule } from './review-reports/review-reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    CustomerModule,
    ReviewModule,
    UsersModule,
    ReviewTagsModule,
    ReviewReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
