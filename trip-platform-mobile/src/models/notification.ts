export type NotificationKind =
  | "FOLLOW"
  | "TRIP_INVITE"
  | "TRIP_JOIN"
  | "LIKE"
  | "COMMENT"
  | "REVIEW";

export type AppNotification = {
  id: string;
  type: NotificationKind;
  actorName: string;
  avatarUrl: string;
  message: string;
  tripTitle?: string;
  createdAtLabel: string;
  isRead: boolean;
  actionable?: boolean;
};
