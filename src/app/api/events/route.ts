import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const dataDir = path.resolve(process.cwd(), 'data');
const seedFile = path.join(dataDir, 'events.json');
const dataFile = path.join(dataDir, 'all_events.json');

/**
 * Reads and parses a JSON file safely.
 */
async function readJSONFile(filePath: string): Promise<any> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to read or parse JSON file: ${filePath}`, error);
    return null;
  }
}

/**
 * Writes JSON data to a file with formatting.
 */
async function writeJSONFile(filePath: string, data: any) {
  try {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content);
  } catch (error) {
    console.error(`Failed to write to JSON file: ${filePath}`, error);
    throw new Error('Failed to write data');
  }
}

/**
 * Ensures that the data file exists by copying from the seed file if missing.
 */
async function ensureDataFileExists() {
  try {
    await fs.access(dataFile);
  } catch {
    const seedData = await readJSONFile(seedFile);
    if (seedData === null) throw new Error('Seed file is corrupted or missing');
    await writeJSONFile(dataFile, seedData);
  }
}

export async function GET() {
  try {
    await ensureDataFileExists();
    const events = await readJSONFile(dataFile);
    return events
      ? NextResponse.json(events)
      : NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
  } catch (error) {
    console.error('GET /events error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

