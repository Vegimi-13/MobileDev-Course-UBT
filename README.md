# Trip Platform

Trip Platform is a mobile-first travel planning app with an Express/Prisma backend and an Expo React Native frontend. The app is centered on trips: users can create trips, discover public trips, join open trips, request approval for closed trips, invite people, accept or decline invites, like trips, post in trip feeds, and receive notifications.

## Project Structure

```text
trip-platform/
  trip-platform-backend/   Express API, Prisma schema, PostgreSQL access
  trip-platform-mobile/    Expo React Native mobile app
```

## Main Features

- Authentication: register, login, token storage, logout.
- Trip creation: title, destination, calendar-based start/end dates, visibility, join policy, member limit, category, tags, and cover image selection.
- Public discovery: browse public trips, filter by status/category/access, search by trip or destination.
- Joining trips: open trips become `Joined`; approval trips become `Requested`.
- Invitations: trip members can invite users; recipients can accept or decline from Alerts.
- Notifications: invite/join/like style notifications, unread badge, mark all read.
- Trip detail: trip summary, organizer, stats, join/invite actions, trip feed posts.
- Profile: editable profile, trip list, and gallery from real trip cover images.
- Media/photo modules exist on the backend, but native gallery upload and Cloudinary are not fully wired yet.

## Backend Setup

From `trip-platform-backend`:

```bash
npm install
```

Create an `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/trip_platform"
JWT_ACCESS_SECRET="change-me-access"
JWT_REFRESH_SECRET="change-me-refresh"
PORT=3000
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start the API:

```bash
npm run dev
```

The API defaults to:

```text
http://localhost:3000
```

## Mobile Setup

From `trip-platform-mobile`:

```bash
npm install
```

If the API is not on `http://localhost:3000`, set:

```env
EXPO_PUBLIC_API_URL="http://YOUR_API_HOST:3000"
```

Start Expo:

```bash
npm start
```

Then open the app with Expo Go or an emulator.

Note: `npm run web` currently needs `react-native-web` installed before Expo web can run.

## Useful Commands

Backend typecheck:

```bash
cd trip-platform-backend
npx tsc --noEmit
```

Mobile typecheck:

```bash
cd trip-platform-mobile
npx tsc --noEmit
```

Backend build:

```bash
cd trip-platform-backend
npm run build
```

## Important API Areas

- `POST /api/auth/register` creates a user.
- `POST /api/auth/login` returns access/refresh tokens.
- `GET /api/users/me` gets the current profile.
- `PATCH /api/users/me` updates profile fields.
- `GET /api/users/search?q=name` searches users for invites.
- `POST /api/trips` creates a trip.
- `GET /api/trips/public` lists public trips.
- `GET /api/trips/me` lists trips owned or joined by the current user.
- `GET /api/trips/:publicId` gets a trip.
- `POST /api/trips/:publicId/join` joins or requests to join.
- `POST /api/trips/:publicId/invites` invites a user.
- `PATCH /api/trips/:publicId/invites/accept` accepts an invite.
- `PATCH /api/trips/:publicId/invites/decline` declines an invite.
- `GET /api/notifications/me` lists notifications.
- `PATCH /api/notifications/:notificationId/read` marks one notification read.
- `PATCH /api/notifications/read-all` marks all notifications read.

## Trip Join Rules

- `OPEN` trips accept users immediately.
- `APPROVAL` trips create a pending request.
- Invited users can accept or decline from Alerts.
- The app shows `Join`, `Joined`, or `Requested` instead of separate follow behavior.
- Accepted participants count toward member limits; pending requests do not.

## Notes On Follow/Social

The active mobile app no longer exposes trip following or profile followers/following. The backend Prisma schema still contains the old `Follow` model for compatibility, but the `/api/follows` route is not mounted in the current app.

## Notes On Photos And Cloudinary

The backend already has media/photo modules and trip cover URLs. A complete native photo upload flow should be added as a separate pass:

- Add an Expo image picker dependency.
- Let users choose a local image from their library.
- Upload to Cloudinary or the backend media endpoint.
- Store the returned URL as a trip cover, profile avatar, photo, or post image.
- Show upload progress and errors in the mobile UI.

Until then, the app avoids fake upload buttons and only shows image controls that are actually wired.

## Current Design Direction

The mobile UI uses a warm travel palette:

- Paper background: `#FBF4EC`
- Primary orange: `#FF6535`
- Mint accent: `#12CFA0`
- Main text: `#17172B`
- Muted text: `#667085` / `#98A2B3`

Login/register, home, explore, create trip, alerts, trip detail, and profile now follow this same visual direction.
