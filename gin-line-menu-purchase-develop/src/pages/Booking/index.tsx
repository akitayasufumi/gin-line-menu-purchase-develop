import {
  addCardStripe,
  addLineCardStripe,
  apiGetBeautyPack,
  apiGetCardInfoStripe,
  apiGetCardStripe,
  createBeautyTradeSpecialSubscription,
  editPayPassword,
  maskImage,
} from "@/api/menu"
import { STATE_PAYMENT, VAT_VALUE } from "@/constants"
import { useAppDispatch, useAppSelector } from "@/redux/hook"
import { SET_LOADING, SET_MESSAGE_ALERT } from "@/redux/reducers/app.slice"
import { AUTH_GET_INFO } from "@/redux/reducers/users/auth.slice"
import { PaymentMethodState } from "@/types/interfaces"
import { handleError, numericPrice, setUserToken } from "@/utils"
import { Close } from "@mui/icons-material"
import { Card, Modal } from "@mui/material"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import BookingInfo from "./BookingInfo"
import BookingSuccess from "./BookingSuccess"
import CodeVerify from "./CodeVerify"
import PageNotFound from "../PageNotFound"

const stripePromise = loadStripe(process.env.REACT_APP_API_STRIPE || "")

function Booking() {
  const { id } = useParams()
  const [data, setData] = useState<any>({})
  const [openConfirm, setOpenConfirm] = useState(false)
  const [currentState, setCurrentState] = useState(STATE_PAYMENT.BOOKING_INFO)
  const { isLoading } = useAppSelector(state => state.app)
  const [card, setCard] = useState<PaymentMethodState | null>(null)
  const [payMethodId, setPayMethodId] = useState("")
  const [openCodeVerify, setOpenCodeVerify] = useState(false)
  const [faceImages, setFaceImages] = useState<
    Array<{ url: string; base: string }>
  >([])
  const { currentUser } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const userRef = useRef(currentUser)

  const initData = async () => {
    dispatch(SET_LOADING(true))
    setFaceImages([])
    setCard(null)
    try {
      const [pack, card] = await Promise.all([
        apiGetBeautyPack(id),
        apiGetCardStripe(),
      ])
      if (!!pack.data?.is_special) {
        setData(pack.data)
      }
      setCard(card)
    } catch (e) {
      const error = handleError(e)
      dispatch(SET_MESSAGE_ALERT(error.content || ""))
    }
    dispatch(SET_LOADING(false))
  }

  const payment = async () => {
    if (card?.defaultPaymentMethodId) {
      setOpenCodeVerify(true)
    } else {
      confirmCardData(payMethodId)
    }
    setOpenConfirm(false)
  }

  const confirmCardData = (paymentMethod: string) => {
    if (!!card?.data?.length) {
      apiGetCardInfoStripe(paymentMethod).then((result: any) => {
        const fingerprint = result?.card?.fingerprint
        const check = card?.data?.find(e => {
          return e?.card?.fingerprint === fingerprint
        })
        if (check) {
          return onNewPayment(check.id)
        }
        return addCardStripeCard(paymentMethod)
      })
    } else {
      addCardStripeCard(paymentMethod)
    }
  }

  const addCardStripeCard = async (paymentMethodId: string) => {
    dispatch(SET_LOADING(true))
    addCardStripe(paymentMethodId)
      .then(async (result: any) => {
        if (result.success) {
          await onNewPayment(paymentMethodId)
        } else {
          if ((result.messageCode = "E0081")) {
            await onNewPayment(paymentMethodId)
          } else {
            dispatch(SET_MESSAGE_ALERT(result.message))
          }
        }
        dispatch(SET_LOADING(false))
      })
      .catch(err => {
        dispatch(SET_LOADING(false))
        dispatch(SET_MESSAGE_ALERT(err))
      })
  }

  const verifyCodeFailed = (msg: string) => {
    dispatch(SET_MESSAGE_ALERT(msg))
    dispatch(AUTH_GET_INFO())
    dispatch(SET_LOADING(false))
  }

  const addLineCardStripeCard = async (dataForm: any) => {
    dispatch(SET_LOADING(true))
    addLineCardStripe({
      paymentMethodId: payMethodId,
      account: dataForm.phoneNumber,
      password: dataForm.password,
    })
      .then(async (result: any) => {
        if (result.success) {
          setUserToken(result.data?.bearerToken, result.data?.token)
          try {
            const res = await editPayPassword(
              result.data?.token,
              dataForm.payPassword
            )
            if (res?.code !== 1) {
              return verifyCodeFailed(res.msg)
            }
          } catch (e) {
            const error = handleError(e)
            return verifyCodeFailed(error.content)
          }
          await onNewPayment(payMethodId, dataForm)
        } else {
          dispatch(SET_MESSAGE_ALERT(result.message))
        }
        dispatch(SET_LOADING(false))
      })
      .catch(err => {
        dispatch(SET_LOADING(false))
        dispatch(SET_MESSAGE_ALERT(err))
      })
  }

  const onNewPayment = async (paymentMethodId: string, dataForm?: any) => {
    setOpenCodeVerify(false)
    dispatch(SET_LOADING(true))
    const facePayloads = faceImages.map(faceImage => ({
      sysid: currentUser.id ? currentUser.account : dataForm.phoneNumber,
      meta: JSON.stringify({
        name: currentUser.id
          ? currentUser.nickname
          : JSON.stringify({
              name: `${dataForm.firstName}${dataForm.lastName}`,
            }),
      }),
      face: faceImage.base,
    }))
    const authImagesPayload = []
    for (const payload of facePayloads) {
      try {
        const res = await axios.post(
          process.env.REACT_APP_FACE_URL + "/face",
          payload
        )
        if (!!res.data?.message?.url) {
          const paths = res.data.message.url.split("/")
          if (paths.length > 0) {
            const path = paths[paths.length - 1]
            authImagesPayload.push({
              role: authImagesPayload.length,
              url: path,
            })
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (!!authImagesPayload.length)
      await maskImage(
        currentUser?.id ? currentUser.account : dataForm.phoneNumber,
        authImagesPayload
      )

    const isSpecialSubscriptionMenu = !!data.is_special
    if (isSpecialSubscriptionMenu) {
      try {
        await createBeautyTradeSpecialSubscription(
          data.shop_id,
          data.id,
          paymentMethodId
        )
        setCurrentState(STATE_PAYMENT.BOOKING_SUCCESS)
      } catch (e) {
        const error = handleError(e)
        dispatch(AUTH_GET_INFO())
        setCurrentState(STATE_PAYMENT.BOOKING_INFO)
        dispatch(SET_MESSAGE_ALERT(error.content))
      }
    }
    dispatch(SET_LOADING(false))
  }

  const modalConfirm = () => {
    return (
      <Modal
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        className="modal-wrapper"
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className="flex items-center justify-center flex-col p-6 pt-[32px] w-[90%] max-w-[500px] relative">
          <div
            className="absolute right-[10px] top-[10px]"
            onClick={() => setOpenConfirm(false)}
          >
            <Close />
          </div>
          <b>こちらの内容で予約を確定します。</b>
          <div className="mt-5 flex flex-col gap-3 text-sm w-full">
            <div>店舗名： {data?.shop?.nickname}</div>
            <div>
              メニュー：
              <span style={{ color: data?.title_color }}>
                {data?.title_header}
              </span>
              {data?.title}
            </div>
            <div>
              お支払い額： {numericPrice(Math.round(data.price * VAT_VALUE))}
              {" 円"}
            </div>
          </div>
          <div className="flex justify-between w-full mt-[32px] text-sm">
            <button
              className="w-[120px] bg-[#8F8E94] border border-gray-300 text-white py-2 rounded-full hover:bg-gray-100"
              onClick={() => setOpenConfirm(false)}
            >
              戻る
            </button>
            <button
              className={`w-[120px] py-2 rounded-full bg-[#04BFBF] text-white`}
              onClick={payment}
            >
              OK
            </button>
          </div>
        </Card>
      </Modal>
    )
  }

  const renderMainLayout = () => {
    switch (currentState) {
      case STATE_PAYMENT.BOOKING_INFO:
        return (
          <Elements stripe={stripePromise}>
            <BookingInfo
              data={data}
              setOpenConfirm={setOpenConfirm}
              setPayMethodId={setPayMethodId}
              card={card}
              addLineCardStripeCard={addLineCardStripeCard}
              faceImages={faceImages}
              setFaceImages={setFaceImages}
            />
          </Elements>
        )
      case STATE_PAYMENT.BOOKING_SUCCESS:
        return <BookingSuccess />
    }
  }

  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    if (userRef.current !== undefined) {
      initData()
    }
    userRef.current = currentUser
  }, [currentUser])

  if ((!data.id && isLoading) || !currentUser) return null

  if (data?.status !== 1) return <PageNotFound />

  return (
    <div className="w-full">
      {renderMainLayout()}
      {modalConfirm()}
      {openCodeVerify && (
        <CodeVerify
          openCodeVerify={openCodeVerify}
          setOpenCodeVerify={setOpenCodeVerify}
          card={card}
          onNewPayment={onNewPayment}
        ></CodeVerify>
      )}
    </div>
  )
}
export default React.memo(Booking)
