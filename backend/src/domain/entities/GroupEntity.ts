type GroupProps = {
  _id?: string;
  name: string;
  ownerId: string;
  members?: string[];
  maximumPlayers?: number;
  difficulty: "easy" | "medium" | "hard";
  joinLink?: string | null;
  status?: "waiting" | "started" | "completed";
  kickedUsers?: string[];
};
export class GroupEntity {
  private _id?: string;
  private name!: string;
  private ownerId!: string;
  private members!: string[];
  private maximumPlayers!: number;
  private difficulty!: "easy" | "medium" | "hard";
  private joinLink!: string | null;
  private status!: "waiting" | "started" | "completed";
  private kickedUsers!: string[];

  constructor(attrs?: GroupProps) {
    if (attrs) {
      this._id = attrs._id;
      this.name = attrs.name;
      this.ownerId = attrs.ownerId;
      this.members = attrs.members ?? [attrs.ownerId];
      this.maximumPlayers = attrs.maximumPlayers ?? 5;
      this.difficulty = attrs.difficulty;
      this.joinLink = attrs.joinLink ?? null;
      this.status = attrs.status ?? "waiting";
      this.kickedUsers = attrs.kickedUsers ?? [];
    }
  }
    changeDifficulty(difficulty: "easy" | "medium" | "hard") {
    if (this.status !== "waiting") {
      throw new Error("Cannot change difficulty after game has started");
    }
    this.difficulty = difficulty;
  }

  changeMaximumPlayers(max: number) {
    if (max < this.members.length) {
      throw new Error("Maximum players cannot be less than current members");
    }
    if (max < 2 || max > 10) {
      throw new Error("Maximum players must be between 2 and 10");
    }
    this.maximumPlayers = max;
  }
  addMember(memberId: string) {
    console.log("memeber id add memner",memberId)
    console.log("kicked usersin add membwe",this.kickedUsers)
    if (this.members.length >= this.maximumPlayers) {
      throw new Error("Group is full");
    }
    if(this.status!="waiting"){
        throw new Error("Cannot join group after game has started");
    }
    const kikedUser=this.kickedUsers.find((user)=>user.toString()===memberId)
    if(kikedUser){
      throw new Error("User is kicked from group");
    }

    const alreadyMember=this.members.find((member)=>member.toString()===memberId)
    if(!alreadyMember){
      this.members.push(memberId);
    }
  }
  removeMember(memberId: string) {
    console.log("staart remove member")
    this.members = this.members.filter((member) => member.toString() !== memberId.toString());
    console.log("end remove member")
    this.kickedUsers.push(memberId.toString());
    console.log("kicked users",this.kickedUsers)
    console.log("end remove member")
    
  }
  getId() {
    return this._id;
  }

  getName() {
    return this.name;
  }

  getOwnerId() {
    return this.ownerId;
  }

  getMembers() {
    return [...this.members];
  }

  getMaximumPlayers() {
    return this.maximumPlayers;
  }

  getDifficulty() {
    return this.difficulty;
  }

  getJoinLink() {
    return this.joinLink;
  }

  getStatus() {
    return this.status;
  }
  getKickedUsers() {
    return this.kickedUsers;
  }
}
