export interface Reservation {
  reservation_id: string; // 예약 ID
  user_id: string; // 사용자 ID
  show_id: number; // 쇼 ID
  seat_type: "regular" | "vip"; // 좌석 유형
  seat_count: number; // 좌석 수
  price: number; // 총 가격
  date: string; // 예약 날짜
}
