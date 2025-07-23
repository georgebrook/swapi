import type { Character } from '../types/Character';

export const fetchSuggestions = async (query: string): Promise<Character[]> => {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) return [];

  try {
    const response = await fetch(`https://swapi.py4e.com/api/people/?search=${encodeURIComponent(trimmedQuery)}`);

    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText);
      return [];
    }

    const data = await response.json();

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
