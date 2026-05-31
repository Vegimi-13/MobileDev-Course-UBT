import type { AppNotification } from "../models/notification";

const sampleNotifications: AppNotification[] = [
  {
    id: "1",
    type: "TRIP_INVITE",
    actorName: "Alex Chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    message: "invited you to join",
    tripTitle: "Bali Escape",
    createdAtLabel: "2m ago",
    isRead: false,
    actionable: true,
  },
  {
    id: "2",
    type: "LIKE",
    actorName: "Maya Patel",
    avatarUrl:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=240&q=80",
    message: "liked your photo in",
    tripTitle: "Tokyo Sakura Season",
    createdAtLabel: "15m ago",
    isRead: false,
  },
  {
    id: "3",
    type: "REVIEW",
    actorName: "Jake Wilson",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    message: "left a 5 star review on",
    tripTitle: "Swiss Alps Trek",
    createdAtLabel: "1h ago",
    isRead: false,
  },
  {
    id: "4",
    type: "TRIP_JOIN",
    actorName: "Lily Park",
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=240&q=80",
    message: "joined your trip",
    tripTitle: "Bali Escape",
    createdAtLabel: "3h ago",
    isRead: true,
  },
  {
    id: "5",
    type: "COMMENT",
    actorName: "Alex Chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    message: "commented on your post in",
    tripTitle: "Swiss Alps Trek",
    createdAtLabel: "5h ago",
    isRead: true,
  },
  {
    id: "6",
    type: "TRIP_INVITE",
    actorName: "Maya Patel",
    avatarUrl:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=240&q=80",
    message: "invited you to join",
    tripTitle: "Santorini & Mykonos",
    createdAtLabel: "1d ago",
    isRead: true,
  },
  {
    id: "7",
    type: "LIKE",
    actorName: "Lily Park",
    avatarUrl:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=240&q=80",
    message: "liked your trip",
    tripTitle: "Kenya Safari",
    createdAtLabel: "2d ago",
    isRead: true,
  },
];

export async function fetchNotifications(): Promise<AppNotification[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(sampleNotifications), 300),
  );
}
