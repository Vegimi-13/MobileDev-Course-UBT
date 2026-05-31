export type Trip = {
  id: string;
  publicId?: string;
  image: string;
  coverImageUrl?: string;
  host: string;
  hostId?: string;
  title: string;
  location?: string;
  date?: string;
  tags?: string[];
  likes?: number;
  liked?: boolean;
  joined?: string;
  spotsLeft?: number;
  status?: "Upcoming" | "Ongoing" | "Completed";
  visibility?: "Public" | "Private";
  joinPolicy?: "Open" | "Approval";
  country?: string;
  continent?: string;
  summary?: string;
  category?: "Beach" | "Mountains" | "City" | "Adventure";
  membersJoined?: number;
  maxMembers?: number;
  isFollowingHost?: boolean;
  isOwner?: boolean;
  hasJoined?: boolean;
};

export type TripPost = {
  id: string;
  body: string;
  imageUrl?: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username?: string;
    avatarUrl?: string;
  };
};

export type CreateTripPayload = {
  title: string;
  destination: string;
  description?: string;
  startDate: string;
  endDate: string;
  visibility: "PUBLIC" | "PRIVATE";
  joinPolicy: "OPEN" | "APPROVAL";
  maxMembers?: number;
  coverImageUrl?: string;
  categoryName?: string;
  tags?: string[];
};
