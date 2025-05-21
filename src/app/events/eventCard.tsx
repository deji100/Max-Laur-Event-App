"use client";

import { useFavorites } from '../context/FavoritesContext';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '../types';

export default function EventCard({ event }: { event: Event }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="w-[400px] border p-4 rounded-lg shadow-lg overflow-hidden relative">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover rounded-lg"
          width={400}
          height={200}
        />
      </div>
      <Link href={`/events/${event.id}`} className="block">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h2>
      </Link>
      <p className="text-gray-600 mb-2">{event.date}</p>
      <p className="text-gray-600 text-sm">{event.location}</p>

      <button
        onClick={() => toggleFavorite(event.id)}
        className="absolute bottom-2 right-2 text-xl hover:text-red-500"
        title="Favorite"
      >
        {isFavorite(event.id) ? '❤️' : '🤍'}
      </button>
    </div>
  );
}