import EventCard from "./events/eventCard"; // Component to render individual event cards
import { Event } from "./types"; // Type definition for event data

// Asynchronous function to fetch events from the API
async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(
    `${process.env.BASE_URL || "http://localhost:3000"}/api/events`,
    {
      cache: "no-store", // Disable caching to ensure fresh data on each request
    }
  );

  // If the response is not successful, throw an error
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  // Parse and return the JSON data from the response
  return res.json();
}

// Server component for the homepage that lists all upcoming events
export default async function Home() {
  // Fetch the event data from the API
  const events = await fetchEvents();

  return (
    <main className="w-full p-6 border-b border-gray-200">
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>

      {/* 
        Render a grid of event cards.
        Use slice().reverse() to:
        1. Create a shallow copy of the events array to avoid mutating original data.
        2. Reverse the order so that the most recently added events appear first.
      */}
      <div className="w-full flex flex-wrap gap-4">
        {events
          .slice() // Clone array to avoid side-effects
          .reverse() // Show latest event first
          .map((event) => (
            <EventCard key={event.id} event={event} /> // Render each event using the EventCard component
          ))}
      </div>
    </main>
  );
}
