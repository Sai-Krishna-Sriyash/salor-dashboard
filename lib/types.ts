export type Channel = "phone" | "sms"
export type Sentiment = "happy" | "neutral" | "frustrated"
export type CarrierStatus = "active" | "warning" | "awarded" | "dropped" | "pending"

export interface CarrierNode {
  id: string
  name: string
  channel: Channel
  bid: number
  sentiment: Sentiment
  status: CarrierStatus
  isDummy?: boolean
}

export interface TranscriptMessage {
  sender: string
  message: string
  time: string
  isOverride?: boolean
}

export interface DemoState {
  step: number
  carriers: CarrierNode[]
  transcript: TranscriptMessage[]
  autoOpenModal?: string
  humanOverride?: string
}
