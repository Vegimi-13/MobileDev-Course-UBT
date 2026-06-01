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
  message: string;
  tripPublicId?: string;
  tripTitle?: string;
  createdAtLabel: string;
  isRead: boolean;
  actionable?: boolean;
};
