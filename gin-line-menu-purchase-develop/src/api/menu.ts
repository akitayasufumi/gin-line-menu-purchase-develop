import client from "@/api/axiosClient"
import axios from "axios"

export const apiGetBeautyPack = async (id?: string) => {
  try {
    return await client.get(`/v3/user/beauty-pack/${id}`)
  } catch (e) {
    return { data: {} }
  }
}

export const apiGetCardStripe = async () => {
  try {
    return await client.get(`/v2/user/payment/stripe/list-payment-methods`)
  } catch (e) {
    return { defaultPaymentMethodId: "", data: [] }
  }
}

export const apiGetCardInfoStripe = async (paymentMethodId: string) => {
  client.get(`/v2/user/payment/stripe/payment-methods/${paymentMethodId}`)
}

export const createBeautyTradeSpecialSubscription = async (
  shopId: number,
  packId: number,
  paymentMethodId: string
) =>
  client.post("/v3/user/trades-special-subs", {
    shopId,
    packId,
    paymentMethodId,
  })

export const addCardStripe = async (paymentMethodId: string) =>
  client.post("/v2/user/payment/stripe/attach-payment-method", {
    paymentMethodId,
  })

// Pay Password
export const checkPayPassword = async (token: string, password: string) => {
  const formData = new FormData()
  formData.append("token", token)
  formData.append("password", password)

  const response = await axios.post(
    process.env.REACT_APP_BASE_URL + `check_pay_pass`,
    formData
  )

  return response.data
}

export const editPayPassword = async (token: string, password: string) => {
  const formData = new FormData()
  formData.append("token", token)
  formData.append("password", password)

  const response = await axios.post(
    process.env.REACT_APP_BASE_URL + `edit_pay_pass`,
    formData
  )

  return response.data
}

export const addLineCardStripe = async (data: {
  paymentMethodId: string
  account: string
  password: string
}) => client.post("/v3/user/line/attach-payment-method", data)

export const maskImage = async (
  phone: string,
  array: Array<{ role: number; url: string }>
) => {
  const formData = new FormData()
  const string = JSON.stringify(array)
  formData.append("authImage", string)
  formData.append("account", phone)
  await client.post(`/update-auth-image`, formData)
}
