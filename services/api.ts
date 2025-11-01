import { Booking, BookingStatus, PastEvent, Testimonial, StallRegistration, CampRegistration } from '../types';

// --- MOCK DATABASE ---
let bookings: Booking[] = [
  { id: 'B001', clientName: 'Alice Johnson', clientEmail: 'alice@example.com', eventType: 'Wedding', date: '2024-08-15', time: '14:00', guests: 150, status: BookingStatus.Confirmed, notes: 'Needs a vegetarian menu.', payment: 5000 },
  { id: 'B002', clientName: 'Bob Williams', clientEmail: 'bob@example.com', eventType: 'Corporate Event', date: '2024-08-20', time: '10:00', guests: 200, status: BookingStatus.Confirmed, notes: 'Requires projector and screen.', payment: 7500 },
  { id: 'B003', clientName: 'Charlie Brown', clientEmail: 'charlie@example.com', eventType: 'Birthday Party', date: '2024-09-01', time: '18:00', guests: 50, status: BookingStatus.Pending, notes: 'Wants a DJ.', payment: 0 },
  { id: 'B004', clientName: 'Diana Prince', clientEmail: 'diana@example.com', eventType: 'Cultural Fest', date: '2024-07-28', time: '12:00', guests: 300, status: BookingStatus.Completed, notes: 'Outdoor stage setup.', payment: 10000 },
  { id: 'B005', clientName: 'Ethan Hunt', clientEmail: 'ethan@example.com', eventType: 'Wedding', date: '2024-09-10', time: '15:00', guests: 120, status: BookingStatus.Confirmed, notes: 'Floral arrangements are key.', payment: 6000 },
  { id: 'B006', clientName: 'Fiona Glenanne', clientEmail: 'fiona@example.com', eventType: 'Corporate Event', date: '2024-08-22', time: '09:00', guests: 80, status: BookingStatus.Cancelled, notes: 'Cancelled due to budget cuts.', payment: 0 },
  { id: 'B007', clientName: 'George Costanza', clientEmail: 'george@example.com', eventType: 'Birthday Party', date: '2024-09-05', time: '19:00', guests: 30, status: BookingStatus.Pending, notes: '', payment: 0 },
];

const pastEvents: PastEvent[] = [
  { id: 'PE01', title: 'Smith & Jones Wedding', type: 'Wedding', imageUrl: 'https://picsum.photos/600/400?random=1', caption: 'A beautiful summer wedding.' },
  { id: 'PE02', title: 'TechCorp Annual Summit', type: 'Corporate', imageUrl: 'https://picsum.photos/600/400?random=2', caption: 'A successful gathering of industry leaders.' },
  { id: 'PE03', title: 'Festival of Lights', type: 'Cultural', imageUrl: 'https://picsum.photos/600/400?random=3', caption: 'A vibrant celebration of culture.' },
  { id: 'PE04', title: 'Leo\'s 10th Birthday Bash', type: 'Birthday', imageUrl: 'https://picsum.photos/600/400?random=4', caption: 'A fun-filled day for the kids.' },
  { id: 'PE05', title: 'Innovate Conference 2023', type: 'Corporate', imageUrl: 'https://picsum.photos/600/400?random=5', caption: 'Sharing ideas for the future.' },
  { id: 'PE06', title: 'Garcia & Rodriguez Union', type: 'Wedding', imageUrl: 'https://picsum.photos/600/400?random=6', caption: 'An elegant evening ceremony.' },
];

const testimonials: Testimonial[] = [
  { id: 'T01', name: 'Sarah L.', eventType: 'Wedding', quote: 'The venue was absolutely stunning and the staff made our day perfect. We couldn\'t have asked for more!', avatarUrl: 'https://picsum.photos/100/100?random=10' },
  { id: 'T02', name: 'Mark C.', eventType: 'Corporate Event', quote: 'Professional, seamless, and impressive. Our annual conference was a huge success thanks to this amazing venue and its team.', avatarUrl: 'https://picsum.photos/100/100?random=11' },
  { id: 'T03', name: 'Jessica P.', eventType: 'Birthday Party', quote: 'They handled everything for my son\'s birthday party. It was stress-free for me and tons of fun for the kids.', avatarUrl: 'https://picsum.photos/100/100?random=12' },
];

const stalls: StallRegistration[] = [
    { id: 'S01', vendorName: 'Crafty Creations', stallSize: 'Medium', category: 'Handicrafts', paymentStatus: 'Paid', stallNumber: 12 },
    { id: 'S02', vendorName: 'Gourmet Bites', stallSize: 'Large', category: 'Food', paymentStatus: 'Paid', stallNumber: 3 },
    { id: 'S03', vendorName: 'Vintage Threads', stallSize: 'Medium', category: 'Apparel', paymentStatus: 'Unpaid', stallNumber: null },
];

const camps: CampRegistration[] = [
    { id: 'C01', childName: 'Emily White', age: 8, activity: 'Arts & Crafts', paymentStatus: 'Paid' },
    { id: 'C02', childName: 'Michael Green', age: 10, activity: 'Robotics', paymentStatus: 'Paid' },
    { id: 'C03', childName: 'Olivia Blue', age: 9, activity: 'Sports', paymentStatus: 'Paid' },
];

const API_LATENCY = 500; // ms

// --- API FUNCTIONS ---

export const api = {
  fetchBookings: (): Promise<Booking[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...bookings]), API_LATENCY);
    });
  },

  updateBookingStatus: (bookingId: string, newStatus: BookingStatus): Promise<Booking> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);
        if (bookingIndex > -1) {
          bookings[bookingIndex].status = newStatus;
          resolve(bookings[bookingIndex]);
        } else {
          reject(new Error('Booking not found'));
        }
      }, API_LATENCY);
    });
  },

  submitBookingRequest: (formData: Omit<Booking, 'id' | 'status' | 'payment'>): Promise<Booking> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newBooking: Booking = {
                ...formData,
                id: `B${String(bookings.length + 1).padStart(3, '0')}`,
                status: BookingStatus.Pending,
                payment: 0,
            };
            bookings.push(newBooking);
            resolve(newBooking);
        }, API_LATENCY)
    });
  },

  fetchPastEvents: (): Promise<PastEvent[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...pastEvents]), API_LATENCY);
    });
  },

  fetchTestimonials: (): Promise<Testimonial[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...testimonials]), API_LATENCY);
    });
  },
  
  fetchStalls: (): Promise<StallRegistration[]> => {
    return new Promise(resolve => {
        setTimeout(() => resolve([...stalls]), API_LATENCY);
    });
  },

  fetchCamps: (): Promise<CampRegistration[]> => {
    return new Promise(resolve => {
        setTimeout(() => resolve([...camps]), API_LATENCY);
    });
  }
};