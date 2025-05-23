import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios"

import { getUserToken } from "@/utils/helper"

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
})

export interface CustomAxiosResponse<T> extends AxiosResponse<T> {
  meta?: any
  defaultPaymentMethodId?: string
  success?: boolean
  messageCode?: string
}

const urlTokenExcludes: string[] = [
  "login",
  "register",
  "forgot-password",
  "public",
  "master",
]

// config header
const defaultHeaders = {
  ...axiosClient.defaults.headers.common,
  "Content-Type": "application/json; charset=UTF-8",
  "accept-language": "ja",
}
axiosClient.defaults.headers.common = defaultHeaders

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const urlParser = config.url?.split("/")
  if (urlParser === undefined) return config

  if (!urlTokenExcludes.includes(urlParser[1])) {
    // private api
    const token = getUserToken()
    config.headers = Object.assign(config.headers ?? {}, {
      Authorization: `Bearer ${token.accessToken}`,
    })
  }

  return config
}

const onRequestError = (error: AxiosError): Promise<AxiosError> =>
  Promise.reject(error)

const onResponse = (response: AxiosResponse): CustomAxiosResponse<any> => ({
  ...response,
  data: response.data.data,
  meta: response?.data?.meta,
  defaultPaymentMethodId: response?.data?.defaultPaymentMethodId,
  success: response?.data?.success,
  messageCode: response?.data?.messageCode,
})

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  // const token = getUserToken()
  // if (error.response?.status === 401) {
  //   if (token) removeUserToken()
  //   window.location.replace(ROUTER_PATH.AUTH.SIGN_IN)
  // }
  return Promise.reject(error)
}

axiosClient.interceptors.request.use(onRequest, onRequestError)
axiosClient.interceptors.response.use(onResponse, onResponseError)

export default axiosClient
