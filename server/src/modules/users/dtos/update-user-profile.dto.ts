import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsDateString, MaxLength } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Please provide a valid URL for avatar' })
  avatar?: string;

  @ApiProperty({
    description: 'User date of birth',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid date' })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Software developer passionate about technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Bio must not exceed 500 characters' })
  bio?: string;

  @ApiProperty({
    description: 'User website URL',
    example: 'https://johndoe.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Please provide a valid URL for website' })
  website?: string;
}
