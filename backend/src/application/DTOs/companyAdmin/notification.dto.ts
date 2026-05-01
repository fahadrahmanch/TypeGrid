export interface IndividualNotificationDTO {
  title: string;
  message: string;
  selectedUsers: string[];
}

export interface GroupNotificationDTO {
  title: string;
  message: string;
  selectedGroup: string;
}

export interface AllNotificationDTO {
  title: string;
  message: string;
}

export interface NotificationHistoryDTO {
  id: string;
  title: string;
  message: string;
  type: "individual" | "group" | "all";
  targetId: string | null;
  createdAt: Date;
}
