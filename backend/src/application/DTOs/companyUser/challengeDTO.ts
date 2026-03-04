export interface SentChallengeDTO {
  challengeId: string
  receiverId: string
  status: string
}
export const mapSentChallengeToDTO = (challenge: any): SentChallengeDTO => {
  return {
    challengeId: challenge._id.toString(),
    receiverId: challenge.receiverId.toString(),
    status: challenge.status
  }
}
export interface OpponentDTO {
  id: string
  name: string
  email: string
  imageUrl: string
  companyRole: string | null
}
export interface ChallengeDTO {
  id: string
  companyId: string
  senderId: string
  receiverId: string
  status: string
  competitionId: string
  type: "sent" | "received"|"completed"
  opponent: OpponentDTO
  createdAt: Date
  updatedAt: Date
}
export const mapOpponentToDTO = (user: any): OpponentDTO => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl,
    companyRole: user.CompanyRole ?? null
  }
}
export const mapChallengeToDTO = (challenge: any): ChallengeDTO => {
  return {
    id: challenge._id.toString(),
    companyId: challenge.CompanyId.toString(),
    senderId: challenge.senderId.toString(),
    receiverId: challenge.receiverId.toString(),
    status: challenge.status,
    competitionId: challenge.competitionId.toString(),
    type: challenge.type,
    opponent: mapOpponentToDTO(challenge.opponent),
    createdAt: challenge.createdAt,
    updatedAt: challenge.updatedAt
  }
}