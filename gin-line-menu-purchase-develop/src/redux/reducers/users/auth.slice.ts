import { AuthRegister, AuthSignIn, AuthState } from "@/interfaces"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: AuthState = {
  currentUser: undefined,
  loading: true,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    AUTH_USER_LOGIN: (state, action: PayloadAction<AuthSignIn>) => {},
    AUTH_SET_CURRENT_USER: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload
      state.loading = false
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    AUTH_USER_REGISTER: (state, action: PayloadAction<AuthRegister>) => {},
    AUTH_GET_INFO: () => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    AUTH_LOADING: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    AUTH_LOGOUT: state => {
      console.log(state)
    },
  },
})

// Actions
export const {
  AUTH_USER_LOGIN,
  AUTH_SET_CURRENT_USER,
  AUTH_USER_REGISTER,
  AUTH_GET_INFO,
  AUTH_LOADING,
  AUTH_LOGOUT,
} = authSlice.actions

// Selector
export const currentUser = (state: AuthState) => state.currentUser

// Reducer
const authReducer = authSlice.reducer

export default authReducer
