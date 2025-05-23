import en from "@/assets/images/flag_en.png"
import jp from "@/assets/images/flag_jp.png"

export const AUTH_USER_TOKEN = "auth_user_token"
export const AUTH_USER_BASIC_TOKEN = "auth_user_basic_token"

export const TAB_ID_TOKEN = "tab_id_token"

export const DEFAULT_LANGUAGE = "ja"

export const AUTH_REMEMBER_EXPIRES = 30

export const LANGUAGES = [
  {
    lang: "en",
    title: "English",
  },
  {
    lang: "ja",
    title: "Japanese",
  },
]

export const LANGS = [
  {
    label: "Japanese",
    value: "ja",
    icon: jp,
  },
  {
    label: "English",
    value: "en",
    icon: en,
  },
]

export const LANGUAGE_STORE_KEY = "by_current_lang"

export const enum TYPE_MENTOR {
  STAFF = 1,
  FREELANCER,
}

export const enum STATUS_MENTOR {
  REQUEST_APPROVE,
  ACTIVE,
  DELETE,
  REJECT,
}

export const enum SHOP_STATUS {
  APPLYING = 1,
  UNDER_CONSIDERING = 2,
  APPROVED = 3,
  REJECTION = 4,
}

export const SORT = {
  ASC: "ASC",
  DESC: "DESC",
}

export const ACTION_TABLE = {
  PAGINATE: "paginate",
  SORT: "sort",
  FILTERS: "filters",
}

export const enum SEX {
  MALE = 1,
  FEMALE,
}

export const TYPE_MESSAGE = {
  SUCCESS: "success",
  ERROR: "error",
}

export const YEAR_MONTH = "YYYY/MM"

export const FULL_DAY = "YYYY-MM-DD"

export const FULL_DAYJS = "yyyy-MM-dd"
export const FULL_DAYTIME_JS = "yyyy-MM-dd HH:mm"

export const JP_INPUT_FULL_DAY = "yyyy年MM月dd日"

export const JP_FIRST_FULL_DAY = "yyyy年MM月01日"
export const JP_DAY = "dd日"

export const EN_INPUT_FULL_DAY = "yyyy/MM/dd"
export const EN_FIRST_FULL_DAY = "01"
export const EN_DISPLAY_DAY = "dd MMMM yyyy"
export const EN_DAY = "dd"
export const EN_MONTH = "MMMM"
export const EN_YEAR = "yyyy"

export const HOUR_SECOND = "HH:mm"

export const FULL_DATETIME = "DD-MM-YYYY HH:mm"

export const FULL_DATETIME_NEW = "YYYY-MM-DD HH:mm"

export const YEAR_MONTH_DAY = "YYYY/MM/DD"

export const DATE_PICKER_INPUT_YM = "____/__"

export const DATE_PICKER_INPUT_YMD = "____/__/__"

export const DATE_PICKER_INPUT_YMD_NEW = "____-__-__"

export const TIME_PICKER_INPUT_HM = "__:__"

export const VALIDATION_PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/

export const EMAIL_REGEX =
  /^\w+([\\.-]?\w+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

export const TIME_EXPIRED = 86400000

export const DATE_INPUT_FORMAT = "yyyy/MM/dd"

export const DAYJS_FORMAT = "YYYY/MM/DD"

export const FORMAT_PHONE = /^(\d{3}-\d{4}-\d{4})$/

export const FORMAT_POST_CODE = /^(\d{3}-\d{4})$/

export const NUMBER_REGEX = /^[0-9]+$/

export const CALENDAR_EXTRA_HEIGHT = 330

export const ADMIN_GID = {
  SUPER_ADMIN: 1,
  SUB_ADMIN: 1000,
}

export const enum SCHEDULE_MODE {
  DAILY = 1,
  MONTH_LY = 2,
}

export const enum CALENDAR_TYPE {
  MENU = 1,
  MENTOR = 2,
}

export const enum API_STATUS {
  SUCCESS = 1,
  FAILED = 2,
  NORMAL = 0,
}

export const HOURS = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
]
export const MINUTES = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
]
export const PHONE_REGEX = /^\+?[0-9]+$/
export const MINUTE_MIN_EVENT = 60
export const WEEK_DAY_LIST = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

export enum BusinessStatus {
  OPEN = 0,
  CLOSED = 1,
}

export const IGNORE_EQUIPMENT_NAME = [
  "AirCon",
  "CoolHeat",
  "Temp",
  "FloorHeat",
  "Floor",
]

export const enum MENU_TYPE {
  NORMAL = "0",
  LIVE_STREAM = "1",
}

export const MASTER_BOX_EQUIPMENT_NAME = "box_equipment_name"

export const EQUIPMENT_AIR_CON_TYPE = 11
export const EQUIPMENT_FLOOR_HEAT_TYPE = 13

export const BOX_STATUS = {
  IN_USE: 1,
  OPEN: 2,
  REPAIR: 3,
}

export const BOX_STATUS_COLOR: { [key: string]: string } = {
  "1": "success",
  "2": "primary",
  "3": "warning",
}

export const MONITOR_BOX_STATUS = "monitor_box_status"

export const BRAND = "HS300"

export const BRAND_NAME = "TPLINK HS300"

export const LIVE_STREAM_BOX_STATUS_TITLE: { [key: string]: string } = {
  "1": "in_live",
  "2": "open",
  "3": "close",
}

export const REPORT_TIME_UNIT = ["year", "month", "week", "day"]

export const REPORT_TIME_UNIT_FILTER: {
  [key: string]: {
    filter_year: boolean
    filter_month: boolean
    csv_label: string
  }
} = {
  year: { filter_year: false, filter_month: false, csv_label: "annual_report" },
  month: {
    filter_year: true,
    filter_month: false,
    csv_label: "monthly_report",
  },
  week: { filter_year: true, filter_month: true, csv_label: "weekly_report" },
  day: { filter_year: true, filter_month: true, csv_label: "daily_report" },
}

export const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
]

export const CHAIN_PARENT_ID = 0

export const COUNTRY_CODE = "81"

export const VAT_VALUE = 1.1

export const enum STATE_PAYMENT {
  BOOKING_INFO,
  BOOKING_SUCCESS,
}

export const PAY_PASSWORD_LENGTH = 6

export const enum GENDER {
  MALE = 0,
  FEMALE = 1,
}
