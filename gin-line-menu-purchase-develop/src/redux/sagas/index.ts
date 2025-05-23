import { all, fork } from 'redux-saga/effects'
import authSaga from '@/redux/sagas/auth'

export default function* rootSaga() {
  yield all([
    fork(authSaga)
  ])
}
