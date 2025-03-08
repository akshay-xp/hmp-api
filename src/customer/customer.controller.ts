import { Body, Controller, Post } from '@nestjs/common';
import { CreateCustomer } from './dto';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post('/')
  createCustomer(@Body() dto: CreateCustomer) {
    return this.customerService.createCustomer(dto);
  }
}
