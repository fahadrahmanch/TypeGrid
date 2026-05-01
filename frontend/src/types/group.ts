export interface GroupMember {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  wpm?: number;
  accuracy?: number;
}

export interface Group {
  _id: string;
  groupName: string;
  groupType: string;
  selectedUsers: (string | GroupMember)[];
  companyId?: string;
  createdAt?: string;
  usersCount?: number;
  avgWpm?: number;
  avgAccuracy?: number;
  maxAccuracy?: number;
}
