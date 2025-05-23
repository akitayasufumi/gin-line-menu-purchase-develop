import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, LANGUAGE_STORE_KEY } from './constants/common'
import en from '@/locales/en'
import ja from '@/locales/ja'

const resources = {
  en,
  ja,
}

const lng = localStorage.getItem(LANGUAGE_STORE_KEY) || DEFAULT_LANGUAGE

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng
  })

export default i18n
