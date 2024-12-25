import { Show } from "../types/Show";

/**
 * Filter shows based on the search query.
 * @param shows - List of shows to search.
 * @param query - Search query string.
 * @returns Filtered list of shows.
 */
export const filterShows = (shows: Show[], query: string): Show[] => {
  if (!query.trim()) {
    return shows;
  }

  const lowerCaseQuery = query.toLowerCase();

  return shows.filter(
    (show) =>
      show.title.toLowerCase().includes(lowerCaseQuery) ||
      show.description.toLowerCase().includes(lowerCaseQuery) ||
      show.genre.toLowerCase().includes(lowerCaseQuery)
  );
};
