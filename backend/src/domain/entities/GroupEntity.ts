type GroupProps = {
  id?: string;
  name: string;
  ownerId: string;
  members?: string[];
  maximumPlayers?: number;
  difficulty: "easy" | "medium" | "hard";
  joinLink?: string | null;
  status?: "waiting" | "started" | "completed";
};
export class GroupEntity {
  private id?: string;
  private name!: string;
  private ownerId!: string;
  private members!: string[];
  private maximumPlayers!: number;
  private difficulty!: "easy" | "medium" | "hard";
  private joinLink!: string | null;
  private status!: "waiting" | "started" | "completed";

  constructor(attrs?: GroupProps) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
      this.ownerId = attrs.ownerId;
      this.members = attrs.members ?? [attrs.ownerId];
      this.maximumPlayers = attrs.maximumPlayers ?? 5;
      this.difficulty = attrs.difficulty;
      this.joinLink = attrs.joinLink ?? null;
      this.status = attrs.status ?? "waiting";
    }
  }
  getId() {
    return this.id;
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
}
