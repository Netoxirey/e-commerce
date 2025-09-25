import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/config/prisma/prisma.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductQueryDto } from '../dtos/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryId, attributes, ...productData } = createProductDto;

    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if SKU is unique
    if (productData.sku) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { sku: productData.sku },
      });

      if (existingProduct) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    // Create product with attributes
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        categoryId,
        attributes: {
          create: attributes?.map((attr) => ({
            name: attr.name,
            value: attr.value,
          })) || [],
        },
      },
      include: {
        category: true,
        attributes: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    return product;
  }

  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      minPrice,
      maxPrice,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { sku: { contains: search, mode: 'insensitive' as const } },
      ];
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if ((minPrice !== undefined && !isNaN(minPrice)) || (maxPrice !== undefined && !isNaN(maxPrice))) {
      where.price = {};
      if (minPrice !== undefined && !isNaN(minPrice)) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined && !isNaN(maxPrice)) {
        where.price.lte = maxPrice;
      }
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          attributes: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        attributes: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        attributes: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryId, attributes, ...productData } = updateProductDto;

    // Check if product exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Check if category exists
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Check if SKU is unique (excluding current product)
    if (productData.sku) {
      const existingProductWithSku = await this.prisma.product.findFirst({
        where: {
          sku: productData.sku,
          id: { not: id },
        },
      });

      if (existingProductWithSku) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    // Update product
    const product = await this.prisma.product.update({
      where: { id },
      data: productData,
      include: {
        category: true,
        attributes: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    // Update attributes if provided
    if (attributes) {
      // Delete existing attributes
      await this.prisma.productAttribute.deleteMany({
        where: { productId: id },
      });

      // Create new attributes
      await this.prisma.productAttribute.createMany({
        data: attributes.map((attr) => ({
          productId: id,
          name: attr.name,
          value: attr.value,
        })),
      });

      // Fetch updated product with attributes
      return this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          attributes: true,
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      });
    }

    return product;
  }

  async remove(id: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if product has orders
    const orderItems = await this.prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (orderItems) {
      throw new BadRequestException(
        'Cannot delete product that has been ordered. Consider deactivating it instead.',
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  async updateInventory(id: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { quantity },
      include: {
        category: true,
        attributes: true,
      },
    });

    return updatedProduct;
  }

  async getFeaturedProducts(limit: number = 10) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        quantity: { gt: 0 },
      },
      take: limit,
      include: {
        category: true,
        attributes: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRelatedProducts(productId: string, limit: number = 4) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        isActive: true,
        quantity: { gt: 0 },
      },
      take: limit,
      include: {
        category: true,
        attributes: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
