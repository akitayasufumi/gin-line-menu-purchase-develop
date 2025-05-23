import { useAppSelector } from "@/redux/hook"
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js"
import React, { useMemo, useRef, useState } from "react"
import EyeIcon from "../../components/ShowHidePassword"

function StripeCard({ register, errors }: { register: any; errors: any }) {
  const { currentUser } = useAppSelector(state => state.auth)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const useOptions = () => {
    const options = useMemo(
      () => ({
        style: {
          base: {
            fontSize: "16px",
            color: "#424770",
            letterSpacing: "0.025em",
            "::placeholder": {
              color: "#a5abb6",
            },
          },
        },
      }),
      []
    )

    return options
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const tokenRef = useRef(null)
  const options = useOptions()

  return (
    <div>
      <p className="my-4 text-[#0eadaf] font-medium">
        クレジットカード情報の入力
      </p>
      <div className="flex mb-5 w-full">
        <div className="mr-1 w-full py-1 px-2 border rounded-lg focus:outline-none focus:ring-2">
          <span>姓</span>
          <input
            type="text"
            name="firstName"
            placeholder="姓"
            className="w-full focus:outline-none focus:ring-2"
          />
        </div>
        <div className="ml-1 py-1 px-2 w-full border rounded-lg focus:outline-none focus:ring-2">
          <span>名</span>
          <input
            type="text"
            name="lastName"
            placeholder="名"
            className="w-full focus:outline-none focus:ring-2"
          />
        </div>
      </div>

      <div className="pt-1 pb-2 px-2 w-full border rounded-lg focus:outline-none focus:ring-2 mb-5">
        <span>カード番号</span>
        <CardNumberElement className="cardNumber" options={options} />
      </div>
      <div className="flex mb-5 w-full">
        <div className="mr-1 pt-1 pb-2 px-2 w-full border rounded-lg focus:outline-none focus:ring-2">
          <span>有効期限</span>
          <CardExpiryElement className="cardNumber" options={options} />
        </div>

        <div className="ml-1 pt-1 pb-2 px-2 w-full border rounded-lg focus:outline-none focus:ring-2">
          <span>セキュリティコード</span>
          <CardCvcElement className="cardNumber" options={options} />
        </div>
      </div>
      {!currentUser.id && (
        <div>
          <div className="pt-1 pb-2 px-2 w-full border rounded-lg focus:outline-none focus:ring-2 relative">
            <span>支払いパスワード</span>
            <input
              autoComplete="new-password"
              type={isPasswordVisible ? "text" : "password"}
              {...register("payPassword")}
              maxLength={6}
              placeholder="支払いパスワード"
              className="w-[calc(100%-45px)] rounded-lg focus:outline-none focus:ring-2 outline-none"
            />
            <div className="absolute inset-y-0 right-2 flex items-center">
              <EyeIcon
                toggleVisibility={togglePasswordVisibility}
                isPasswordVisible={isPasswordVisible}
              />
            </div>
          </div>
          {errors.payPassword && (
            <p className="text-red-500 text-sm mt-1 break-words">
              {errors.payPassword.message}
            </p>
          )}
        </div>
      )}
      <input id="tkn" name="tkn" type="hidden" ref={tokenRef} value="" />
    </div>
  )
}

function PaymentForm({ register, errors }: { register: any; errors: any }) {
  return (
    <div className="w-full">
      <StripeCard register={register} errors={errors} />
    </div>
  )
}
export default React.memo(PaymentForm)
