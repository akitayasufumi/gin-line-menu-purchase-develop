// import SignUpForm from "@/components/AuthCommon/SignUpForm"
// import AppHeader from "@/components/common/AppHeader"
// import {
//   COUNTRY_CODE,
//   EMAIL_REGEX,
//   GENDER,
//   NUMBER_REGEX,
//   VALIDATION_PASSWORD_REGEX,
//   VAT_VALUE,
// } from "@/constants"
// import { useAppDispatch, useAppSelector } from "@/redux/hook"
// import { SET_LOADING, SET_MESSAGE_ALERT } from "@/redux/reducers/app.slice"
// import { PaymentMethodState } from "@/types/interfaces"
// import { getAuthImage, numericPrice } from "@/utils"
// import { yupResolver } from "@hookform/resolvers/yup"
// import {
//   CardNumberElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js"
// import axios from "axios"
// import React, { useCallback, useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import * as Yup from "yup"
// import ModalSignUpSms from "./ModalSignUpSms"
// import PaymentForm from "./PaymentForm"
// import UploadFaceImage from "./UploadFaceImage"
// import { Box, Checkbox } from "@mui/material"
// import { Check, CheckBoxOutlineBlank } from "@mui/icons-material"

// function BookingInfo({
//   data,
//   setOpenConfirm,
//   setPayMethodId,
//   card,
//   addLineCardStripeCard,
//   faceImages,
//   setFaceImages,
// }: {
//   data: any
//   setOpenConfirm: (open: boolean) => void
//   setPayMethodId: (paymentMethodId: string) => void
//   card: PaymentMethodState | null
//   addLineCardStripeCard: (data: any) => void
//   faceImages: Array<{ url: string; base: string }>
//   setFaceImages: any
// }) {
//   const [checked, setChecked] = useState(false)
//   const stripe = useStripe()
//   const elements = useElements()
//   const dispatch = useAppDispatch()
//   const { currentUser } = useAppSelector(state => state.auth)
//   const [openModalSMSConfirm, setOpenModalSMSConfirm] = useState(false)
//   const [signUpData, setSignUpData] = useState<any>({})

//   const RegisterSchema = Yup.object().shape({
//     firstName: Yup.string().when("user", (user, schema) =>
//       !user?.[0] ? schema.required("姓を入力してください。") : schema
//     ),
//     lastName: Yup.string().when("user", (user, schema) =>
//       !user?.[0] ? schema.required("名を入力してください。") : schema
//     ),
//     email: Yup.string()
//       .trim()
//       .when("user", (user, schema) =>
//         !user?.[0]
//           ? schema
//             .required("メールアドレスを入力してください。")
//             .matches(
//               EMAIL_REGEX,
//               "メールアドレスは有効なメールアドレスである必要があります。"
//             )
//           : schema
//       ),
//     gender: Yup.number().when("user", (user, schema) =>
//       !user?.[0] ? schema.required("性別を入力してください。") : schema
//     ),
//     password: Yup.string()
//       .trim()
//       .when("user", (user, schema) =>
//         !user?.[0]
//           ? schema
//             .matches(
//               VALIDATION_PASSWORD_REGEX,
//               "半角英数字、記号を含む 8 文字から 32 文字までのパスワードを入力してください。"
//             )
//             .required("パスワードを入力してください。")
//           : schema
//       ),
//     phoneNumber: Yup.string()
//       .trim()
//       .when("user", (user, schema) =>
//         !user?.[0]
//           ? schema
//             .required("電話番号を入力してください。")
//             .matches(
//               NUMBER_REGEX,
//               "電話番号は有効な番号である必要があります。"
//             )
//           : schema
//       ),
//     payPassword: Yup.string()
//       .trim()
//       .when("user", (user, schema) =>
//         !user?.[0]
//           ? schema
//             .required("パスワードを入力してください。")
//             .min(6, "支払いパスワードは6桁である必要があります。")
//           : schema
//       ),
//   })

