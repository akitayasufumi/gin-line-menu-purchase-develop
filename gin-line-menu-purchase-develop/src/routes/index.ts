import { useRoutes } from "react-router-dom"
import PrivateRouter from "./private"
// routes

// ==============================|| ROUTING RENDER ||============================== //
export default function Routes() {
  return useRoutes(PrivateRouter)
}
