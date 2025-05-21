// Import types and response utilities from Next.js server module
import { NextRequest, NextResponse } from "next/server";

// Import Node.js modules for handling paths and file system operations
import path from "path";
import fs from "fs/promises";

// Import hardcoded location coordinates
import { locationCoords } from "@/app/locationCoords";

export const runtime = 'nodejs'

// Define paths for the data directory and files
const dataDir = path.join(process.cwd(), "data");
const seedFile = path.join(dataDir, "events.json");      // seed file with initial events data
const dataFile = path.join(dataDir, "all_events.json");  // persistent file for all events

// Ensures that the persistent data file exists; if not, copies it from the seed file
async function ensureDataFile() {
  try {
    await fs.access(dataFile); // Check if dataFile exists
  } catch {
    // If it doesn't exist, copy contents from seed file
    const seed = await fs.readFile(seedFile, "utf-8");
    await fs.writeFile(dataFile, seed);
  }
}

// Mapping of weather codes to human-readable descriptions and icons
const weatherDescriptions: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Depositing rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  61: { label: "Light rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  80: { label: "Rain showers", icon: "🌦️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
};

// Define the GET request handler
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
    // context: { params: { id: string } }
) {
  // Ensure the events data file exists
  await ensureDataFile();

  const { id } = await params; // Extract event ID from route parameters

  // Read all events data
  const json = await fs.readFile(dataFile, "utf-8");
  const events = JSON.parse(json);

  // Find the specific event by ID
  const event = events.find((e: any) => e.id === id);

  // Return 404 if the event is not found
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Get coordinates from hardcoded location map
  let coords = locationCoords[event.location];

  // Fallback to OpenCage API if coordinates are not predefined
  if (!coords) {
    const apiKey = process.env.OPENCAGE_API_KEY; // Read API key from environment
    if (!apiKey) {
      console.error("Missing OpenCage API key in environment");
      return NextResponse.json(
        { error: "Server misconfiguration: missing API key" },
        { status: 500 }
      );
    }

    try {
      // Make a geocoding API request to get coordinates for the event's location
      const geoRes = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          event.location
        )}&key=${apiKey}`
      );
      const geoData = await geoRes.json();

      // Extract the first result's coordinates
      const firstResult = geoData.results?.[0];
      if (firstResult?.geometry) {
        coords = {
          lat: firstResult.geometry.lat,
          lon: firstResult.geometry.lng,
        };
      }
    } catch (err) {
      console.error("OpenCage geocoding error:", err);
    }
  }

  let weather = null;

  // If coordinates were successfully resolved
  if (coords) {
    try {
      // Fetch current weather data for the coordinates
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weathercode,windspeed_10m`
      );
      const weatherData = await weatherRes.json();

      // Interpret the weather code into description and icon
      const code = weatherData.current?.weathercode;
      const desc = weatherDescriptions[code] || {
        label: "Unknown",
        icon: "❓",
      };

      // Construct weather info to send to frontend
      weather = {
        temperature: `${weatherData.current.temperature_2m}°C`,
        wind: `${weatherData.current.windspeed_10m} km/h`,
        description: desc.label,
        icon: desc.icon,
      };
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
  }

  // Respond with the event data, including the weather information if available
  return NextResponse.json({ ...event, weather });
}
