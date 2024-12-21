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
  console.log("fetchShowData called"); // 호출 여부 확인

  try {
    const response = await fetch("/data/shows.csv");
    console.log("Fetch response status:", response.status); // 응답 상태 확인

    if (!response.ok) {
      throw new Error("Failed to fetch show data.");
    }

    const csvText = await response.text();
    console.log("Raw CSV Data:", csvText); // 원본 CSV 데이터 출력

    const parsedData: Show[] = csvText
      .split("\n")
      .slice(1) // 헤더 제거
      .filter((row) => row.trim().length > 0) // 빈 줄 제거
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

    console.log("Parsed Data:", parsedData); // 파싱된 데이터 출력
    return parsedData;
  } catch (err) {
    console.error("Error in fetchShowData:", err); // 에러 로그
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
  console.log("getShowById called with showId:", showId); // 디버깅 로그
  const shows = await fetchShowData();
  console.log("Fetched shows data in getShowById:", shows); // 전체 데이터 출력

  const foundShow = shows.find((show) => show.show_id === showId);
  console.log("Found show:", foundShow); // 찾은 데이터 출력

  return foundShow;
};
