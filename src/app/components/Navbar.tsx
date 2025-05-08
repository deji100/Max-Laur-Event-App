'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold hover:underline">
        Event Platform
      </Link>

      <div className="space-x-4">
        <Link
          href="/"
          className={`hover:underline ${pathname === '/' ? 'underline font-semibold' : ''}`}
        >
          Home
        </Link>
        <Link
          href="/favorites"
          className={`hover:underline ${pathname === '/favorites' ? 'underline font-semibold' : ''}`}
        >
          Favorites
        </Link>
        <Link
          href="/events/create"
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 font-semibold"
        >
          Create Event
        </Link>
      </div>
    </nav>
  );
}
