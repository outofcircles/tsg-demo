
export enum BookingStatus {
  Confirmed = 'Confirmed',
  Pending = 'Pending',
  Cancelled = 'Cancelled',
  Completed = 'Completed'
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  date: string; // YYYY-MM-DD
  time: string;
  guests: number;
  status: BookingStatus;
  notes: string;
  payment: number;
}

export interface PastEvent {
  id: string;
  title: string;
  type: 'Wedding' | 'Corporate' | 'Cultural' | 'Birthday';
  imageUrl: string;
  caption: string;
}

export interface Testimonial {
  id: string;
  name: string;
  eventType: string;
  quote: string;
  avatarUrl: string;
}

export interface StallRegistration {
  id: string;
  vendorName: string;
  stallSize: 'Small' | 'Medium' | 'Large';
  category: string;
  paymentStatus: 'Paid' | 'Unpaid';
  stallNumber: number | null;
}

export interface CampRegistration {
  id: string;
  childName: string;
  age: number;
  activity: string;
  paymentStatus: 'Paid' | 'Unpaid';
}
