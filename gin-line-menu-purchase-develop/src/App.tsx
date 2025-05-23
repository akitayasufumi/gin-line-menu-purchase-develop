import { SnackbarProvider } from "notistack"
import Routes from "./routes"
import { store } from "./redux/store"
import { Provider } from "react-redux"
import "@/assets/styles/app.scss"

function App() {
  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <Provider store={store}>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div className="px-3 max-w-[1024px] w-full">
            <Routes />
          </div>
        </SnackbarProvider>
      </Provider>
    </div>
  )
}

export default App
