export interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'standard' | 'deluxe' | 'suite' | 'penthouse';
  capacity: number;
  amenities: string[];
  images: string[];
  availability: boolean;
  rating: number;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  roomTitle: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}
