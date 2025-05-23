import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'
import app from '@/redux/reducers/app.slice'
import product from '@/redux/reducers/users/product.slice'
import auth from '@/redux/reducers/users/auth.slice'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const middlewares: Array<any> = [sagaMiddleware]

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const { createLogger } = require('redux-logger')
  const loggerMiddleware = createLogger()
  middlewares.push(loggerMiddleware)
}

export const store = configureStore({
  reducer: {
    app,
    product,
    auth,
  },
  middleware: getDefaultMiddleWare =>
    getDefaultMiddleWare({
      thunk: false,
    }).concat(middlewares),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
