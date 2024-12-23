export interface Show {
  show_id: number; // 쇼 ID
  title: string; // 제목
  genre: string; // 장르
  description: string; // 설명
  poster_url: string; // 포스터 이미지 경로
  release_date: string; // 공연 날짜
  ranking: number; // 순위
  price: {
    regular: string; // 일반 좌석 가격
    vip: string; // VIP 좌석 가격
  };
  seats: {
    regular: number; // 남은 일반 좌석 수
    vip: number; // 남은 VIP 좌석 수
  };
}