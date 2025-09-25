import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'Address title',
    example: 'Home',
  })
  @IsString()
  @MinLength(2, { message: 'Title must be at least 2 characters long' })
  @MaxLength(50, { message: 'Title must not exceed 50 characters' })
  title: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corp',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  company?: string;

  @ApiProperty({
    description: 'Address line 1',
    example: '123 Main Street',
  })
  @IsString()
  @MinLength(5, { message: 'Address must be at least 5 characters long' })
  @MaxLength(100, { message: 'Address must not exceed 100 characters' })
  address1: string;

  @ApiProperty({
    description: 'Address line 2',
    example: 'Apt 4B',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Address line 2 must not exceed 100 characters' })
  address2?: string;

  @ApiProperty({
    description: 'City',
    example: 'New York',
  })
  @IsString()
  @MinLength(2, { message: 'City must be at least 2 characters long' })
  @MaxLength(50, { message: 'City must not exceed 50 characters' })
  city: string;

  @ApiProperty({
    description: 'State/Province',
    example: 'NY',
  })
  @IsString()
  @MinLength(2, { message: 'State must be at least 2 characters long' })
  @MaxLength(50, { message: 'State must not exceed 50 characters' })
  state: string;

  @ApiProperty({
    description: 'Postal/ZIP code',
    example: '10001',
  })
  @IsString()
  @MinLength(3, { message: 'Postal code must be at least 3 characters long' })
  @MaxLength(20, { message: 'Postal code must not exceed 20 characters' })
  postalCode: string;

  @ApiProperty({
    description: 'Country',
    example: 'USA',
  })
  @IsString()
  @MinLength(2, { message: 'Country must be at least 2 characters long' })
  @MaxLength(50, { message: 'Country must not exceed 50 characters' })
  country: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Set as default address',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
