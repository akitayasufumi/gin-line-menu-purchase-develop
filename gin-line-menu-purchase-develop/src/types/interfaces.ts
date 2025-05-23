export interface PaymentMethodState {
  defaultPaymentMethodId?: string
  object?: string
  data?: Array<{
    id: string
    object: string
    allow_redisplay: string
    card: {
      fingerprint: string
    }
  }>
}
