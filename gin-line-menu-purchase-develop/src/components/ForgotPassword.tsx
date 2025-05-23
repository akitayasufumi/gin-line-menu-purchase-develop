import { useAppDispatch } from "@/redux/hook"
import { SET_MESSAGE_ALERT } from "@/redux/reducers/app.slice"
import { handleError } from "@/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { COUNTRY_CODE, VALIDATION_PASSWORD_REGEX } from "../constants"
import ShowHidePassword from "./ShowHidePassword"

const ForgotPassword = ({
  setIsContentForgotPassword,
}: {
  setIsContentForgotPassword: any
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const dispatch = useAppDispatch()
  const ForgotPasswordSchema = Yup.object().shape({
    account: Yup.string().required("電話番号を入力してください。"),
    password: Yup.string()
      .trim()
      .matches(
        VALIDATION_PASSWORD_REGEX,
        "半角英数字、記号を含む 8 文字から 32 文字までのパスワードを入力してください。"
      )
      .required("パスワードを入力してください。"),
    code: Yup.string().required("確認コードが必要です。"),
  })

  const defaultValues = {
    account: "",
    password: "",
    code: "",
  }

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
    mode: "all",
  })

  const sendChangePassword = async () => {
    const formData = new FormData()
    formData.append("account", watch("account"))
    formData.append("password", watch("password"))
    formData.append("sms", watch("code"))
    formData.append("type", "0")

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + `forgot`,
        formData
      )
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmit = async () => {
    sendChangePassword()
      .then(rs => {
        const { code } = rs
        if (code !== 1) {
          dispatch(SET_MESSAGE_ALERT("パスワード変更失敗 !"))
        } else {
          setIsContentForgotPassword(false)
          dispatch(SET_MESSAGE_ALERT("パスワードが正常に変更されました"))
        }
      })
      .catch(() => {
        dispatch(SET_MESSAGE_ALERT("パスワード変更失敗 !"))
      })
  }

  const sendConfirmCode = () => {
    getSMSCodeByMessage(COUNTRY_CODE)
      .then(rs => {
        const { code } = rs
        if (code !== 1) {
          dispatch(SET_MESSAGE_ALERT("認証コードの送信に失敗しました"))
        } else {
          dispatch(SET_MESSAGE_ALERT("認証コードを確認してください"))
        }
      })
      .catch(() => {
        dispatch(SET_MESSAGE_ALERT("認証コードの送信に失敗しました"))
      })
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const getSMSCodeByMessage = async (area_code: string) => {
    try {
      const formData = new FormData()
      formData.append("account", watch("account"))
      formData.append("area_code", area_code)
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + `sms`,
        formData
      )
      if (response?.data?.code !== 1) {
        dispatch(SET_MESSAGE_ALERT(response?.data?.msg))
      } else {
        dispatch(SET_MESSAGE_ALERT("認証コードを確認してください"))
      }
      return response.data
    } catch (error) {
      const { content } = handleError(error)
      dispatch(SET_MESSAGE_ALERT(content))
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex text-center border-b-2 bg-white mt-2 mb-4">
        <h1 className="text-xl font-bold mb-2 mx-auto">パスワードを再設定</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <div className="relative w-full">
                <input
                  type="number"
                  {...register("account")}
                  placeholder="携帯電話番号"
                  className={`w-full px-4 py-2 pl-4 border rounded-lg focus:outline-none focus:#ccc ${
                    errors.account ? "border-red-500" : "focus:#ccc"
                  }`}
                />
              </div>
              {errors.account && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.account.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative w-full">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  {...register("password")}
                  placeholder="新しいパスワード"
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:#ccc ${
                    errors.password ? "border-red-500" : "focus:#ccc"
                  }`}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <ShowHidePassword
                    toggleVisibility={togglePasswordVisibility}
                    isPasswordVisible={isPasswordVisible}
                  />
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <div className="w-full">
                <input
                  type="number"
                  onInput={e => {
                    const target = e.target as HTMLInputElement
                    if (target.value.length > 4) {
                      target.value = target.value.slice(0, 4)
                    }
                  }}
                  {...register("code")}
                  placeholder="確認コード"
                  className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:#ccc ${
                    errors.code ? "border-red-500" : "focus:#ccc"
                  }`}
                />
              </div>
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>
            <div className="text-center" onClick={sendConfirmCode}>
              <p className="cursor-pointer text-[#862d29] underline">
                確認コードを入手する
              </p>
            </div>
          </div>

          <div className="text-center mt-4 mb-2">
            <button
              type="submit"
              className="w-full max-w-[300px] px-4 py-2 text-white bg-[#862d29] rounded-lg shadow-md hover:bg-[#862d29] focus:outline-none"
            >
              確定
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default React.memo(ForgotPassword)
