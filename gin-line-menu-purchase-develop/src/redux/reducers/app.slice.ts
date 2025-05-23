import { AppState, AppMessage } from "@/interfaces"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LANGUAGE_STORE_KEY, DEFAULT_LANGUAGE } from "@/constants"

const initialState: AppState = {
  userLoading: true,
  isLoading: false,
  message: {
    // type === '' not show notification
    type: "",
    content: "",
  },
  toggleSidebar: true,
  toggleDialog: false,
  languageMaster: localStorage.getItem(LANGUAGE_STORE_KEY)
    ? localStorage.getItem(LANGUAGE_STORE_KEY)
    : DEFAULT_LANGUAGE,
  messageAlert: "",
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    SET_MESSAGE: (state, action: PayloadAction<AppMessage>) => {
      state.message = action.payload
    },
    RESET_MESSAGE: state => {
      state.message = initialState.message
    },
    SET_LOADING: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    TOGGLE_SIDEBAR: state => {
      state.toggleSidebar = !state.toggleSidebar
    },
    SET_USERLOADING: (state, action: PayloadAction<boolean>) => {
      state.userLoading = action.payload
    },
    TOGGLE_DIALOG: state => {
      state.toggleDialog = !state.toggleDialog
    },
    SET_LANGUAGE: (state, action: PayloadAction<string>) => {
      state.languageMaster = action.payload
    },
    SET_MESSAGE_ALERT: (state, action: PayloadAction<string>) => {
      state.messageAlert = action.payload
    },
  },
})

// Actions
export const {
  SET_MESSAGE,
  RESET_MESSAGE,
  SET_LOADING,
  TOGGLE_SIDEBAR,
  SET_USERLOADING,
  TOGGLE_DIALOG,
  SET_LANGUAGE,
  SET_MESSAGE_ALERT,
} = appSlice.actions

// Selector
export const message = (state: AppState) => state.message

// Reducer
export default appSlice.reducer
