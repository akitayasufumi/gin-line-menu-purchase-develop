import { useAppDispatch } from "@/redux/hook"
import { SET_LOADING } from "@/redux/reducers/app.slice"
import { AUTH_LOADING } from "@/redux/reducers/users/auth.slice"
import React, { useEffect } from "react"

function PageNotFound() {
  const dispatch = useAppDispatch()
  const resetLoading = () => {
    dispatch(SET_LOADING(false))
    dispatch(AUTH_LOADING(false))
  }
  useEffect(() => {
    resetLoading()
    setTimeout(() => {
      resetLoading()
    }, 100)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center h-screen text-gray-800">
      <label className="text-6xl mb-4">404</label>
      <label className="text-xl">ページが見つかりません</label>
    </div>
  )
}

export default React.memo(PageNotFound)
