import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginRequest, SignupRequest, AuthResponse, ApiError, CreateAddressRequest, UpdateAddressRequest } from '@/types';
import { authService } from '@/services/auth';
import { usersService } from '@/services/users';
import { getErrorMessage } from '@/lib/errorUtils';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const signup = createAsyncThunk<
  AuthResponse,
  SignupRequest,
  { rejectValue: ApiError }
>('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.signup(credentials);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const signin = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: ApiError }
>('auth/signin', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.signin(credentials);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const logout = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: ApiError }
>('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.logout();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const checkAuth = createAsyncThunk<
  boolean,
  void,
  { rejectValue: ApiError }
>('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    return authService.isAuthenticated();
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const restoreAuthState = createAsyncThunk<
  { isAuthenticated: boolean; user?: any },
  void,
  { rejectValue: ApiError }
>('auth/restoreAuthState', async (_, { rejectWithValue }) => {
  try {
    const result = await authService.restoreAuthState();
    return result;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: ApiError }
>('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await usersService.getProfile();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateProfile = createAsyncThunk<
  User,
  any,
  { rejectValue: ApiError }
>('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await usersService.updateProfile(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateUserProfile = createAsyncThunk<
  any,
  any,
  { rejectValue: ApiError }
>('auth/updateUserProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await usersService.updateUserProfile(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const createAddress = createAsyncThunk<
  any,
  CreateAddressRequest,
  { rejectValue: ApiError }
>('auth/createAddress', async (data, { rejectWithValue }) => {
  try {
    const response = await usersService.createAddress(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const updateAddress = createAsyncThunk<
  any,
  { addressId: string; data: UpdateAddressRequest },
  { rejectValue: ApiError }
>('auth/updateAddress', async ({ addressId, data }, { rejectWithValue }) => {
  try {
    const response = await usersService.updateAddress(addressId, data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const deleteAddress = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: ApiError }
>('auth/deleteAddress', async (addressId, { rejectWithValue }) => {
  try {
    const response = await usersService.deleteAddress(addressId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Signup failed');
      })
      // Signin
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Login failed');
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        // Even if logout fails on server, clear local state
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = getErrorMessage(action.payload?.message, 'Logout failed');
      })
      // Check auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
        if (!action.payload) {
          state.user = null;
        }
      })
      // Restore auth state
      .addCase(restoreAuthState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        if (action.payload.isAuthenticated && action.payload.user) {
          state.user = action.payload.user;
        } else {
          state.user = null;
        }
        state.error = null;
      })
      .addCase(restoreAuthState.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = getErrorMessage(action.payload?.message, 'Failed to restore authentication');
      })
      // Fetch user profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Update user profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user.profile = action.payload;
        }
      })
      // Create address
      .addCase(createAddress.fulfilled, (state, action) => {
        if (state.user) {
          if (!state.user.addresses) {
            state.user.addresses = [];
          }
          state.user.addresses.push(action.payload);
        }
      })
      // Update address
      .addCase(updateAddress.fulfilled, (state, action) => {
        if (state.user && state.user.addresses) {
          const index = state.user.addresses.findIndex(addr => addr.id === action.payload.id);
          if (index !== -1) {
            state.user.addresses[index] = action.payload;
          }
        }
      })
      // Delete address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (state.user && state.user.addresses) {
          state.user.addresses = state.user.addresses.filter(addr => addr.id !== action.meta.arg);
        }
      });
  },
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export { authSlice };
export default authSlice;
