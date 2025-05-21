import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

// Define the uploads directory and events data file path
const uploadsDir = path.join(process.cwd(), 'public/uploads');
const eventsPath = path.join(process.cwd(), 'data/all_events.json');

// Handle POST request to create a new event with image upload
export async function POST(req: Request) {
  try {
    // Parse form data from the incoming request
    const formData = await req.formData();

    // Extract fields and the uploaded file
    const title = formData.get('title');
    const date = formData.get('date');
    const location = formData.get('location');
    const description = formData.get('description');
    const file = formData.get('image') as File;

    // Check if a valid file was uploaded
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // Convert the uploaded file to a buffer and save it to disk with a unique filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}_${file.name}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);

    // Construct the event object with image path and UUID
    const event = {
      id: uuidv4(),
      title,
      date,
      location,
      description,
      image: `/uploads/${filename}`,
    };

    // Read existing events from file (or initialize empty array if file doesn't exist)
    const data = fs.existsSync(eventsPath)
      ? JSON.parse(fs.readFileSync(eventsPath, 'utf-8'))
      : [];

    // Append the new event to the list and save it back to the file
    data.push(event);
    fs.writeFileSync(eventsPath, JSON.stringify(data, null, 2));

    // Respond with success and the new event data
    return NextResponse.json({ success: true, event });

  } catch (err: any) {
    // Handle unexpected errors during processing
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}