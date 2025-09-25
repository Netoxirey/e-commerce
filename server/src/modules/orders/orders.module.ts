import { Module } from '@nestjs/common';

import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
