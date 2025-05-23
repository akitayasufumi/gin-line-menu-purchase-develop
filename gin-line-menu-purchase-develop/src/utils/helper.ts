import axios from "axios"
import i18n from "i18next"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { format } from "date-fns"
import {
  AUTH_REMEMBER_EXPIRES,
  AUTH_USER_BASIC_TOKEN,
  AUTH_USER_TOKEN,
  TAB_ID_TOKEN,
} from "../constants"
import { getCookie, setCookie } from "./cookies"
import { AppMessage } from "../interfaces/app"

dayjs.extend(utc)

dayjs.extend(timezone)

export const setUserToken = (
  accessToken: string,
  token: string,
  isRemember: boolean = false
) => {
  const expires = isRemember
    ? dayjs().add(AUTH_REMEMBER_EXPIRES, "day").toString()
    : ""
  setCookie(AUTH_USER_TOKEN, accessToken, expires)
  setCookie(AUTH_USER_BASIC_TOKEN, token, expires)
}

export const getUserToken = () => ({
  token: getCookie(AUTH_USER_BASIC_TOKEN),
  accessToken: getCookie(AUTH_USER_TOKEN),
})

export const removeUserToken = () => {
  setCookie(AUTH_USER_TOKEN, "", dayjs().subtract(1).toString())
  setCookie(AUTH_USER_BASIC_TOKEN, "", dayjs().subtract(1).toString())
}

export const handleMessageError = (err: any) => {
  let errMessage = ""
  if (axios.isAxiosError(err)) {
    if (err.response?.data.errors && err.response?.data.errors.length > 0) {
      errMessage = err.response?.data.errors[0].message
    } else {
      errMessage = err.response?.data.message
        ? err.response?.data.message
        : i18n.t("error.http_error")
    }
  }

  if (errMessage.substring(0, 2) === "E_") {
    return i18n.t(`error.${errMessage}`)
  }

  return errMessage
}

export const handleError = (error: any): AppMessage => {
  const errorType =
    axios.isAxiosError(error) && error.response?.status === 401 ? "" : "error"

  return {
    type: errorType,
    content: handleMessageError(error),
  }
}

export const generateKey = (prefix: string, index: number) =>
  `${prefix}_${index}`

export const getValueMasterData = (array: Array<any>) => {
  const initialValue = {}
  return array.reduce(
    (obj: any, item: any) => ({
      ...obj,
      [Number(item.value)]: item,
    }),
    initialValue
  )
}

export const showTotalPaginationTable = (
  perPage: number,
  currentPage: number,
  arrayLength: number,
  total: number
): string =>
  `${perPage * (currentPage - 1) + 1}-${
    perPage * (currentPage - 1) + arrayLength
  } / ${total}`

export const setTabId = () => {
  const timeStamp = new Date().getTime()
  sessionStorage.setItem(TAB_ID_TOKEN, String(timeStamp))
}

export const getTabId = () => sessionStorage.getItem(TAB_ID_TOKEN)

export const convertTimeToJapan = (dateTime: string | null) => {
  if (dateTime === null || dateTime === "") {
    return dayjs()
  }
  if (dateTime?.charAt(dateTime.length - 1).toLowerCase() === "z") {
    return dayjs(dateTime).tz("Asia/Tokyo")
  }
  if (dateTime?.includes("+")) {
    return dayjs(dateTime).tz("Asia/Tokyo")
  }
  return dayjs(dateTime)
}

export const renderLabel = (label: string): string => `${label}`

export const convertTimeStringToMinutes = (timeString: string) => {
  // Split the string by the colon
  const [hour, minute] = timeString.split(":").map(Number)

  // Convert to total minutes
  return hour * 60 + minute
}

export const isWithinBusinessHours = (
  date: Date,
  startTime: string,
  endTime: string
) => {
  const hour = convertTimeStringToMinutes(format(date, "HH:mm"))
  const startHour = convertTimeStringToMinutes(startTime)
  const endHour = convertTimeStringToMinutes(endTime)
  return hour >= startHour && hour < endHour
}

export const numericPrice = (price: number) =>
  !price && price !== 0 ? "" : price.toLocaleString("ja-JP")

export const getEnv = (key: string) => process.env[`REACT_APP_${key}`] ?? ""

export const isNotUndefined = (objectName: any) => objectName != null

export const getDateAfter = (startDate: string, daysToAdd: number): string => {
  const start = new Date(startDate)
  start.setDate(start.getDate() + daysToAdd)
  return start.toISOString().split("T")[0]
}

export const encodePhone = (phoneNumber: string) => {
  let phoneEncode = ""
  if (phoneNumber.length > 5) {
    phoneEncode = phoneNumber.substring(0, 3)
    for (let index = 0; index < phoneNumber.length - 5; index++) {
      phoneEncode += "*"
    }
    phoneEncode += phoneNumber.substring(
      phoneNumber.length - 2,
      phoneNumber.length
    )
  }
  return phoneEncode
}

export const getAuthImage = (authImage: string) => {
  try {
    const images = JSON.parse(authImage)
    return Array.isArray(images) ? images : []
  } catch (e) {
    return []
  }
}

export const isImageFile = (file: File) => file.type.startsWith("image/")

export const convertFullWidthToHalfWidth = (str: string) => {
  return str.replace(/[\uFF10-\uFF19]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  )
}