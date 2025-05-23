export interface AppMessage {
  type: "error" | "success" | "warning" | ""
  content: string
}
export interface AppState {
  message: AppMessage
  isLoading: boolean
  toggleSidebar: boolean
  userLoading: boolean
  toggleDialog: boolean
  languageMaster: string | null
  messageAlert: string
}
