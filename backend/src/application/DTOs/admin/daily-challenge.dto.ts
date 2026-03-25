export interface AssignDailyChallengeDTO {
  challengeId: string;
  date: Date;
}
export interface challengeDTO{
  _id?:string,
  title:string
}

export interface DailyAssignChallengeResponseDTO {
  _id?: string;
  challengeId: challengeDTO;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface DailyAssignChallengeDTO{
  _id?: string;
  challengeId: challengeDTO;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}