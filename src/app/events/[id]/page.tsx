'use client'; // Ensures this component is only rendered on the client side

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // For accessing route parameters
import { locationCoords } from '@/app/locationCoords'; // Predefined map of location names to coordinates
import { useFavorites } from '../../context/FavoritesContext'; // Custom hook for managing favorite events

// Define the expected shape of an event
type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
};

// Mapping of weather codes to human-readable descriptions and emojis/icons
const weatherDescriptions: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Depositing rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  61: { label: 'Light rain', icon: '🌧️' },
  71: { label: 'Light snow', icon: '🌨️' },
  80: { label: 'Rain showers', icon: '🌦️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
};

export default function EventDetailPage() {
  const { id } = useParams(); // Get event ID from the route
  const [event, setEvent] = useState<Event | null>(null); // Stores the loaded event
  const [weather, setWeather] = useState<{
    temperature: string;
    wind: string;
    description: string;
    icon: string;
  } | null>(null); // Stores the weather details for the event's location
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState(false); // Tracks error state
  const { toggleFavorite, isFavorite } = useFavorites(); // Get favorite handlers from context

  // Fetch the event data and corresponding weather info when the component loads
  useEffect(() => {
    async function fetchEventAndWeather() {
      try {
        // Fetch all events and find the one matching the route ID
        const res = await fetch('/api/events');
        const events: Event[] = await res.json();
        const found = events.find(e => e.id === id);
        if (!found) {
          setError(true);
          return;
        }
        setEvent(found);

        // Get coordinates for the event's location and fetch current weather
        const coords = locationCoords[found.location];
        if (coords) {
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weathercode,windspeed_10m`
          );
          const weatherData = await weatherRes.json();
          const code = weatherData.current.weathercode;
          const descObj = weatherDescriptions[code] || { label: 'Unknown', icon: '❓' };

          setWeather({
            temperature: `${weatherData.current.temperature_2m}°C`,
            wind: `${weatherData.current.windspeed_10m} km/h`,
            description: descObj.label,
            icon: descObj.icon,
          });
        } else {
          setWeather(null); // No weather info available for location
        }
      } catch (err) {
        console.error('Error fetching event or weather:', err);
        setError(true);
      } finally {
        setLoading(false); // Stop loading in either case
      }
    }

    fetchEventAndWeather();
  }, [id]);

  // Render loading, error, or the detailed event page
  if (loading) return <p className="p-6">Loading...</p>;
  if (error || !event) return <p className="p-6 text-red-500">Event not found or failed to load.</p>;

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-72 object-cover"
          />
          {/* Button to toggle favorite state */}
          <button
            onClick={() => toggleFavorite(event.id)}
            className="absolute top-4 right-4 text-3xl transition hover:scale-110"
            title="Toggle Favorite"
          >
            {isFavorite(event.id) ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-semibold mb-2 text-gray-800">{event.title}</h1>
          <div className="text-gray-600 mb-3 space-y-1">
            <p>📅 <span className="font-medium">{event.date}</span></p>
            <p>📍 <span className="font-medium">{event.location}</span></p>
          </div>

          {/* Display weather info if available */}
          {weather ? (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xl mb-1">
                {weather.icon} <span className="font-semibold">{weather.description}</span>
              </p>
              <p>🌡️ Temperature: <span className="font-medium">{weather.temperature}</span></p>
              <p>💨 Wind Speed: <span className="font-medium">{weather.wind}</span></p>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">🌤️ Weather info unavailable for this location.</p>
          )}

          {/* Display event description */}
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>
      </div>
    </div>
  );
}
