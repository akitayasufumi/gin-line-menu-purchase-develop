import { Box, CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import React from "react"
import { Outlet } from "react-router-dom"

const theme = createTheme({
  spacing: 8,
  palette: {
    mode: "light",
  },
  components: {},
})

// Main Layout
function MainLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box
          component="main"
          className="main-layout"
          sx={{
            flexGrow: 1,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default React.memo(MainLayout)
