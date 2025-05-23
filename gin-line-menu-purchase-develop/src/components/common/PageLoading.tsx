import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Fade from "@mui/material/Fade"

interface PageLoadingProps {
  show?: boolean
}
// Component PageLoading
function PageLoading({ show = true }: PageLoadingProps) {
  return (
    <Fade in={show} unmountOnExit>
      <Box className="page-loading">
        <CircularProgress />
        <p>読み込み中。。。</p>
      </Box>
    </Fade>
  )
}

export default PageLoading
