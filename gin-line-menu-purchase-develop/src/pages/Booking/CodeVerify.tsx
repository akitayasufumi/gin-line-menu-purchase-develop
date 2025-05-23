import { checkPayPassword, editPayPassword } from "@/api/menu"
import { PAY_PASSWORD_LENGTH } from "@/constants"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { SET_LOADING, SET_MESSAGE_ALERT } from "@/redux/reducers/app.slice"
import { PaymentMethodState } from "@/types/interfaces"
import { convertFullWidthToHalfWidth, getUserToken, handleError } from "@/utils"
import { Close } from "@mui/icons-material"
import { Card, Modal } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"

function CodeVerify({
  card,
  onNewPayment,
  openCodeVerify,
  setOpenCodeVerify,
}: {
  card: PaymentMethodState | null
  onNewPayment: (paymentMethodId: string) => void
  openCodeVerify: boolean
  setOpenCodeVerify: any
}) {
  const [code, setCode] = useState("")
  const { currentUser } = useAppSelector(state => state.auth)
  const [prevCode, setPrevCode] = useState("")
  const [isConfirmPass, setIsConfirmPass] = useState(false)
  const firstShow = useRef(false)
  const dispatch = useAppDispatch()

  const checkPassword = async (newCode: string) => {
    dispatch(SET_LOADING(true))
    try {
      const tokenInfo = getUserToken()
      const res = await checkPayPassword(tokenInfo.token, newCode)
      if (res?.code === 1) {
        await onNewPayment(card?.defaultPaymentMethodId || "")
      } else {
        dispatch(SET_MESSAGE_ALERT(res.msg))
      }
    } catch (e) {
      const error = handleError(e)
      dispatch(SET_MESSAGE_ALERT(error.content))
    }
    dispatch(SET_LOADING(false))
  }

  useEffect(() => {
    if (!openCodeVerify) setCode("")
  }, [openCodeVerify])

  const setPassword = async () => {
    dispatch(SET_LOADING(true))
    try {
      const tokenInfo = getUserToken()
      const res = await editPayPassword(tokenInfo.token, code)
      if (res?.code === 1) {
        await onNewPayment(card?.defaultPaymentMethodId || "")
      } else {
        dispatch(SET_MESSAGE_ALERT(res.msg))
      }
    } catch (e) {
      const error = handleError(e)
      dispatch(SET_MESSAGE_ALERT(error.content))
    }
    dispatch(SET_LOADING(false))
  }

  return (
    <Modal
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      className="modal-wrapper"
      open={openCodeVerify}
      onClose={() => setOpenCodeVerify(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card className="flex items-center justify-center flex-col p-3 gap-5 w-[90%] max-w-[500px]">
        <div
          className="flex justify-end w-full cursor-pointer"
          onClick={() => setOpenCodeVerify(false)}
        >
          <Close />
        </div>
        <div className="w-full">
          <div className="text-center text-[20px]">
            {currentUser.pay_password1
              ? "パスワード"
              : isConfirmPass
              ? "新規登録お支払いパスワード確認"
              : "お支払いパスワードの新規登録"}
          </div>
          <div className="text-center my-5" style={{ whiteSpace: "pre-line" }}>
            {currentUser.pay_password1
              ? "お支払いパスワードを入力してください"
              : isConfirmPass
              ? "登録するお支払いパスワードを入力してください"
              : "登録するお支払いパスワードを\nもう一度入力してください"}
          </div>
          <div className="w-full flex justify-between items-center">
            <input
              type="text"
              maxLength={PAY_PASSWORD_LENGTH}
              placeholder="支払いパスワード"
              className={`w-[calc(100%-130px)] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                code.length < 6 && code.length > 0
                  ? "border-red-500"
                  : "focus:ring-teal-500"
              }`}
              onChange={event => {
                const regex = /^[0-9０-９]+$/
                const value = event.target.value
                if (
                  (value && !regex.test(value)) ||
                  event.target.value.length > 6
                ) {
                  event.preventDefault()
                  return
                }
                firstShow.current = true
                setCode(event.target.value)
              }}
              value={code}
            />
            <button
              disabled={code.length < 6}
              onClick={() => {
                const finalCode = convertFullWidthToHalfWidth(code)
                if (isConfirmPass) {
                  if (prevCode !== finalCode)
                    dispatch(SET_MESSAGE_ALERT("パスワードが違います"))
                  else {
                    setPassword()
                  }
                } else if (currentUser.pay_password1) {
                  checkPassword(finalCode)
                } else {
                  setPrevCode(finalCode)
                  setIsConfirmPass(true)
                }
                setCode("")
              }}
              type="button"
              className="w-[120px] px-4 py-2 text-white bg-teal-500 rounded-lg shadow-md hover:bg-teal-600 focus:outline-none"
            >
              検証する
            </button>
          </div>
          {code.length < 6 && firstShow.current && (
            <p className="text-red-500 text-sm mt-1">
              支払いパスワードは6桁である必要があります。
            </p>
          )}
          <div
            className="text-center my-5 text-[red]"
            style={{ whiteSpace: "pre-line" }}
          >
            {
              "※お支払いパスワードはアプリを使って\nお支払いする時に使用します。"
            }
          </div>
        </div>
      </Card>
    </Modal>
  )
}
export default React.memo(CodeVerify)
