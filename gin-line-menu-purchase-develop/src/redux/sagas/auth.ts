import { apiUserSignIn, apiUserSignOut } from "@/api/auth"
import { apiGetMe } from "@/api/me"
import { AuthSignIn } from "@/interfaces"
import {
  RESET_MESSAGE,
  SET_LOADING,
  SET_MESSAGE,
  SET_MESSAGE_ALERT,
} from "@/redux/reducers/app.slice"
import {
  AUTH_GET_INFO,
  AUTH_LOADING,
  AUTH_LOGOUT,
  AUTH_SET_CURRENT_USER,
  AUTH_USER_LOGIN,
  AUTH_USER_REGISTER,
} from "@/redux/reducers/users/auth.slice"
import {
  getUserToken,
  handleError,
  removeUserToken,
  setUserToken,
} from "@/utils"
import { PayloadAction } from "@reduxjs/toolkit"
import { AxiosResponse } from "axios"
import { all, call, ForkEffect, put, takeLatest } from "redux-saga/effects"

function* signIn(action: PayloadAction<AuthSignIn>) {
  try {
    yield put(RESET_MESSAGE())
    yield put(SET_LOADING(true))
    const { payload } = action
    const response: AxiosResponse = yield apiUserSignIn(payload)
    const { bearerToken, token } = response.data
    setUserToken(bearerToken, token)
    const userResponse: AxiosResponse = yield apiGetMe()
    yield put(AUTH_SET_CURRENT_USER(userResponse.data))
  } catch (err) {
    // AxiosError
    const { content } = handleError(err)
    yield put(SET_MESSAGE_ALERT(content))
  } finally {
    yield put(SET_LOADING(false))
  }
}

function* register() {
  try {
    yield put(RESET_MESSAGE())
    yield put(SET_LOADING(true))
    // const { payload } = action
    // yield apiUserRegister(payload)
  } catch (err) {
    yield put(SET_MESSAGE(handleError(err)))
  } finally {
    yield put(SET_LOADING(false))
  }
}

function* getInfo() {
  yield put(AUTH_LOADING(true))
  yield put(RESET_MESSAGE())
  const tokenInfo = getUserToken()
  if (!tokenInfo.token || !tokenInfo.accessToken) {
    yield put(AUTH_LOADING(false))
    yield put(AUTH_SET_CURRENT_USER({}))
    return
  }
  try {
    const response: AxiosResponse = yield call(apiGetMe)
    yield put(AUTH_SET_CURRENT_USER(response.data))
  } catch (err) {
    yield put(AUTH_SET_CURRENT_USER({}))
    yield put(SET_MESSAGE(handleError(err)))
  } finally {
    yield put(AUTH_LOADING(false))
  }
}

function* logout() {
  try {
    yield put(RESET_MESSAGE())
    yield put(SET_LOADING(true))
    yield call(apiUserSignOut)
    removeUserToken()
    yield put(AUTH_SET_CURRENT_USER({}))
  } catch (err) {
    yield put(SET_MESSAGE(handleError(err)))
  } finally {
    yield put(SET_LOADING(false))
  }
}

export default function* authSaga() {
  const filteredSagas: ForkEffect[] = [
    takeLatest(AUTH_USER_LOGIN, signIn),
    takeLatest(AUTH_USER_REGISTER, register),
    takeLatest(AUTH_GET_INFO, getInfo),
    takeLatest(AUTH_LOGOUT, logout),
  ]

  yield all(filteredSagas)
}
