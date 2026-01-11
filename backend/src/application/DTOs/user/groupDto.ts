type groupMembers={
    userId:string,
    name:string,
    imageUrl:string,
    isHost:boolean
}

export interface groupDTO{
  id: string;
  name: string;
  joinLink: string;
  difficulty: string;
  ownerId: string;
  members:groupMembers[];
  maximumPlayers:number
}

export function mapGroupToDTO(doc:any):groupDTO{
  return {
    id: doc._id.toString(),
    name: doc.name,
    joinLink: doc.joinLink,
    difficulty: doc.difficulty,
    ownerId: doc.ownerId,
    members:doc.members,
    maximumPlayers:doc.maximumPlayers
  }
}
