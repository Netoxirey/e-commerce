import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/config/prisma/prisma.service';
import { AddToCartDto } from '../dtos/add-to-cart.dto';
import { UpdateCartItemDto } from '../dtos/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                attributes: true,
                _count: {
                  select: {
                    reviews: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!cart) {
      // Create cart if it doesn't exist
      return this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  attributes: true,
                  _count: {
                    select: {
                      reviews: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Check if product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }

    if (product.trackQuantity && product.quantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Get or create cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      if (product.trackQuantity && product.quantity < newQuantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const updatedItem = await this.prisma.cartItem.update({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              category: true,
              attributes: true,
              _count: {
                select: {
                  reviews: true,
                },
              },
            },
          },
        },
      });

      return updatedItem;
    } else {
      // Create new cart item
      const newItem = await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              category: true,
              attributes: true,
              _count: {
                select: {
                  reviews: true,
                },
              },
            },
          },
        },
      });

      return newItem;
    }
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;

    // Check if cart item exists and belongs to user
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    // Check stock availability
    if (
      cartItem.product.trackQuantity &&
      cartItem.product.quantity < quantity
    ) {
      throw new BadRequestException('Insufficient stock');
    }

    const updatedItem = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true,
            attributes: true,
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
    });

    return updatedItem;
  }

  async removeFromCart(userId: string, itemId: string) {
    // Check if cart item exists and belongs to user
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from cart successfully' };
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'Cart cleared successfully' };
  }

  async getCartSummary(userId: string) {
    const cart = await this.getCart(userId);

    const items = cart.items.map((item) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
      subtotal: Number(item.product.price) * item.quantity,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      subtotal: Number(subtotal.toFixed(2)),
      itemCount,
      itemTypes: items.length,
    };
  }

  async validateCartItems(userId: string) {
    const cart = await this.getCart(userId);
    const validationErrors = [];

    for (const item of cart.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        validationErrors.push({
          itemId: item.id,
          productId: item.productId,
          error: 'Product no longer exists',
        });
        continue;
      }

      if (!product.isActive) {
        validationErrors.push({
          itemId: item.id,
          productId: item.productId,
          error: 'Product is no longer available',
        });
        continue;
      }

      if (product.trackQuantity && product.quantity < item.quantity) {
        validationErrors.push({
          itemId: item.id,
          productId: item.productId,
          error: `Only ${product.quantity} items available`,
        });
        continue;
      }
    }

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    };
  }
}
