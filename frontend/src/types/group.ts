export interface GroupMember {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  wpm?: number;
  accuracy?: number;
}

export interface Group {
  id: string;
  name: string;
  type: string;
  members: (string | GroupMember)[];
  companyId?: string;
  createdAt?: string;
  usersCount?: number;
  avgWpm?: number;
  avgAccuracy?: number;
  maxAccuracy?: number;
}
