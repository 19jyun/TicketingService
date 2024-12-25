export interface Reservation {
  reservation_id: string;
  user_id: string;
  show_id: number;
  seat_type: "regular" | "vip";
  seat_count: number;
  price: number;
  date: string;
}
