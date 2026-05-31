import type { CreateTripPayload, Trip, TripPost } from "../models/trip";
import { apiRequest } from "./apiClient";

type ApiTrip = {
  id: string;
  publicId?: string;
  title: string;
  description?: string | null;
  destination: string;
  coverImageUrl?: string | null;
  startDate: string;
  endDate: string;
  visibility: "PUBLIC" | "PRIVATE";
  joinPolicy: "OPEN" | "APPROVAL";
  maxMembers?: number | null;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
    username?: string | null;
  };
  category?: {
    name: string;
  } | null;
  tags?: Array<{
    tag?: {
      name: string;
    };
  }>;
  participants?: Array<{
    userId?: string;
    status?: "PENDING" | "ACCEPTED" | "DECLINED";
  }>;
  likes?: Array<{ id: string }>;
  _count?: {
    participants?: number;
    likes?: number;
  };
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const getTripStatus = (trip: ApiTrip): Trip["status"] => {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  if (end < now) {
    return "Completed";
  }

  if (start <= now && end >= now) {
    return "Ongoing";
  }

  return "Upcoming";
};

const getCategory = (name?: string | null): Trip["category"] => {
  if (!name) {
    return "Adventure";
  }

  const normalized = name.toLowerCase();
  if (normalized.includes("beach")) return "Beach";
  if (normalized.includes("mountain") || normalized.includes("hiking")) return "Mountains";
  if (normalized.includes("city") || normalized.includes("culture")) return "City";
  return "Adventure";
};

export const mapTrip = (trip: ApiTrip): Trip => {
  const membersJoined = trip._count?.participants ?? trip.participants?.length ?? 0;
  const maxMembers = trip.maxMembers ?? undefined;
  const categoryName = trip.category?.name;

  return {
    id: trip.id,
    publicId: trip.publicId,
    image: trip.coverImageUrl ?? "",
    coverImageUrl: trip.coverImageUrl ?? undefined,
    host: trip.creator
      ? `${trip.creator.firstName} ${trip.creator.lastName}`.trim()
      : "Trip host",
    hostId: trip.creator?.id,
    title: trip.title,
    location: trip.destination,
    date: `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`,
    tags: trip.tags?.map((entry) => entry.tag?.name).filter(Boolean) as string[],
    likes: trip._count?.likes ?? 0,
    liked: Boolean(trip.likes?.length),
    joined: `${membersJoined}/${maxMembers ?? "-" } joined`,
    spotsLeft: maxMembers ? Math.max(maxMembers - membersJoined, 0) : undefined,
    status: getTripStatus(trip),
    visibility: trip.visibility === "PRIVATE" ? "Private" : "Public",
    joinPolicy: trip.joinPolicy === "APPROVAL" ? "Approval" : "Open",
    country: trip.destination,
    summary: trip.description ?? "",
    category: getCategory(categoryName),
    membersJoined,
    maxMembers,
    hasJoined: trip.participants?.some((entry) => entry.status === "ACCEPTED"),
  };
};

export async function fetchTrips(): Promise<Trip[]> {
  const trips = await apiRequest<ApiTrip[]>("/api/trips/public", {
    authenticated: true,
  }).catch(() => apiRequest<ApiTrip[]>("/api/trips/public"));
  return trips.map(mapTrip);
}

export async function fetchMyTrips(): Promise<Trip[]> {
  const trips = await apiRequest<ApiTrip[]>("/api/trips/me", {
    authenticated: true,
  });
  return trips.map(mapTrip);
}

export async function fetchTrip(publicId: string): Promise<Trip> {
  const trip = await apiRequest<ApiTrip>(`/api/trips/${publicId}`, {
    authenticated: true,
  });
  return mapTrip(trip);
}

export async function createTrip(payload: CreateTripPayload): Promise<Trip> {
  const trip = await apiRequest<ApiTrip>("/api/trips", {
    authenticated: true,
    body: payload,
    method: "POST",
  });
  return mapTrip(trip);
}

export async function joinTrip(publicId: string) {
  return apiRequest(`/api/trips/${publicId}/join`, {
    authenticated: true,
    method: "POST",
  });
}

export async function likeTrip(publicId: string) {
  return apiRequest<{ liked: true }>(`/api/likes/trips/${publicId}`, {
    authenticated: true,
    method: "POST",
  });
}

export async function unlikeTrip(publicId: string) {
  return apiRequest<{ liked: false }>(`/api/likes/trips/${publicId}`, {
    authenticated: true,
    method: "DELETE",
  });
}

export async function fetchTripPosts(publicId: string): Promise<TripPost[]> {
  return apiRequest<TripPost[]>(`/api/trips/${publicId}/posts`, {
    authenticated: true,
  });
}

export async function createTripPost(
  publicId: string,
  payload: { body: string; imageUrl?: string },
): Promise<TripPost> {
  return apiRequest<TripPost>(`/api/trips/${publicId}/posts`, {
    authenticated: true,
    body: payload,
    method: "POST",
  });
}

export async function inviteUserToTrip(publicId: string, userId: string) {
  return apiRequest(`/api/trips/${publicId}/invites`, {
    authenticated: true,
    body: { userId },
    method: "POST",
  });
}
