"use client";

import { useEffect, useState } from "react";
import EventCard from "./events/eventCard";  // Import the EventCard component to display individual events

type Event = {
  id: string;  // Unique event identifier
  title: string;  // Event title
  date: string;  // Event date
  location: string;  // Event location
  image: string;  // Event image URL
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);  // State to store the list of events

  // Fetch events from the server when the component is mounted
  useEffect(() => {
    fetch("/api/events")  // Make an API request to fetch events
      .then((res) => res.json())  // Parse the JSON response
      .then(setEvents);  // Update the state with the fetched events
  }, []);  // Empty dependency array ensures the effect runs only once on mount

  return (
    <main className="w-full p-6 border-b border-gray-200">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <div className="w-full flex flex-wrap gap-4">
        {/* Map through the events and render each one using the EventCard component */}
        {events.map((event) => (
          <EventCard key={event.id} event={event} />  // Pass the event data to the EventCard component
        ))}
      </div>
    </main>
  );
}
