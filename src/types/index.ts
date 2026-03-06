export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  duration: number; // minutes
  description: string;
  image: string;
}

export type ServiceCategory = 'sugaring' | 'manicure' | 'pedicure' | 'brows';

export interface Master {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  specializations: ServiceCategory[];
  experience: string;
  description: string;
}

export interface TimeSlot {
  id: string;
  time: string; // "HH:mm"
  available: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  masterId: string;
}

export interface BookingData {
  serviceId: string | null;
  masterId: string | null;
  date: string | null;
  timeSlot: string | null;
  clientName: string;
  clientPhone: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  schedule: string;
  telegram: string;
  instagram: string;
}
