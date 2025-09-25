import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, Category, ProductQuery, PaginatedResponse, ApiError } from '@/types';
import { productsService } from '@/services/products';
import { getErrorMessage } from '@/lib/errorUtils';

interface ProductsState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  relatedProducts: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  filters: ProductQuery;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  featuredProducts: [],
  currentProduct: null,
  relatedProducts: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchProducts = createAsyncThunk<
  PaginatedResponse<Product>,
  ProductQuery | undefined,
  { rejectValue: ApiError }
>('products/fetchProducts', async (query, { rejectWithValue }) => {
  try {
    const response = await productsService.getProducts(query);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchProduct = createAsyncThunk<
  Product,
  string,
  { rejectValue: ApiError }
>('products/fetchProduct', async (id, { rejectWithValue }) => {
  try {
    const response = await productsService.getProduct(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchProductBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: ApiError }
>('products/fetchProductBySlug', async (slug, { rejectWithValue }) => {
  try {
    const response = await productsService.getProductBySlug(slug);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchFeaturedProducts = createAsyncThunk<
  Product[],
  number | undefined,
  { rejectValue: ApiError }
>('products/fetchFeaturedProducts', async (limit, { rejectWithValue }) => {
  try {
    const response = await productsService.getFeaturedProducts(limit);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchRelatedProducts = createAsyncThunk<
  Product[],
  { id: string; limit?: number },
  { rejectValue: ApiError }
>('products/fetchRelatedProducts', async ({ id, limit }, { rejectWithValue }) => {
  try {
    const response = await productsService.getRelatedProducts(id, limit);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: ApiError }
>('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await productsService.getCategories();
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchCategory = createAsyncThunk<
  Category,
  string,
  { rejectValue: ApiError }
>('products/fetchCategory', async (id, { rejectWithValue }) => {
  try {
    const response = await productsService.getCategory(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

export const fetchCategoryBySlug = createAsyncThunk<
  Category,
  string,
  { rejectValue: ApiError }
>('products/fetchCategoryBySlug', async (slug, { rejectWithValue }) => {
  try {
    const response = await productsService.getCategoryBySlug(slug);
    return response;
  } catch (error: any) {
    return rejectWithValue(error);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<ProductQuery>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearRelatedProducts: (state) => {
      state.relatedProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to fetch products');
      })
      // Fetch product
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to fetch product');
      })
      // Fetch product by slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = getErrorMessage(action.payload?.message, 'Failed to fetch product');
      })
      // Fetch featured products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      // Fetch related products
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch category
      .addCase(fetchCategory.fulfilled, (state, action) => {
        // Handle category fetch if needed
      })
      // Fetch category by slug
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        // Handle category fetch if needed
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  clearCurrentProduct,
  clearRelatedProducts,
} = productsSlice.actions;
export { productsSlice };
export default productsSlice;
