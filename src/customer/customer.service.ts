import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomer, GetCustomer } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(dto: CreateCustomer) {
    try {
      const response = await this.prisma.customer.create({
        data: {
          email: dto.email,
          name: dto.name,
          phone: dto.phone,
        },
      });

      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const meta = error.meta as { target?: string[] } | undefined;
          const conflictingField = meta?.target?.join(', ') || 'Email or Phone';
          throw new ConflictException(`${conflictingField} is already in use`);
        }
      }
      throw error;
    }
  }

  async getCustomer(query: GetCustomer) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email: query.email,
        phone: query.phone,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
}
