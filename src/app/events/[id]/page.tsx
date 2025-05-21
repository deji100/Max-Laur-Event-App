'use client'; // Enables client-side rendering in Next.js App Router

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Hook to extract route parameters
import { useFavorites } from '../../context/FavoritesContext'; // Custom hook to manage favorite events

// Type definition for weather information
type Weather = {
  temperature: string;
  wind: string;
  description: string;
  icon: string;
};

// Type definition for event object
type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  weather?: Weather; // Weather info is optional
};

export default function EventDetailPage() {
  const { id } = useParams(); // Get event ID from route parameters
  const [event, setEvent] = useState<Event | null>(null); // Holds the fetched event
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(false); // Error state
  const { toggleFavorite, isFavorite } = useFavorites(); // Favorite logic from context

  // Fetch event details on component mount or when the ID changes
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/event-with-weather/${id}`); // Fetch event with weather data
        if (!res.ok) throw new Error('Failed to fetch'); // Handle bad responses
        const data = await res.json(); // Parse response
        setEvent(data); // Store event in state
      } catch (err) {
        console.error('Error fetching event:', err); // Log error for debugging
        setError(true); // Trigger error UI
      } finally {
        setLoading(false); // Disable loading spinner
      }
    }

    fetchEvent(); // Call the fetch function
  }, [id]);

  // Show loading UI
  if (loading) return <p className="p-6">Loading...</p>;

  // Show error message if event fails to load or doesn't exist
  if (error || !event) return <p className="p-6 text-red-500">Event not found or failed to load.</p>;

  // Render the event detail UI
  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Event Image and Favorite Button */}
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-72 object-cover"
          />
          {/* Toggle favorite icon */}
          <button
            onClick={() => toggleFavorite(event.id)}
            className="absolute top-4 right-4 text-3xl transition hover:scale-110"
            title="Toggle Favorite"
          >
            {isFavorite(event.id) ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Event Info Section */}
        <div className="p-6">
          <h1 className="text-3xl font-semibold mb-2 text-gray-800">{event.title}</h1>
          <div className="text-gray-600 mb-3 space-y-1">
            <p>📅 <span className="font-medium">{event.date}</span></p>
            <p>📍 <span className="font-medium">{event.location}</span></p>
          </div>

          {/* Weather Info Block */}
          {event.weather ? (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xl mb-1">
                {event.weather.icon} <span className="font-semibold">{event.weather.description}</span>
              </p>
              <p>🌡️ Temperature: <span className="font-medium">{event.weather.temperature}</span></p>
              <p>💨 Wind Speed: <span className="font-medium">{event.weather.wind}</span></p>
            </div>
          ) : (
            // Show fallback message if weather data is not available
            <p className="text-gray-500 mb-4">🌤️ Weather info unavailable for this location.</p>
          )}

          {/* Event Description */}
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>
      </div>
    </div>
  );
}
