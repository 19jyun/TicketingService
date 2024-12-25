export interface Show {
  show_id: number; 
  title: string;
  genre: string; 
  description: string; 
  poster_url: string; 
  release_date: string; 
  ranking: number; 
  price: {
    regular: string; 
    vip: string; 
  };
  seats: {
    regular: number; 
    vip: number;
  };
}