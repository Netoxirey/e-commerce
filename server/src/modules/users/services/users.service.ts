import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';

import { PrismaService } from '@/config/prisma/prisma.service';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UpdateUserProfileDto } from '../dtos/update-user-profile.dto';
import { CreateAddressDto } from '../dtos/create-address.dto';
import { UpdateAddressDto } from '../dtos/update-address.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { email, firstName, lastName, phone } = updateUserDto;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Email is already taken');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(email && { email }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
      },
      include: {
        profile: true,
        addresses: true,
      },
    });

    return user;
  }

  async updateUserProfile(
    userId: string,
    updateProfileDto: UpdateUserProfileDto,
  ): Promise<any> {
    const { avatar, dateOfBirth, bio, website } = updateProfileDto;

    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: {
        ...(avatar !== undefined && { avatar }),
        ...(dateOfBirth !== undefined && { dateOfBirth }),
        ...(bio !== undefined && { bio }),
        ...(website !== undefined && { website }),
      },
      create: {
        userId,
        ...(avatar && { avatar }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(bio && { bio }),
        ...(website && { website }),
      },
    });

    return profile;
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    const { isDefault, ...addressData } = createAddressDto;

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.create({
      data: {
        ...addressData,
        userId,
        isDefault: isDefault || false,
      },
    });

    return address;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    const { isDefault, ...addressData } = updateAddressDto;

    // Check if address belongs to user
    const existingAddress = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.update({
      where: { id: addressId },
      data: {
        ...addressData,
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return address;
  }

  async deleteAddress(userId: string, addressId: string) {
    // Check if address belongs to user
    const existingAddress = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existingAddress) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: UserRole,
  ) {
    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(role && { role }),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          profile: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(userId: string, role: UserRole, currentUser: User) {
    // Only admins can update user roles
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update user roles');
    }

    // Prevent users from changing their own role
    if (currentUser.id === userId) {
      throw new ForbiddenException('Cannot change your own role');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      include: {
        profile: true,
        addresses: true,
      },
    });

    return user;
  }

  async deactivateUser(userId: string, currentUser: User) {
    // Only admins can deactivate users
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can deactivate users');
    }

    // Prevent users from deactivating themselves
    if (currentUser.id === userId) {
      throw new ForbiddenException('Cannot deactivate yourself');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return user;
  }
}
