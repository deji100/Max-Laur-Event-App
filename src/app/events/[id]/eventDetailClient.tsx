'use client';

import { useFavorites } from '../../context/FavoritesContext';

type Weather = {
  temperature: string;
  wind: string;
  description: string;
  icon: string;
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  weather?: Weather;
};

export default function EventDetailClient({ event }: { event: Event }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="relative">
          <img src={event.image} alt={event.title} className="w-full h-72 object-cover" />
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

          {event.weather ? (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xl mb-1">
                {event.weather.icon} <span className="font-semibold">{event.weather.description}</span>
              </p>
              <p>🌡️ Temperature: <span className="font-medium">{event.weather.temperature}</span></p>
              <p>💨 Wind Speed: <span className="font-medium">{event.weather.wind}</span></p>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">🌤️ Weather info unavailable for this location.</p>
          )}

          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>
      </div>
    </div>
  );
}
