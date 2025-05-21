'use client'; // Ensures this file is executed on the client side only

import { createContext, useContext, useEffect, useState } from 'react';

// Define a type alias for favorite items, which are just event IDs
export type Favorite = string; // event ID

// Interface that describes the shape of the context value
interface FavoritesContextType {
  favorites: Favorite[];                  // List of favorite event IDs
  toggleFavorite: (id: string) => void;   // Function to add/remove favorite
  isFavorite: (id: string) => boolean;    // Function to check if an event is a favorite
}

// Create the context with an undefined initial value
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Provider component to wrap around parts of the app that need access to favorites
export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]); // State to track favorite event IDs

  // On component mount, load favorites from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Whenever favorites change, persist the new list to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggles a favorite: adds it if not present, removes it if already favorited
  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  // Checks whether a given event ID is currently favorited
  const isFavorite = (id: string) => favorites.includes(id);

  // Provide favorites state and functions to child components
  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to access the FavoritesContext, ensures it's used inside the provider
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};