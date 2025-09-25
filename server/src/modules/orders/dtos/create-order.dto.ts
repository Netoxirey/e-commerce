import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Shipping address ID',
    example: 'clr1234567890abcdef',
  })
  @IsString({ message: 'Shipping address ID must be a string' })
  @IsNotEmpty({ message: 'Shipping address ID is required' })
  shippingAddressId: string;

  @ApiProperty({
    description: 'Billing address ID',
    example: 'clr1234567890abcdef',
  })
  @IsString({ message: 'Billing address ID must be a string' })
  @IsNotEmpty({ message: 'Billing address ID is required' })
  billingAddressId: string;

  @ApiProperty({
    description: 'Order notes',
    example: 'Please leave package at front door',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes must not exceed 500 characters' })
  notes?: string;
}
