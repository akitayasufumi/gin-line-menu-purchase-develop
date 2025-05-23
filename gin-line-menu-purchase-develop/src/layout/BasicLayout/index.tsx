import PageLoading from "@/components/common/PageLoading"
import useNotification from "@/hook/useNotification"
import { useAppSelector } from "@/redux/hook"
import { getTabId, setTabId } from "@/utils"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const theme = createTheme()
// Auth Layout
export default function AuthLayout() {
  useNotification()

  const { isLoading } = useAppSelector(state => state.app)

  const { currentUser } = useAppSelector(state => state.auth)

  const authChannel = new BroadcastChannel("auth")

  useEffect(() => {
    if (currentUser?.id) {
      authChannel.postMessage({
        action: "login",
        user: currentUser,
        tabId: getTabId(),
      })
      // navigate(ROUTER_PATH.LINE_MENU)
    }
  }, [currentUser])

  useEffect(() => {
    setTabId()
    authChannel.addEventListener("message", e => {
      if (e.data.action === "login" && e.data.tabId !== getTabId()) {
        window.location.reload()
      }
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Box component="main">
        <CssBaseline />
        <Outlet />
      </Box>
      <PageLoading show={isLoading} />
    </ThemeProvider>
  )
}
