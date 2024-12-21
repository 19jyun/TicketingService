export interface Show {
  show_id: string;         // 고유 ID (문자열로 처리)
  title: string;           // 쇼 제목
  poster_url: string;      // 포스터 이미지 경로
  description: string;     // 쇼 설명
  genre: string;           // 쇼 장르
  release_date: string;    // 출시일 (ISO 형식 문자열)
  ranking: number;         // 랭킹 (숫자)
}
