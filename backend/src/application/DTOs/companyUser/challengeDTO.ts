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

//game Data Challenge
export interface ChallengeGameDTO {
  id: string
  startedAt: Date
  status: string
  duration: number
  companyId: string
  countDown: number

  lesson: {
    id: string
    title: string
    text: string
  }

  players: {
    id:string
    name: string
    imageUrl: string
    companyId: string
    companyRole: string | null
    bio: string | null
  }[]
}
export const mapChallengeGameToDTO = (data: any): ChallengeGameDTO => {
  return {
    id: data.competition._id.toString(),
    startedAt: data.competition.startedAt,
    status: data.competition.status,
    duration: data.competition.duration,
    companyId: data.competition.CompanyId?.toString(),
    countDown: data.competition.countDown,

    lesson: {
      id: data.lesson._id.toString(),
      title: data.lesson.title,
      text: data.lesson.text
    },

    players: data.players.map((player: any) => ({
      id:player._id.toString(),
      name: player.name,
      imageUrl: player.imageUrl,
      companyId: player.CompanyId?.toString(),
      companyRole: player.CompanyRole,
      bio: player.bio
    }))
  }
}