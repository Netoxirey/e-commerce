import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, CreateOrderRequest, OrderQuery, PaginatedResponse, ApiError } from '@/types';
import { ordersService } from '@/services/orders';
import { getErrorMessage } from '@/lib/errorUtils';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  } | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  stats: null,
};

// Async thunks
export const createOrder = createAsyncThunk<
  Order,
  CreateOrderRequest,
  { rejectValue: ApiError }
>('orders/createOrder', async (data, { rejectWithValue }) => {
  try {
    const response = await ordersService.createOrder(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchUserOrders = createAsyncThunk<
  PaginatedResponse<Order>,
  OrderQuery | undefined,
  { rejectValue: ApiError }
>('orders/fetchUserOrders', async (query, { rejectWithValue }) => {
  try {
    const response = await ordersService.getUserOrders(query);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchAllOrders = createAsyncThunk<
  PaginatedResponse<Order>,
  OrderQuery | undefined,
  { rejectValue: ApiError }
>('orders/fetchAllOrders', async (query, { rejectWithValue }) => {
  try {
    const response = await ordersService.getAllOrders(query);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchOrder = createAsyncThunk<
  Order,
  string,
  { rejectValue: ApiError }
>('orders/fetchOrder', async (id, { rejectWithValue }) => {
  try {
    const response = await ordersService.getOrder(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  Order,
  string,
  { rejectValue: ApiError }
>('orders/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await ordersService.getOrderByNumber(orderNumber);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { id: string; data: { status?: string; paymentStatus?: string } },
  { rejectValue: ApiError }
>('orders/updateOrderStatus', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await ordersService.updateOrderStatus(id, data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const cancelOrder = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: ApiError }
>('orders/cancelOrder', async (id, { rejectWithValue }) => {
  try {
    const response = await ordersService.cancelOrder(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchOrderStats = createAsyncThunk<
  {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  },
  void,
  { rejectValue: ApiError }
>('orders/fetchOrderStats', async (_, { rejectWithValue }) => {
  try {
    const response = await ordersService.getOrderStats();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to create order');
      })
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.orders = []; // Ensure orders is always an array
        state.error = getErrorMessage(action.payload?.message, 'Failed to fetch orders');
      })
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.orders = []; // Ensure orders is always an array
        state.error = getErrorMessage(action.payload?.message, 'Failed to fetch orders');
      })
      // Fetch order
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to fetch order');
      })
      // Fetch order by number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to fetch order');
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to update order status');
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const orderIndex = state.orders.findIndex(
          (order) => order.id === action.meta.arg
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = 'CANCELLED';
        }
        if (state.currentOrder?.id === action.meta.arg) {
          state.currentOrder.status = 'CANCELLED';
        }
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to cancel order');
      })
      // Fetch order stats
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError, clearCurrentOrder } = ordersSlice.actions;
export { ordersSlice };
export default ordersSlice;
