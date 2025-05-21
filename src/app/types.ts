export type Weather = {
  temperature: string; // Current temperature
  wind: string; // Current wind speed
  description: string; // Weather description
  icon: string; // Weather icon
};

export type Event = {
  id: string; // Unique event identifier
  title: string; // Event title
  date: string; // Event date
  location: string; // Event location
  image: string; // Event image URL
  description: string; // Event description
};

export type EventCardProps = {
  event: Event; // Event data to be displayed in the card
};