//   const defaultValues = {
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     phoneNumber: "",
//     gender: GENDER.FEMALE,
//     user: currentUser?.id,
//   }

//   const {
//     handleSubmit,
//     register,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<any>({
//     resolver: yupResolver(RegisterSchema),
//     defaultValues,
//     mode: "all",
//   })

//   const userGender = watch("gender")

//   const getSMSCodeByMessage = async (phone: string, area_code: string) => {
//     try {
//       const formData = new FormData()
//       formData.append("account", phone)
//       formData.append("area_code", area_code)
//       const response = await axios.post(
//         process.env.REACT_APP_BASE_URL + `sms`,
//         formData
//       )
//       return response.data
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const getSMS = (phoneNumber: string) => {
//     dispatch(SET_LOADING(true))
//     getSMSCodeByMessage(phoneNumber, COUNTRY_CODE)
//       .then(rs => {
//         if (rs?.code !== 1) {
//           dispatch(SET_MESSAGE_ALERT("認証コードの送信に失敗しました"))
//         } else {
//           setOpenModalSMSConfirm(true)
//         }
//       })
//       .finally(() => {
//         dispatch(SET_LOADING(false))
//       })
//   }

//   const onSubmit = async (data: any) => {
//     if (card && card.defaultPaymentMethodId) {
//       return setOpenConfirm(true)
//     }
//     const cardElement = elements?.getElement(CardNumberElement)
//     if (!stripe || !elements || !cardElement) {
//       // Stripe.js has not loaded yet. Make sure to disable
//       // form submission until Stripe.js has loaded.
//       return
//     }
//     dispatch(SET_LOADING(true))

//     const payload = await stripe
//       .createPaymentMethod({
//         type: "card",
//         card: cardElement,
//       })
//       .catch((e: Error) => console.log(e))
//     if (payload?.error) {
//       dispatch(SET_MESSAGE_ALERT(payload?.error?.message || ""))
//     } else if (payload?.paymentMethod) {
//       setPayMethodId(payload?.paymentMethod.id)
//       if (currentUser.id) {
//         setOpenConfirm(true)
//       } else {
//         setSignUpData(data)
//         getSMS(data.phoneNumber)
//       }
//     }
//     dispatch(SET_LOADING(false))
//   }

//   const addLineCardStripeCardForm = async (data: any) => {
//     addLineCardStripeCard(data)
//   }

//   const authImages = useCallback(() => {
//     return getAuthImage(currentUser.auth_image)
//   }, [currentUser])

//   const listGuideline = useCallback(() => {
//     const guides = [
//       `${data?.is_trial
//         ?
//         `初月会費は無料です。2ヶ月目以降は月額${numericPrice(
//           Math.round(data.price * VAT_VALUE) 
//         )}円(税込)が自動引き落としとなります。`
//         : `毎月、月額${numericPrice(
//           data.price
//         )}円（税抜）が自動で引き落としされます。`
//       }退会ご希望の際は、専用アプリからお手続きいただけます。`,
//       `月会費とは別に、1回ごとの設備利用料${numericPrice(
//         Math.round(data.reservation_fee  * VAT_VALUE)
//       )}円(税込)が発生します。初回ご利用時は無料です。2回目以降の利用時から、顔認証による入室時に自動決済されます。`,
//       `1回のご利用は、レッスン前後の準備時間・入退室を含め、${data.treatment_time}分間スロットとなります。${data.treatment_time}分を超過した場合、${data.extend_reservation_time}分ごとに${numericPrice(
//         data.extend_reservation_fee * VAT_VALUE
//       )}円の延長料金が発生します。`,
//       `本利用登録の手続きをもって、ご登録期間中は全ての「${data?.shop?.nickname ?? ''}」店舗がご利用いただけます。`,
//       "来店に際し、予約は不要です。アップロードいただいた顔写真により、現地顔認証システムでご入室いただけます。顔認証がうまくいかない場合は、専用アプリから再登録をお願いします。",
//       "怪我やトラブルについては自己責任でお願いいたします。当施設では責任を負いかねますのでご了承ください。 \n\nその他、料金や詳しい利用手順等については、公式サイトをご確認ください。また、個別のお問い合わせは、公式LINEより承っております。",
//     ]
//     return guides
//   }, [data])

//   useEffect(() => {
//     setValue("user", currentUser.id)
//   }, [currentUser])

//   return (
//     <div className="w-full">
//       <AppHeader title="ご利用登録" />
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="flex flex-col items-center"
//         noValidate
//       >
//         <div className="w-full pt-[65px]">
//           {!!currentUser.id && (
//             <h2 className="font-bold text-lg">
//               ようこそ {currentUser?.nickname}さん
//             </h2>
//           )}
//           <input name="user" value={currentUser.id} className="hidden"></input>
//           <h2 className="font-bold text-lg mt-3">{`24時間女性専用ピラティスジム「${data?.shop?.nickname ?? ''}」`}</h2>

//           <div className="border-b-[1px] my-3"></div>
//           <div className="mb-4">
//             <h3 className="text-base text-[#0eadaf] font-medium mb-2">
//               選択済みメニュー
//             </h3>
//             {/* <p className={`text-sm ${data.title_color}`}>
//               {data?.title_header}
//             </p> */}

//             {/* <p className="text-sm">{data.title}</p> */}
//             {/* <p className="text-sm font-bold">
//               {numericPrice(Math.round(data.price * VAT_VALUE))}
//               {" 円 （税込）"}
//             </p> */}
//             <Box sx={{ width: 'max-content' }}>
//               <p className="text-sm">
//                 【初月無料キャンペーン適用】
//               </p>
//               <p className="text-sm font-bold text-center">
//                 月会費{numericPrice(Math.round(data.price * VAT_VALUE))}円(税込)
//               </p>
//             </Box>
//           </div>

//           {/* <div className="mb-4">
//             <h3 className="text-base text-[#0eadaf] font-medium mb-2">
//               指名スタッフ
//             </h3>
//             <p className="text-sm">指名なし</p>
//           </div>*/}
//           <div className="border-b-[1px] my-3"></div>

//           <h3 className="text-base text-[#0eadaf] font-medium mb-2">
//             支払金額
//           </h3>
//           <div className="flex justify-between text-sm">
//             <p>小計</p>
//             <p>￥{numericPrice(Math.round(data.price))}</p>
//           </div>
//           <div className="flex justify-between text-sm mt-3">
//             <p>消費税</p>
//             <p>￥{numericPrice(Math.round(data.price * (VAT_VALUE - 1)))}</p>
//           </div>
//           <div className="flex justify-between text-sm text-gray-500 mt-3">
//             <p>ご利用ポイント</p>
//             <p className="text-sm text-[red]">¥0</p>
//           </div>
//           <div className="border-b-[1px] my-3"></div>
//           <div className="flex justify-between font-bold mt-2">
//             <p>合計</p>
//             <p>¥{numericPrice(Math.round(data.price * VAT_VALUE))}</p>
//           </div>
//           {/* {!!data.is_trial && (
//             <div className="mt-5">
//               ▲このメニューは1か月間無料でお試しいただけます。
//             </div>
//           )} */}
//           {!!data?.purchase_notice && (
//             <div className="flex flex-col gap-3 mt-5 text-sm">
//               <span className="font-[600]">注意事項</span>
//               <span>{data.purchase_notice}</span>
//             </div>
//           )}
//           {!currentUser.id && (
//             <>
//               <div className="border-b-[1px] my-5"></div>
//               <p className="my-4 text-[#0eadaf] font-medium">登録する</p>
//               <SignUpForm
//                 register={register}
//                 errors={errors}
//                 userGender={userGender}
//               />
//             </>
//           )}
//           {!authImages().length && (
//             <>
//               <div className="border-b-[1px] my-5"></div>
//               <UploadFaceImage
//                 faceImages={faceImages}
//                 setFaceImages={setFaceImages}
//               ></UploadFaceImage>
//             </>
//           )}
//           <div className="mt-5">
//             <p className="text-[18px] font-bold"> ご利用時の注意事項</p>
//             {listGuideline().map((guide: string, index: number) => (
//               <p
//                 className="mt-2"
//                 style={{ whiteSpace: "pre-line" }}
//                 key={index}
//               >
//                 {index + 1}. {guide}
//               </p>
//             ))}
//           </div>
//           {!!card && !card.defaultPaymentMethodId && (
//             <>
//               <div className="border-b-[1px] my-5"></div>
//               <PaymentForm register={register} errors={errors} />
//             </>
//           )}

//           <div className="my-4 flex flex-col items-center">
//             <label className="flex items-center justify-center space-x-2">
//               <Checkbox
//                 id="rememberMe"
//                 icon={
//                   <CheckBoxOutlineBlank
//                     sx={{
//                       fontSize: 20,
//                       backgroundColor: "white",
//                       borderRadius: 1,
//                       color: "white",
//                       border: 2,
//                       borderColor: "#0eadaf",
//                     }}
//                   />
//                 }
//                 onChange={e => {
//                   setChecked(e.target.checked)
//                 }}
//                 checkedIcon={
//                   <Check
//                     sx={{
//                       fontSize: 20,
//                       backgroundColor: "white",
//                       borderRadius: 1,
//                       color: "#0eadaf",
//                       border: 2,
//                       borderColor: "#0eadaf",
//                     }}
//                   />
//                 }
//                 className="w-4 h-4 focus:ring-[#0eadaf] border-[#0eadaf] rounded checked:bg-transparent"
//               />
//               <span>同意する</span>
//             </label>

//             <button
//               className={`w-full max-w-[250px] py-2 rounded-full mb-2 mt-4 ${!checked
//                 ? "bg-[#F2F2F2] text-[#8F8E94]"
//                 : "bg-[#04BFBF] text-white"
//                 }`}
//               disabled={!checked}
//               type="submit"
//             >
//               お支払い確定
//             </button>
//           </div>
//         </div>
//       </form>
//       {openModalSMSConfirm && (
//         <ModalSignUpSms
//           openModalSMSConfirm={openModalSMSConfirm}
//           setOpenModalSMSConfirm={setOpenModalSMSConfirm}
//           data={signUpData}
//           addLineCardStripeCard={(data: any) => addLineCardStripeCardForm(data)}
//         />
//       )}
//     </div>
//   )
// }
// export default React.memo(BookingInfo)


import SignUpForm from "@/components/AuthCommon/SignUpForm"
import AppHeader from "@/components/common/AppHeader"
import {
  COUNTRY_CODE,
  EMAIL_REGEX,
  GENDER,
  NUMBER_REGEX,
  VALIDATION_PASSWORD_REGEX,
  VAT_VALUE,
} from "@/constants"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { SET_LOADING, SET_MESSAGE_ALERT } from "@/redux/reducers/app.slice"
import { PaymentMethodState } from "@/types/interfaces"
import { getAuthImage, numericPrice } from "@/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import axios from "axios"
import React, { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import ModalSignUpSms from "./ModalSignUpSms"
import PaymentForm from "./PaymentForm"
import UploadFaceImage from "./UploadFaceImage"
import { Box, Checkbox } from "@mui/material"
import { Check, CheckBoxOutlineBlank } from "@mui/icons-material"

// 预订信息组件 - 处理用户注册、支付和预订流程
function BookingInfo({
  data,                  // 从父组件传入的预订数据
  setOpenConfirm,        // 控制确认对话框的状态函数
  setPayMethodId,        // 设置支付方法ID的函数
  card,                  // 用户支付卡信息
  addLineCardStripeCard, // 添加Stripe支付卡的回调函数
  faceImages,            // 用户上传的面部图像
  setFaceImages,         // 设置面部图像的函数
}: {
  data: any
  setOpenConfirm: (open: boolean) => void
  setPayMethodId: (paymentMethodId: string) => void
  card: PaymentMethodState | null
  addLineCardStripeCard: (data: any) => void
  faceImages: Array<{ url: string; base: string }>
  setFaceImages: any
}) {
  // 状态管理
  const [checked, setChecked] = useState(false) // 用户是否同意条款
  const stripe = useStripe() // Stripe支付实例
  const elements = useElements() // Stripe支付元素
  const dispatch = useAppDispatch() // Redux dispatch函数
  const { currentUser } = useAppSelector(state => state.auth) // 当前用户信息
  const [openModalSMSConfirm, setOpenModalSMSConfirm] = useState(false) // 短信验证模态框状态
  const [signUpData, setSignUpData] = useState<any>({}) // 注册表单数据

  // 表单验证规则
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().when("user", (user, schema) =>
      !user?.[0] ? schema.required("姓を入力してください。") : schema // 姓氏必填
    ),
    lastName: Yup.string().when("user", (user, schema) =>
      !user?.[0] ? schema.required("名を入力してください。") : schema // 名字必填
    ),
    email: Yup.string()
      .trim()
      .when("user", (user, schema) =>
        !user?.[0]
          ? schema
            .required("メールアドレスを入力してください。") // 邮箱必填
            .matches(
              EMAIL_REGEX,
              "メールアドレスは有効なメールアドレスである必要があります。" // 邮箱格式验证
            )
          : schema
      ),
    gender: Yup.number().when("user", (user, schema) =>
      !user?.[0] ? schema.required("性別を入力してください。") : schema // 性别必填
    ),
    password: Yup.string()
      .trim()
      .when("user", (user, schema) =>
        !user?.[0]
          ? schema
            .matches(
              VALIDATION_PASSWORD_REGEX,
              "半角英数字、記号を含む 8 文字から 32 文字までのパスワードを入力してください。" // 密码复杂度验证
            )
            .required("パスワードを入力してください。") // 密码必填
          : schema
      ),
    phoneNumber: Yup.string()
      .trim()
      .when("user", (user, schema) =>
        !user?.[0]
          ? schema
            .required("電話番号を入力してください。") // 电话号码必填
            .matches(
              NUMBER_REGEX,
              "電話番号は有効な番号である必要があります。" // 电话号码格式验证
            )
          : schema
      ),
  })

  // 表单默认值
  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: GENDER.FEMALE,
    user: currentUser?.id,
  }

  // 使用React Hook Form管理表单
  const {
    handleSubmit, // 表单提交处理函数
    register,     // 注册表单字段
    watch,        // 监听字段变化
    setValue,     // 设置字段值
    formState: { errors }, // 表单错误状态
  } = useForm<any>({
    resolver: yupResolver(RegisterSchema), // 使用Yup验证
    defaultValues, // 默认值
    mode: "all",   // 验证模式
  })

  // 监听性别字段变化
  const userGender = watch("gender")

  // 获取短信验证码
  const getSMSCodeByMessage = async (phone: string, area_code: string) => {
    try {
      const formData = new FormData()
      formData.append("account", phone)
      formData.append("area_code", area_code)
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + `sms`,
        formData
      )
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  // 发送短信验证码
  const getSMS = (phoneNumber: string) => {
    dispatch(SET_LOADING(true)) // 显示加载状态
    getSMSCodeByMessage(phoneNumber, COUNTRY_CODE)
      .then(rs => {
        if (rs?.code !== 1) {
          dispatch(SET_MESSAGE_ALERT("認証コードの送信に失敗しました")) // 发送失败提示
        } else {
          setOpenModalSMSConfirm(true) // 打开短信验证模态框
        }
      })
      .finally(() => {
        dispatch(SET_LOADING(false)) // 隐藏加载状态
      })
  }

  // 表单提交处理
  const onSubmit = async (data: any) => {
    // 如果已有支付方式，直接打开确认对话框
    if (card && card.defaultPaymentMethodId) {
      return setOpenConfirm(true)
    }
    
    // 获取Stripe卡号元素
    const cardElement = elements?.getElement(CardNumberElement)
    
    // 检查Stripe是否已加载
    if (!stripe || !elements || !cardElement) {
      return
    }
    
    dispatch(SET_LOADING(true)) // 显示加载状态

    // 创建支付方法
    const payload = await stripe
      .createPaymentMethod({
        type: "card",
        card: cardElement,
      })
      .catch((e: Error) => console.log(e))
    
    // 处理支付结果
    if (payload?.error) {
      dispatch(SET_MESSAGE_ALERT(payload?.error?.message || "")) // 显示错误信息
    } else if (payload?.paymentMethod) {
      setPayMethodId(payload?.paymentMethod.id) // 设置支付方法ID
      
      if (currentUser.id) {
        // 已登录用户直接确认
        setOpenConfirm(true)
      } else {
        // 新用户需要短信验证
        setSignUpData(data)
        getSMS(data.phoneNumber)
      }
    }
    dispatch(SET_LOADING(false)) // 隐藏加载状态
  }

  // 添加Stripe支付卡
  const addLineCardStripeCardForm = async (data: any) => {
    addLineCardStripeCard(data)
  }

  // 获取用户认证图片
  const authImages = useCallback(() => {
    return getAuthImage(currentUser.auth_image)
  }, [currentUser])

  // 生成使用指南列表
  const listGuideline = useCallback(() => {
    const guides = [
      `${data?.is_trial
        ?
        `初月会費は無料です。2ヶ月目以降は月額${numericPrice(
          Math.round(data.price * VAT_VALUE) 
        )}円(税込)が自動引き落としとなります。`
        : `毎月、月額${numericPrice(
          data.price
        )}円（税抜）が自動で引き落としされます。`
      }退会ご希望の際は、専用アプリからお手続きいただけます。`,
      `月会費とは別に、1回ごとの設備利用料${numericPrice(
        Math.round(data.reservation_fee  * VAT_VALUE)
      )}円(税込)が発生します。初回ご利用時は無料です。2回目以降の利用時から、顔認証による入室時に自動決済されます。`,
      `1回のご利用は、レッスン前後の準備時間・入退室を含め、${data.treatment_time}分間スロットとなります。${data.treatment_time}分を超過した場合、${data.extend_reservation_time}分ごとに${numericPrice(
        data.extend_reservation_fee * VAT_VALUE
      )}円の延長料金が発生します。`,
      `本利用登録の手続きをもって、ご登録期間中は全ての「${data?.shop?.nickname ?? ''}」店舗がご利用いただけます。`,
      "来店に際し、予約は不要です。アップロードいただいた顔写真により、現地顔認証システムでご入室いただけます。顔認証がうまくいかない場合は、専用アプリから再登録をお願いします。",
      "怪我やトラブルについては自己責任でお願いいたします。当施設では責任を負いかねますのでご了承ください。 \n\nその他、料金や詳しい利用手順等については、公式サイトをご確認ください。また、個別のお問い合わせは、公式LINEより承っております。",
    ]
    return guides
  }, [data])

  // 当用户状态变化时，设置用户ID
  useEffect(() => {
    setValue("user", currentUser.id)
  }, [currentUser])

  return (
    <div className="w-full">
      {/* 应用标题 */}
      <AppHeader title="ご利用登録" />
      
      {/* 主表单 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
        noValidate
      >
        <div className="w-full pt-[65px]">
          {/* 欢迎信息 - 已登录用户显示 */}
          {!!currentUser.id && (
            <h2 className="font-bold text-lg">
              ようこそ {currentUser?.nickname}さん
            </h2>
          )}
          
          {/* 隐藏的用户ID字段 */}
          <input name="user" value={currentUser.id} className="hidden"></input>
          
          {/* 健身房名称 */}
          <h2 className="font-bold text-lg mt-3">{`24時間女性専用ピラティスジム「${data?.shop?.nickname ?? ''}」`}</h2>

          <div className="border-b-[1px] my-3"></div>
          
          {/* 已选菜单信息 */}
          <div className="mb-4">
            <h3 className="text-base text-[#0eadaf] font-medium mb-2">
              選択済みメニュー
            </h3>
            <Box sx={{ width: 'max-content' }}>
              <p className="text-sm">
                【初月無料キャンペーン適用】
              </p>
              <p className="text-sm font-bold text-center">
                月会費{numericPrice(Math.round(data.price * VAT_VALUE))}円(税込)
              </p>
            </Box>
          </div>

          <div className="border-b-[1px] my-3"></div>

          {/* 支付金额明细 */}
          <h3 className="text-base text-[#0eadaf] font-medium mb-2">
            支払金額
          </h3>
          <div className="flex justify-between text-sm">
            <p>小計</p>
            <p>￥{numericPrice(Math.round(data.price))}</p>
          </div>
          <div className="flex justify-between text-sm mt-3">
            <p>消費税</p>
            <p>￥{numericPrice(Math.round(data.price * (VAT_VALUE - 1)))}</p>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-3">
            <p>ご利用ポイント</p>
            <p className="text-sm text-[red]">¥0</p>
          </div>
          <div className="border-b-[1px] my-3"></div>
          <div className="flex justify-between font-bold mt-2">
            <p>合計</p>
            <p>¥{numericPrice(Math.round(data.price * VAT_VALUE))}</p>
          </div>
          
          {/* 注意事项 */}
          {!!data?.purchase_notice && (
            <div className="flex flex-col gap-3 mt-5 text-sm">
              <span className="font-[600]">注意事項</span>
              <span>{data.purchase_notice}</span>
            </div>
          )}
          
          {/* 新用户注册表单 */}
          {!currentUser.id && (
            <>
              <div className="border-b-[1px] my-5"></div>
              <p className="my-4 text-[#0eadaf] font-medium">登録する</p>
              <SignUpForm
                register={register}
                errors={errors}
                userGender={userGender}
              />
            </>
          )}
          
          {/* 面部图像上传 */}
          {!authImages().length && (
            <>
              <div className="border-b-[1px] my-5"></div>
              <UploadFaceImage
                faceImages={faceImages}
                setFaceImages={setFaceImages}
              ></UploadFaceImage>
            </>
          )}
          
          {/* 使用指南 */}
          <div className="mt-5">
            <p className="text-[18px] font-bold"> ご利用時の注意事項</p>
            {listGuideline().map((guide: string, index: number) => (
              <p
                className="mt-2"
                style={{ whiteSpace: "pre-line" }}
                key={index}
              >
                {index + 1}. {guide}
              </p>
            ))}
          </div>
          
          {/* 支付表单 - 无默认支付方式时显示 */}
          {!!card && !card.defaultPaymentMethodId && (
            <>
              <div className="border-b-[1px] my-5"></div>
              <PaymentForm register={register} errors={errors} />
            </>
          )}

          {/* 同意条款和提交按钮 */}
          <div className="my-4 flex flex-col items-center">
            <label className="flex items-center justify-center space-x-2">
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
                onChange={e => {
                  setChecked(e.target.checked)
                }}
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
              <span>同意する</span>
            </label>

            <button
              className={`w-full max-w-[250px] py-2 rounded-full mb-2 mt-4 ${!checked
                ? "bg-[#F2F2F2] text-[#8F8E94]"
                : "bg-[#04BFBF] text-white"
                }`}
              disabled={!checked}
              type="submit"
            >
              お支払い確定
            </button>
          </div>
        </div>
      </form>
      
      {/* 短信验证模态框 */}
      {openModalSMSConfirm && (
        <ModalSignUpSms
          openModalSMSConfirm={openModalSMSConfirm}
          setOpenModalSMSConfirm={setOpenModalSMSConfirm}
          data={signUpData}
          addLineCardStripeCard={(data: any) => addLineCardStripeCardForm(data)}
        />
      )}
    </div>
  )
}

// 使用React.memo优化组件性能
export default React.memo(BookingInfo)