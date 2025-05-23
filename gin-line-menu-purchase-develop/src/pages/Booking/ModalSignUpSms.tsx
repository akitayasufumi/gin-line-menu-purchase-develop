import { COUNTRY_CODE } from "@/constants"
import { useAppDispatch } from "@/redux/hook"
import { SET_LOADING, SET_MESSAGE_ALERT } from "@/redux/reducers/app.slice"
import { convertFullWidthToHalfWidth, encodePhone, handleError } from "@/utils"
import { Close } from "@mui/icons-material"
import { Card, Modal } from "@mui/material"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"

const ModalSignUpSms = ({
  openModalSMSConfirm,
  setOpenModalSMSConfirm,
  data,
  addLineCardStripeCard,
}: {
  openModalSMSConfirm: boolean
  setOpenModalSMSConfirm: any
  data: {
    phoneNumber: string
    firstName: string
    lastName: string
    email: string
    password: string
    gender: number
  }
  addLineCardStripeCard: (data: any) => void
}) => {
  const [sms, setSms] = useState("")
  const dispatch = useAppDispatch()
  const firstShow = useRef(false)

  useEffect(() => {
    if (!openModalSMSConfirm) setSms("")
  }, [openModalSMSConfirm])

  const getSMSCodeByVoice = async (phone: string) => {
    try {
      const formData = new FormData()
      formData.append("account", phone)
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + `voiceCode`,
        formData
      )
      const data = response.data
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const signUp = async () => {
    const newSms = convertFullWidthToHalfWidth(sms)
    dispatch(SET_LOADING(true))
    const formData = new FormData()
    formData.append("account", data.phoneNumber)
    formData.append("password", data.password)
    formData.append("sms", newSms)
    formData.append("mail_address", data.email)
    formData.append("post_code", COUNTRY_CODE)
    formData.append("sex", String(data.gender))
    formData.append("nickname", `${data.firstName}${data.lastName}`)
    try {
      const res = await axios.post(
        process.env.REACT_APP_BASE_URL + `register_v2`,
        formData
      )
      if (res?.data?.code !== 1) {
        dispatch(SET_LOADING(false))
        dispatch(SET_MESSAGE_ALERT(res?.data?.msg))
      } else {
        setOpenModalSMSConfirm(false)
        addLineCardStripeCard(data)
      }
    } catch (e) {
      const error = handleError(e)
      dispatch(SET_LOADING(false))
      dispatch(SET_MESSAGE_ALERT(error.content))
    }
  }

  return (
    <Modal
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      className="modal-wrapper"
      open={openModalSMSConfirm}
      onClose={() => setOpenModalSMSConfirm(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card className="flex items-center justify-center flex-col gap-5 p-3 w-[90%] max-w-[500px]">
        <div
          className="flex justify-end w-full cursor-pointer"
          onClick={() => setOpenModalSMSConfirm(false)}
        >
          <Close />
        </div>
        <b>確認コードを入力</b>

        <div className="flex flex-col items-center">
          <p>{encodePhone(data.phoneNumber || "")}宛にSMSを送信しました。</p>
          <p>メッセージに記載された４桁の数字を入力してください。</p>
        </div>

        <div className="w-full">
          <div className="w-full flex justify-between items-center">
            <input
              type="text"
              maxLength={4}
              placeholder="確認コード"
              className={`w-[calc(100%-110px)] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                sms.length < 4 && sms.length > 0
                  ? "border-red-500"
                  : "focus:ring-teal-500"
              }`}
              onChange={event => {
                const regex = /^[0-9０-９]+$/
                const value = event.target.value
                if (
                  (value && !regex.test(value)) ||
                  event.target.value.length > 4
                ) {
                  event.preventDefault()
                  return
                }
                firstShow.current = true
                setSms(event.target.value)
              }}
              value={sms}
            />
            <button
              disabled={sms.length < 4}
              onClick={signUp}
              type="button"
              className="w-[100px] px-4 py-2 text-white bg-teal-500 rounded-lg shadow-md hover:bg-teal-600 focus:outline-none"
            >
              送信
            </button>
          </div>
          {sms.length < 4 && firstShow.current && (
            <p className="text-red-500 text-sm mt-1">
              確認コードは4桁である必要があります。
            </p>
          )}
        </div>
        <u
          className="cursor-pointer mt-2"
          onClick={() => getSMSCodeByVoice(data.phoneNumber)}
        >
          確認コードを再送する
        </u>
      </Card>
    </Modal>
  )
}
export default React.memo(ModalSignUpSms)
