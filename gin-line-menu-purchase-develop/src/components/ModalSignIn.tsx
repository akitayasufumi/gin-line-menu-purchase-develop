import Logo from "@/assets/icons/logo.svg"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  ArrowBack,
  Check,
  CheckBoxOutlineBlank,
  Close,
} from "@mui/icons-material"
import { Card, Checkbox, Modal } from "@mui/material"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import ForgotPassword from "./ForgotPassword"
import ShowHidePassword from "./ShowHidePassword"
import { apiUserSignIn } from "@/api/auth"
import { setUserToken } from "@/utils"
import { apiGetMe } from "@/api/me"
import { AUTH_SET_CURRENT_USER } from "@/redux/reducers/users/auth.slice"
import { SET_LOADING } from "@/redux/reducers/app.slice"
import { useAppDispatch } from "@/redux/hook"

const ModalSignIn = ({
  openModalSignIn,
  setOpenModalSignIn,
}: {
  openModalSignIn: boolean
  setOpenModalSignIn: (value: boolean) => void
}) => {
  const [isContentForgotPassword, setIsContentForgotPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const dispatch = useAppDispatch()

  const SignInSchema = Yup.object().shape({
    phoneNumber: Yup.string().required("電話番号を入力してください。"),
    password: Yup.string().required("パスワードを入力してください。"),
  })

  const defaultValues = {
    phoneNumber: "",
    password: "",
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignInSchema),
    defaultValues,
    mode: "all",
  })

  const handleInputChange = () => {
    if (apiError) {
      setApiError(null)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      setApiError(null)
      dispatch(SET_LOADING(true))

      const response = await apiUserSignIn({
        account: data.phoneNumber,
        password: data.password,
      })

      if (response.data.success === false) {
        setApiError(response.data.message)
      } else {
        const { bearerToken, token } = response.data
        setUserToken(bearerToken, token)
        const userResponse = await apiGetMe()
        dispatch(AUTH_SET_CURRENT_USER(userResponse.data))
        setOpenModalSignIn(false)
      }
    } catch (err) {
      setApiError("ユーザーが見つかりません")
    } finally {
      dispatch(SET_LOADING(false))
    }
  }

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <Modal
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      className="modal-wrapper"
      open={openModalSignIn}
      onClose={() => {
        setOpenModalSignIn(false)
        setIsContentForgotPassword(false)
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card className="flex items-center justify-center flex-col p-3 gap-5 outline-none w-[90%] max-w-[500px]">
        {!!isContentForgotPassword ? (
          <div className="w-full flex justify-between">
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsContentForgotPassword(false)
              }}
            >
              <ArrowBack />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                setOpenModalSignIn(false)
                setIsContentForgotPassword(false)
              }}
            >
              <Close />
            </div>
          </div>
        ) : (
          <div
            className="flex justify-end w-full cursor-pointer"
            onClick={() => setOpenModalSignIn(false)}
          >
            <Close />
          </div>
        )}
        {!isContentForgotPassword && (
          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white rounded-lg p-6">
                <div className="flex justify-center mb-8">
                  <img src={Logo} alt="Logo" />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="relative w-full">
                      <input
                        type="text"
                        {...register("phoneNumber")}
                        onChange={handleInputChange}
                        placeholder="電話番号"
                        className={`w-full px-4 py-2 pl-4 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.phoneNumber
                            ? "border-red-500"
                            : "focus:ring-teal-500"
                        }`}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative w-full">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        {...register("password")}
                        onChange={handleInputChange}
                        placeholder="パスワード"
                        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.password
                            ? "border-red-500"
                            : "focus:ring-teal-500"
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
                    {apiError && (
                      <p className="text-red-500 text-sm mt-2">{apiError}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <Checkbox
                      id="rememberMe"
                      icon={
                        <CheckBoxOutlineBlank
                          sx={{
                            fontSize: 20,
                            backgroundColor: "white",
                            borderRadius: 1,
                            color: "white",
                            border: 2,
                            borderColor: "#0eadaf",
                          }}
                        />
                      }
                      checkedIcon={
                        <Check
                          sx={{
                            fontSize: 20,
                            backgroundColor: "white",
                            borderRadius: 1,
                            color: "#0eadaf",
                            border: 2,
                            borderColor: "#0eadaf",
                          }}
                        />
                      }
                      className="w-4 h-4 focus:ring-[#0eadaf] border-[#0eadaf] rounded checked:bg-transparent"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 text-sm text-gray-600"
                    >
                      保存する
                    </label>
                  </div>
                </div>

                <div className="mt-6 space-y-3 flex flex-col items-center">
                  <button
                    type="submit"
                    className="w-full max-w-[250px] px-4 py-2 text-white bg-[#0eadaf] rounded-lg shadow-md hover:bg-[#0d9b9c] focus:outline-none"
                  >
                    ログイン
                  </button>
                </div>

                <div
                  className="mt-4 text-center text-sm text-gray-500 cursor-pointer"
                  onClick={() => setIsContentForgotPassword(true)}
                >
                  <p className="underline">
                    ログインパスワードを忘れた方はこちら
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}
        {!!isContentForgotPassword && (
          <ForgotPassword
            setIsContentForgotPassword={setIsContentForgotPassword}
          />
        )}
      </Card>
    </Modal>
  )
}

export default React.memo(ModalSignIn)
