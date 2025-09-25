import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem, CartSummary, AddToCartRequest, UpdateCartItemRequest, ApiError } from '@/types';
import { cartService } from '@/services/cart';
import { getErrorMessage } from '@/lib/errorUtils';

interface CartState {
  cart: Cart | null;
  summary: CartSummary | null;
  isLoading: boolean;
  error: string | null;
  isValid: boolean;
  validationErrors: any[];
}

const initialState: CartState = {
  cart: null,
  summary: null,
  isLoading: false,
  error: null,
  isValid: true,
  validationErrors: [],
};

// Async thunks
export const fetchCart = createAsyncThunk<
  Cart,
  void,
  { rejectValue: ApiError }
>('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.getCart();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchCartSummary = createAsyncThunk<
  CartSummary,
  void,
  { rejectValue: ApiError }
>('cart/fetchCartSummary', async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.getCartSummary();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const validateCartItems = createAsyncThunk<
  { isValid: boolean; errors: any[] },
  void,
  { rejectValue: ApiError }
>('cart/validateCartItems', async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.validateCartItems();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const addToCart = createAsyncThunk<
  CartItem,
  AddToCartRequest,
  { rejectValue: ApiError; state: any }
>('cart/addToCart', async (data, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const isAuthenticated = state.auth.isAuthenticated;
    
    if (!isAuthenticated) {
      // Return a special error that indicates authentication is required
      return rejectWithValue({
        message: 'Authentication required',
        statusCode: 401,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
        path: '/cart',
        method: 'POST',
        isAuthRequired: true
      });
    }
    
    const response = await cartService.addToCart(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateCartItem = createAsyncThunk<
  CartItem,
  { itemId: string; data: UpdateCartItemRequest },
  { rejectValue: ApiError; state: any }
>('cart/updateCartItem', async ({ itemId, data }, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const isAuthenticated = state.auth.isAuthenticated;
    
    if (!isAuthenticated) {
      return rejectWithValue({
        message: 'Authentication required',
        statusCode: 401,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
        path: '/cart',
        method: 'PUT',
        isAuthRequired: true
      });
    }
    
    const response = await cartService.updateCartItem(itemId, data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const removeFromCart = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: ApiError; state: any }
>('cart/removeFromCart', async (itemId, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const isAuthenticated = state.auth.isAuthenticated;
    
    if (!isAuthenticated) {
      return rejectWithValue({
        message: 'Authentication required',
        statusCode: 401,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
        path: '/cart',
        method: 'DELETE',
        isAuthRequired: true
      });
    }
    
    const response = await cartService.removeFromCart(itemId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const clearCart = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: ApiError; state: any }
>('cart/clearCart', async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const isAuthenticated = state.auth.isAuthenticated;
    
    if (!isAuthenticated) {
      return rejectWithValue({
        message: 'Authentication required',
        statusCode: 401,
        error: 'Unauthorized',
        timestamp: new Date().toISOString(),
        path: '/cart',
        method: 'DELETE',
        isAuthRequired: true
      });
    }
    
    const response = await cartService.clearCart();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = [];
      state.isValid = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to fetch cart');
      })
      // Fetch cart summary
      .addCase(fetchCartSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
        state.error = null;
      })
      .addCase(fetchCartSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to fetch cart summary');
      })
      // Validate cart items
      .addCase(validateCartItems.fulfilled, (state, action) => {
        state.isValid = action.payload.isValid;
        state.validationErrors = action.payload.errors;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.cart) {
          const existingItemIndex = state.cart.items.findIndex(
            (item) => item.id === action.payload.id
          );
          if (existingItemIndex !== -1) {
            state.cart.items[existingItemIndex] = action.payload;
          } else {
            state.cart.items.push(action.payload);
          }
        }
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to add item to cart');
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.cart) {
          const itemIndex = state.cart.items.findIndex(
            (item) => item.id === action.payload.id
          );
          if (itemIndex !== -1) {
            state.cart.items[itemIndex] = action.payload;
          }
        }
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to update cart item');
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.cart) {
          state.cart.items = state.cart.items.filter(
            (item) => item.id !== action.meta.arg
          );
        }
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to remove item from cart');
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        if (state.cart) {
          state.cart.items = [];
        }
        state.summary = null;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to clear cart');
      });
  },
});

export const { clearError, clearValidationErrors } = cartSlice.actions;
export { cartSlice };
export default cartSlice;
