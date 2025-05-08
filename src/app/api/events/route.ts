import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Define paths to the data directory and files
const dataDir = path.join(process.cwd(), 'data');
const seedFile = path.join(dataDir, 'events.json');         // Seed file containing initial data
const dataFile = path.join(dataDir, 'all_events.json');     // Actual working data file

// Helper function to ensure the working data file exists.
// If it doesn't, it creates it from the seed file.
async function ensureDataFile() {
  try {
    await fs.access(dataFile); // Check if data file exists
  } catch {
    const seed = await fs.readFile(seedFile, 'utf-8'); // Read seed data
    await fs.writeFile(dataFile, seed); // Write seed data to new data file
  }
}

// GET handler for reading all events from the data file
export async function GET() {
  await ensureDataFile(); // Ensure file exists before reading
  const json = await fs.readFile(dataFile, 'utf-8'); // Read contents
  const events = JSON.parse(json); // Parse JSON into array
  return NextResponse.json(events); // Return as JSON response
}

// POST handler for adding a new event to the data file
export async function POST(request: Request) {
  await ensureDataFile(); // Ensure file exists before updating
  const newEvent = await request.json(); // Read new event from request body
  const json = await fs.readFile(dataFile, 'utf-8'); // Read current data
  const events = JSON.parse(json); // Parse existing events
  events.push(newEvent); // Add new event to array
  await fs.writeFile(dataFile, JSON.stringify(events, null, 2)); // Write updated data back
  return NextResponse.json({ success: true }); // Return success response
}
