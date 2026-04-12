export interface NotificationResponseDTO {
  id: string; // receipt ID
  title: string;
  message: string;
  type: "individual" | "group" | "all";
  isRead: boolean;
  createdAt: Date;
}
