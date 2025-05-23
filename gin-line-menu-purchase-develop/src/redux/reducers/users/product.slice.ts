import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  PagingProduct,
  ProductResponse,
  ProductState,
} from "../../../interfaces/product"

const initialState: ProductState = {
  productList: [],
  isLoading: false,
  meta: {},
}

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    FETCH_PRODUCTS: (state, action: PayloadAction<PagingProduct>) => {
      state.isLoading = true
    },
    SET_PRODUCT: (state, action: PayloadAction<ProductResponse>) => {
      const { items, meta } = action.payload
      state.meta.total = meta.total
      state.meta.page = meta.page
      state.isLoading = false
      state.productList = items
    },

    SET_ERROR_MESSAGE: state => {
      state.isLoading = false
    },
  },
})

// Actions
export const { FETCH_PRODUCTS, SET_PRODUCT, SET_ERROR_MESSAGE } =
  productSlice.actions

// Selectors
export const productList = (state: ProductState) => state.productList

// Reducer
const productReducer = productSlice.reducer

export default productReducer
