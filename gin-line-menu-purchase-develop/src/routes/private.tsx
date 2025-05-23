import Booking from "@/pages/Booking"
import PageNotFound from "@/pages/PageNotFound"
import { RouteObject } from "react-router-dom"
import PrivateRoute from "../components/common/PrivateRoute"

const PrivateRouter: Array<RouteObject> = [
  {
    path: "menus/:id",
    index: true,
    element: (
      <PrivateRoute>
        <Booking />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]

export default PrivateRouter
