import axios from "axios";

// API 엔드포인트
const BASE_URL = "http://localhost:5000/api"; // 실제 백엔드 URL에 맞게 변경

/**
 * 관심도 업데이트 함수
 * @param username 현재 로그인된 유저 이름
 * @param genre 장르 이름
 * @param action 검색(`search`) 또는 예약(`reservation`) 중 하나
 * @returns 서버 응답 객체 또는 오류
 */
export const updateInterest = async (
  username: string,
  genre: string,
  action: "search" | "reservation"
): Promise<{
  success: boolean;
  message: string;
  interest?: Record<string, number>;
}> => {
  try {
    // 관심도 업데이트 요청 전송
    const response = await axios.post(`${BASE_URL}/users/interest`, null, {
      params: {
        username,
        genre,
        action,
      },
    });

    console.log(`Successfully updated interest for user: ${username}`);
    return response.data; // 서버에서 반환된 데이터
  } catch (error: any) {
    console.error("Error updating interest:", error);
    return {
      success: false,
      message: error.response?.data?.error || "An unknown error occurred.",
    };
  }
};
