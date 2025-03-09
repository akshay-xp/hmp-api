import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateCustomer, GetCustomer } from './dto';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  createCustomer(@Body() dto: CreateCustomer) {
    return this.customerService.createCustomer(dto);
  }

  @Get()
  getCustomerReviews(@Query() query: GetCustomer) {
    return this.customerService.getCustomer(query);
  }
}
