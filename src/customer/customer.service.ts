import { Injectable } from '@nestjs/common';
import { CreateCustomer, GetCustomer } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(dto: CreateCustomer) {
    return await this.prisma.customer.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
      },
    });
  }

  getCustomer(query: GetCustomer) {
    return this.prisma.customer.findUnique({
      where: {
        email: query.email,
        phone: query.phone,
      },
    });
  }
}
