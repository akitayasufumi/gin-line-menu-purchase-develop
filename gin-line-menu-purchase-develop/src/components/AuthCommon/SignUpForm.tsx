import { GENDER, LANGS } from "@/constants"
import { useState } from "react"
import EyeIcon from "../../components/ShowHidePassword"

type PropsComponent = {
  register: any
  errors: any
  userGender?: number
}

export default function SignUpForm({
  register,
  errors,
  userGender,
}: PropsComponent) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <input
              type="text"
              {...register("firstName")}
              placeholder="姓"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.firstName ? "border-red-500" : "focus:ring-teal-500"
                }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="w-1/2">
            <input
              type="text"
              {...register("lastName")}
              placeholder="名"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.lastName ? "border-red-500" : "focus:ring-teal-500"
                }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div>
        <input
          type="email"
          {...register("email")}
          placeholder="メールアドレス"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500" : "focus:ring-teal-500"
            }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <div className="flex items-center w-full border rounded-lg focus-within:ring-2 focus-within:ring-teal-500">
          <div className="flex items-center pl-4">
            <img src={LANGS[0].icon} alt={LANGS[0].label} className="w-6 h-6" />
            {/* <span className="ml-2 text-gray-600">{`+${COUNTRY_CODE}`}</span> */}
          </div>
          <input
            type="text"
            {...register("phoneNumber")}
            placeholder="電話番号"
            className={`flex-1 px-4 mr-2 py-2 focus:outline-none ${errors.phoneNumber ? "border-red-500" : ""
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
            placeholder="パスワード"
            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500" : "focus:ring-teal-500"
              }`}
          />
          <div className="absolute inset-y-0 right-2 flex items-center">
            <EyeIcon
              toggleVisibility={togglePasswordVisibility}
              isPasswordVisible={isPasswordVisible}
            />
          </div>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1 break-words">
            {errors.password.message}
          </p>
        )}
      </div>
      <div>
        <span className="block text-sm font-medium text-gray-600 mb-2">
          性別（本施設は女性専用です）
        </span>
        <div className="flex items-center space-x-4">
          {/* <label className="flex items-center">
            <input
              type="radio"
              value={GENDER.MALE}
              defaultChecked={userGender === GENDER.MALE}
              {...register("gender")}
              className="w-4 h-4 text-teal-500 focus:ring-teal-500"
            />
            <span className="ml-2 text-gray-600">男性</span>
          </label> */}
          <label className="flex items-center">
            <input
              type="radio"
              value={GENDER.FEMALE}
              defaultChecked={userGender === GENDER.FEMALE}
              {...register("gender")}
              className="w-4 h-4 text-teal-500 focus:ring-teal-500"
            />
            <span className="ml-2 text-gray-600">女性</span>
          </label>
        </div>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>
    </div>
  )
}
