export interface Show {
  show_id: string;
  title: string;
  poster_url: string;
  description: string;
  genre: string;
  release_date: string;
  ranking: string;
}

/**
 * Fetches and parses the shows.csv file
 * @returns {Promise<Show[]>} A promise that resolves to a list of shows
 */
export const fetchShowData = async (): Promise<Show[]> => {
  console.log("fetchShowData called");

  try {
    const response = await fetch("/data/shows.csv");
    console.log("Fetch response status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch show data.");
    }

    const csvText = await response.text();
    console.log("Raw CSV Data:", csvText);

    const parsedData: Show[] = csvText
      .split("\n")
      .slice(1)
      .filter((row) => row.trim().length > 0)
      .map((row) => {
        const [
          show_id,
          title,
          poster_url,
          description,
          genre,
          release_date,
          ranking,
        ] = row.split(",");

        return {
          show_id,
          title,
          poster_url,
          description,
          genre,
          release_date,
          ranking,
        };
      });

    console.log("Parsed Data:", parsedData);
    return parsedData;
  } catch (err) {
    console.error("Error in fetchShowData:", err);
    throw err;
  }
};
/**
 * Retrieves the details of a specific show by show_id
 * @param {string} showId - The ID of the show to retrieve
 * @returns {Promise<Show | undefined>} A promise that resolves to the show details, or undefined if not found
 */
export const getShowById = async (
  showId: string
): Promise<Show | undefined> => {
  console.log("getShowById called with showId:", showId);
  const shows = await fetchShowData();
  console.log("Fetched shows data in getShowById:", shows);

  const foundShow = shows.find((show) => show.show_id === showId);
  console.log("Found show:", foundShow);

  return foundShow;
};
