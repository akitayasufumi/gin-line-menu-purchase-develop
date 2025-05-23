import { SET_MESSAGE_ALERT } from "@/redux/reducers/app.slice"
import { Close } from "@mui/icons-material"
import { Card, Modal } from "@mui/material"
import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/hook"
import { AUTH_GET_INFO } from "../../redux/reducers/users/auth.slice"
import PageLoading from "./PageLoading"

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()
  const { isLoading, messageAlert } = useAppSelector(state => state.app)
  const { loading } = useAppSelector(state => state.auth)
  const modalAlert = () => {
    return (
      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
        }}
        className="modal-wrapper"
        open={!!messageAlert}
        onClose={() => dispatch(SET_MESSAGE_ALERT(""))}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className="flex items-center justify-center flex-col p-6 pt-[32px] w-[90%] max-w-[500px] relative outline-none focus:outline-none">
          <div
            className="absolute right-[10px] top-[10px]"
            onClick={() => dispatch(SET_MESSAGE_ALERT(""))}
          >
            <Close />
          </div>
          <span>{messageAlert}</span>
          <div className="flex justify-end w-full mt-[32px] text-sm">
            <button
              className={`w-[120px] py-2 bg-[#04BFBF00]`}
              onClick={() => dispatch(SET_MESSAGE_ALERT(""))}
            >
              OK
            </button>
          </div>
        </Card>
      </Modal>
    )
  }

  useEffect(() => {
    dispatch(AUTH_GET_INFO())
  }, [pathname])

  return (
    <>
      <PageLoading show={isLoading || loading} />
      {children}
      {modalAlert()}
    </>
  )
}

export default React.memo(PrivateRoute)
