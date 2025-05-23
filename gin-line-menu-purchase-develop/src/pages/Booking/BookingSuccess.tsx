import React from "react"
import successIcon from "../../assets/icons/success.svg"

function BookingSuccess() {
  return (
    <div className="flex flex-col items-center pt-[150px]">
      <img src={successIcon} alt="" />
      <p className="text-[20px] mt-8">購入完了</p>
      <p className="mt-3">購入が完了しました。</p>
      <p className="mt-3">予約なしでお近くの好きな店舗をご利用いただけます。</p>
      <p className="mt-3">ご来店時、扉横の顔認証システムに顔をスキャンしてください。アップロードいただいた顔写真から本人認証し、そのまま入室いただけます。</p>
      <button
        className={`w-[120px] py-2 rounded-full bg-[#04BFBF] text-white mt-[80px]`}
        onClick={() => location.reload()}
      >
        OK
      </button>
    </div>
  )
}
export default React.memo(BookingSuccess)
