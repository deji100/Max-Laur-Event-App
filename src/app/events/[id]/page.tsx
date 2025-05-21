import { notFound } from 'next/navigation';
import EventDetailClient from './eventDetailClient';

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

async function fetchEvent(id: string): Promise<Event | null> {
  try {
    const res = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/events/event-with-weather/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Error fetching event:', err);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await fetchEvent(params.id);
  if (!event) return notFound();

  return <EventDetailClient event={event} />;
}
