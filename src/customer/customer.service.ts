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

  async getCustomer(query: GetCustomer) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email: query.email,
        phone: query.phone,
      },
    });

    return customer;
  }
}
