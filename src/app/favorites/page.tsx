'use client';

import { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';  // Custom hook to access favorite events
import EventCard from '../events/eventCard';  // EventCard component for displaying individual events

type Event = {
  id: string;  // Unique event identifier
  title: string;  // Event title
  date: string;  // Event date
  location: string;  // Event location
  description: string;  // Event description
  image: string;  // Event image URL
};

export default function FavoritesPage() {
  const { favorites } = useFavorites();  // Access favorite events from context
  const [allEvents, setAllEvents] = useState<Event[]>([]);  // State to store all events
  const [loading, setLoading] = useState(true);  // State to track loading status

  // Fetch events from the server when the component is mounted
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');  // Fetch all events from the API
        const data: Event[] = await res.json();  // Parse the response as an array of events
        setAllEvents(data);  // Update state with the fetched events
      } catch (error) {
        console.error('Failed to load events:', error);  // Log any error that occurs
      } finally {
        setLoading(false);  // Set loading state to false after fetching is done
      }
    }

    fetchEvents();  // Call the fetch function on component mount
  }, []);  // Empty dependency array means this effect runs once on mount

  // Filter events to show only those marked as favorites
  const favoriteEvents = allEvents.filter(event => favorites.includes(event.id));

  // Show loading message while events are being fetched
  if (loading) return <p className="p-6">Loading favorites...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">❤️ Favorite Events</h1>
      {/* Display message if no favorite events are found */}
      {favoriteEvents.length === 0 ? (
        <p className="text-gray-600">You haven’t favorited any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Map over favorite events and display them using EventCard component */}
          {favoriteEvents.slice().reverse().map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}