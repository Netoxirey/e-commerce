import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  @IsString()
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Category name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Category slug (URL-friendly version of name)',
    example: 'electronics',
  })
  @IsString()
  @MinLength(2, { message: 'Category slug must be at least 2 characters long' })
  @MaxLength(100, { message: 'Category slug must not exceed 100 characters' })
  slug: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Electronic devices and accessories',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Category image URL',
    example: 'https://example.com/category-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Please provide a valid URL for category image' })
  image?: string;

  @ApiProperty({
    description: 'Category active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Parent category ID',
    example: 'clr1234567890abcdef',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Parent category ID must be a string' })
  parentId?: string;
}
