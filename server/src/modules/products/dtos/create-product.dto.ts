import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsUrl,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductAttributeDto {
  @ApiProperty({
    description: 'Attribute name',
    example: 'Color',
  })
  @IsString()
  @MinLength(1, { message: 'Attribute name is required' })
  @MaxLength(50, { message: 'Attribute name must not exceed 50 characters' })
  name: string;

  @ApiProperty({
    description: 'Attribute value',
    example: 'Red',
  })
  @IsString()
  @MinLength(1, { message: 'Attribute value is required' })
  @MaxLength(100, { message: 'Attribute value must not exceed 100 characters' })
  value: string;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
  })
  @IsString()
  @MinLength(2, { message: 'Product name must be at least 2 characters long' })
  @MaxLength(200, { message: 'Product name must not exceed 200 characters' })
  name: string;

  @ApiProperty({
    description: 'Product slug (URL-friendly version of name)',
    example: 'iphone-15-pro',
  })
  @IsString()
  @MinLength(2, { message: 'Product slug must be at least 2 characters long' })
  @MaxLength(200, { message: 'Product slug must not exceed 200 characters' })
  slug: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with advanced camera system',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price: number;

  @ApiProperty({
    description: 'Compare at price (original price before discount)',
    example: 1099.99,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'Compare price must be greater than or equal to 0' })
  comparePrice?: number;

  @ApiProperty({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'IPH15P-128',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'SKU must not exceed 100 characters' })
  sku?: string;

  @ApiProperty({
    description: 'Product barcode',
    example: '1234567890123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Barcode must not exceed 50 characters' })
  barcode?: string;

  @ApiProperty({
    description: 'Track quantity for this product',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  trackQuantity?: boolean;

  @ApiProperty({
    description: 'Available quantity',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Quantity must be greater than or equal to 0' })
  quantity?: number;

  @ApiProperty({
    description: 'Product weight in kg',
    example: 0.187,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'Weight must be greater than or equal to 0' })
  weight?: number;

  @ApiProperty({
    description: 'Product dimensions (length, width, height)',
    example: { length: 14.76, width: 7.15, height: 0.83 },
    required: false,
  })
  @IsOptional()
  dimensions?: any;

  @ApiProperty({
    description: 'Product images URLs',
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL' })
  images?: string[];

  @ApiProperty({
    description: 'Product active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Is this a digital product',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDigital?: boolean;

  @ApiProperty({
    description: 'Category ID',
    example: 'clr1234567890abcdef',
  })
  @IsString({ message: 'Category ID must be a string' })
  @IsNotEmpty({ message: 'Category ID is required' })
  categoryId: string;

  @ApiProperty({
    description: 'Product attributes',
    type: [ProductAttributeDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  attributes?: ProductAttributeDto[];
}
