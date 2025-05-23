export interface Product {
  id: string
  name: string
  price: number
  duration: number
  rating: number
}

export interface ProductState {
  productList: Product[]
  isLoading: boolean
  meta: any
}

export interface ProductResponse {
  items: Product[]
  meta: {
    total: number
    page: number
    more?: boolean
  }
}

export interface PagingProduct {
  limit: number
  page: number
}
