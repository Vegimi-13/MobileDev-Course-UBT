import { Trip } from "../models/trip";

const sampleTrips: Trip[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60",
    host: "Maya Patel",
    title: "Santorini & Mykonos",
    location: "Greece",
    date: "May 10 - May 20, 2025",
    tags: ["beach", "luxury", "romance"],
    likes: 641,
    joined: "5/8 joined",
    spotsLeft: 3,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60",
    host: "Alex Chen",
    title: "Bali Escape",
    location: "Bali, Indonesia",
    date: "Jul 15 - Jul 28, 2025",
    tags: ["beach", "nature"],
    likes: 247,
    joined: "4/12 joined",
    spotsLeft: 8,
  },
];

export async function fetchTrips(): Promise<Trip[]> {
  // Simulate a network request; replace with real API call later.
  return new Promise((resolve) => setTimeout(() => resolve(sampleTrips), 500));
}
