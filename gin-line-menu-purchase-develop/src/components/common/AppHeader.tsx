import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { useState } from "react"
import ModalSignIn from "../ModalSignIn"
import { AUTH_LOGOUT } from "@/redux/reducers/users/auth.slice"

interface PageLoadingProps {
  title?: string
}

function AppHeader({ title }: PageLoadingProps) {
  const { currentUser } = useAppSelector(state => state.auth)
  const [openModalSignIn, setOpenModalSignIn] = useState(false)
  const dispatch = useAppDispatch()
  const handleOpenDialog = () => setOpenModalSignIn(true)
  return (
    <div className="fixed w-full left-0 border-b-2 bg-white z-[10]">
      <div className="relative text-center font-[600] py-3">
        {title}
        {!currentUser.id ? (
          <div
            className="absolute text-[#0eadaf] right-5 cursor-pointer top-[14px]"
            onClick={handleOpenDialog}
          >
            ログイン
          </div>
        ) : (
          <div
            className="absolute text-[#0eadaf] right-5 cursor-pointer top-[14px]"
            onClick={() => dispatch(AUTH_LOGOUT())}
          >
            ログアウト
          </div>
        )}
      </div>
      {openModalSignIn && (
        <ModalSignIn
          openModalSignIn={openModalSignIn}
          setOpenModalSignIn={setOpenModalSignIn}
        />
      )}
    </div>
  )
}

export default AppHeader
