import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/config/prisma/prisma.service';
import { CartService } from '@/modules/cart/services/cart.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { shippingAddressId, billingAddressId, notes } = createOrderDto;

    // Validate addresses belong to user
    const [shippingAddress, billingAddress] = await Promise.all([
      this.prisma.address.findFirst({
        where: { id: shippingAddressId, userId },
      }),
      this.prisma.address.findFirst({
        where: { id: billingAddressId, userId },
      }),
    ]);

    if (!shippingAddress) {
      throw new NotFoundException('Shipping address not found');
    }

    if (!billingAddress) {
      throw new NotFoundException('Billing address not found');
    }

    // Validate cart items
    const cartValidation = await this.cartService.validateCartItems(userId);
    if (!cartValidation.isValid) {
      throw new BadRequestException('Cart contains invalid items', {
        cause: cartValidation.errors,
      });
    }

    // Get cart with items
    const cart = await this.cartService.getCart(userId);
    if (!cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    // Calculate totals
    const cartSummary = await this.cartService.getCartSummary(userId);
    const taxRate = 0.08; // 8% tax rate
    const taxAmount = cartSummary.subtotal * taxRate;
    const shippingAmount = 0; // Free shipping for now
    const total = cartSummary.subtotal + taxAmount + shippingAmount;

    // Generate order number
    const orderNumber = this.generateOrderNumber();

    // Create order with items
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          subtotal: cartSummary.subtotal,
          taxAmount,
          shippingAmount,
          total,
          currency: 'USD',
          notes,
          shippingAddressId,
          billingAddressId,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        cart.items.map((item) =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            },
          }),
        ),
      );

      // Update product quantities
      await Promise.all(
        cart.items.map((item) => {
          if (item.product.trackQuantity) {
            return tx.product.update({
              where: { id: item.productId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }),
      );

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return {
        ...newOrder,
        items: orderItems,
      };
    });

    // Simulate payment processing
    await this.simulatePayment(order.id);

    return order;
  }

  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  attributes: true,
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                attributes: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByOrderNumber(userId: string, orderNumber: string) {
    const order = await this.prisma.order.findFirst({
      where: { orderNumber, userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                attributes: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: any,
  ) {
    const { status, paymentStatus } = updateOrderStatusDto;

    // Check if order exists
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Only admin, seller, or order owner can update status
    if (
      currentUser.role !== 'ADMIN' &&
      currentUser.role !== 'SELLER' &&
      order.userId !== currentUser.id
    ) {
      throw new ForbiddenException('Not authorized to update this order');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                attributes: true,
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedOrder;
  }

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // Restore product quantities
    await this.prisma.$transaction(async (tx) => {
      const orderItems = await tx.orderItem.findMany({
        where: { orderId },
        include: { product: true },
      });

      await Promise.all(
        orderItems.map((item) => {
          if (item.product.trackQuantity) {
            return tx.product.update({
              where: { id: item.productId },
              data: {
                quantity: {
                  increment: item.quantity,
                },
              },
            });
          }
        }),
      );

      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
    });

    return { message: 'Order cancelled successfully' };
  }

  async getAllOrders(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
    paymentStatus?: PaymentStatus,
  ) {
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  attributes: true,
                },
              },
            },
          },
          shippingAddress: true,
          billingAddress: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
      this.prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.total || 0,
    };
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  private async simulatePayment(orderId: string): Promise<void> {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate 95% success rate
    const isSuccessful = Math.random() > 0.05;

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: isSuccessful ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
        status: isSuccessful ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED,
      },
    });
  }
}
