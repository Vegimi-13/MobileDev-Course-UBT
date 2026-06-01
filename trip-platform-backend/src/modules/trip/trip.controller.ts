//ne kontroller i shtijm funksionet qe kane te bejne me requests dhe responses


import { Request, Response } from "express"
import {
  createTripPostSchema,
  createTripSchema,
  getPublicTripsFilterSchema,
  inviteTripUserSchema,
} from "./trip.validation"
import * as service from "./trip.service"
import { TripServiceError } from "./trip.service";
import { verifyAccessToken } from "../../utils/jwt";

const getOptionalViewerId = (req: Request) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;

  if (!token) {
    return undefined;
  }

  try {
    return verifyAccessToken(token).userId;
  } catch {
    return undefined;
  }
};

export const createTrip = async (req: Request, res: Response) => {
  try {
    const data = createTripSchema.parse(req.body);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const trip = await service.createTrip(userId, data);

    res.status(201).json(trip);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getPublicTrips = async (_req: Request, res: Response) => {
  try {
    const rawCategoryId =
      typeof _req.query.categoryId === "string" ? _req.query.categoryId : undefined;
    const rawTags = typeof _req.query.tags === "string" ? _req.query.tags : undefined;

    const parsedFilters = getPublicTripsFilterSchema.parse({
      categoryId: rawCategoryId,
      tags: rawTags
        ? rawTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined,
    });

    const trips = await service.getPublicTrips(
      parsedFilters,
      getOptionalViewerId(_req),
    );

    res.json(trips);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTripByPublicId = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    const { publicId } = req.params;

    const trip = await service.getTripByPublicId(
      publicId,
      getOptionalViewerId(req),
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyTrips = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const trips = await service.getMyTrips(req.user.id);

    res.json(trips);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const joinTrip = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const participant = await service.joinTrip(req.user.id, req.params.publicId);

    res.status(201).json(participant);
  } catch (err: any) {
    if (err instanceof TripServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

export const getPendingJoinRequests = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const requests = await service.getPendingJoinRequests(
      req.user.id,
      req.params.publicId,
    );

    res.json(requests);
  } catch (err: any) {
    if (err instanceof TripServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

export const approveJoinRequest = async (
  req: Request<{ publicId: string; userId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const participant = await service.approveJoinRequest(
      req.user.id,
      req.params.publicId,
      req.params.userId,
    );

    res.json(participant);
  } catch (err: any) {
    if (err instanceof TripServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

export const declineJoinRequest = async (
  req: Request<{ publicId: string; userId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const participant = await service.declineJoinRequest(
      req.user.id,
      req.params.publicId,
      req.params.userId,
    );

    res.json(participant);
  } catch (err: any) {
    if (err instanceof TripServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

export const getTripPosts = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const posts = await service.getTripPosts(req.user.id, req.params.publicId);
    res.json(posts);
  } catch (err: any) {
    if (err instanceof TripServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

export const createTripPost = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = createTripPostSchema.parse(req.body);
    const post = await service.createTripPost(
      req.user.id,
      req.params.publicId,
      data,
    );
    res.status(201).json(post);
  } catch (err: any) {
    if (err instanceof TripServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(400).json({ message: err.message });
  }
};

export const inviteUserToTrip = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = inviteTripUserSchema.parse(req.body);
    const participant = await service.inviteUserToTrip(
      req.user.id,
      req.params.publicId,
      data.userId,
    );
    res.status(201).json(participant);
  } catch (err: any) {
    if (err instanceof TripServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(400).json({ message: err.message });
  }
};

export const acceptTripInvite = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const participant = await service.acceptTripInvite(
      req.user.id,
      req.params.publicId,
    );
    res.json(participant);
  } catch (err: any) {
    if (err instanceof TripServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

export const declineTripInvite = async (
  req: Request<{ publicId: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const participant = await service.declineTripInvite(
      req.user.id,
      req.params.publicId,
    );
    res.json(participant);
  } catch (err: any) {
    if (err instanceof TripServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};
