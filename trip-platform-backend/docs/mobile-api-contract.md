# Mobile API Contract Notes

Updated on 2026-05-31 for the Expo mobile app.

## User profile

- `PATCH /api/users/me` updates the authenticated user's editable profile fields.
- Accepted body fields: `firstName`, `lastName`, `username`, `bio`, `avatarUrl`.
- `bio` and `avatarUrl` are nullable columns on `User`.
- `username` remains unique; updates fail when another user already owns it.

## Trip likes

- `POST /api/likes/trips/:publicId` likes a trip for the authenticated user.
- `DELETE /api/likes/trips/:publicId` removes the authenticated user's trip like.
- `GET /api/likes/trips/:publicId/status` returns `{ liked, likesCount }`.
- Public trip list/detail responses include `_count.likes`; when the request has a valid bearer token they also include a scoped `likes` array for the current viewer so the mobile app can map `liked`.

## Trip covers

- `Trip.coverImageUrl` stores the image used by mobile Home, Explore, Profile, and Create Trip screens.
- `POST /api/trips` accepts `coverImageUrl`, `categoryName`, and `tags`.

## Trip detail feed and invites

- `TripPost` stores feed posts inside each trip with `body`, optional `imageUrl`, `tripId`, and `authorId`.
- `GET /api/trips/:publicId/posts` returns the authenticated viewer's accessible trip feed.
- `POST /api/trips/:publicId/posts` creates a feed post for the owner or an accepted member.
- `POST /api/trips/:publicId/invites` invites a user by `userId`, creates a pending participant, and sends a `TRIP_INVITE` notification.
- `GET /api/users/search?q=` searches users in the app, excluding the authenticated user, for invite suggestions.
