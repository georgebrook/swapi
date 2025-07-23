import type { Character } from '../types/Character';

export const fetchSuggestions = async (query: string): Promise<Character[]> => {
  const trimmedQuery = query.trim();

  // Ignore queries shorter than 2 characters after trimming
  if (trimmedQuery.length < 2) return [];

  try {
    // Safely encode query parameter
    const response = await fetch(`https://swapi.py4e.com/api/people/?search=${encodeURIComponent(trimmedQuery)}`);

    // Check if response is OK (status 200-299)
    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText);
      return [];
    }

    const data = await response.json();

    // Make sure results exist and are an array
    if (!Array.isArray(data.results)) {
      console.warn('Unexpected API response structure:', data);
      return [];
    }

    return data.results as Character[];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};
