
import React, { useState, useMemo, useEffect } from 'react';
import { Booking, PastEvent, Testimonial } from '../types';
import { api } from '../services/api';
import { Card, CardContent, Button, Input, Textarea } from '../components/UI';
import { MapPinIcon, PhoneIcon, MailIcon } from '../constants';

// --- Reusable Public Page Components ---
const PageSection: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className = '' }) => (
    <section className={`py-12 md:py-20 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode; subtitle?: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{children}</h2>
        {subtitle && <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">{subtitle}</p>}
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
);


// --- HomePage ---
export const HomePage: React.FC = () => {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const [eventsData, testimonialsData] = await Promise.all([
            api.fetchPastEvents(),
            api.fetchTestimonials(),
        ]);
        setEvents(eventsData);
        setTestimonials(testimonialsData);
        setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[80vh] bg-cover bg-center" style={{ backgroundImage: `url('https://picsum.photos/1600/900?random=hero')` }}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Your Perfect Venue Awaits</h1>
                <p className="mt-4 max-w-2xl text-lg md:text-xl">From weddings to corporate events, we provide a stunning backdrop for your most memorable moments.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button as="a" href="#/booking" size="lg">Book Venue</Button>
                    <Button as="a" href="#/events" size="lg" variant="secondary">Explore Events</Button>
                </div>
            </div>
        </div>

        {/* Featured Events */}
        <PageSection>
            <SectionTitle subtitle="Discover some of the amazing events we've had the pleasure of hosting.">Featured Events</SectionTitle>
            {loading ? <LoadingSpinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.slice(0, 3).map(event => (
                        <Card key={event.id}>
                            <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
                            <CardContent>
                                <h3 className="text-xl font-semibold">{event.title}</h3>
                                <p className="text-gray-600 mt-2">{event.caption}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </PageSection>

        {/* Testimonials */}
        <PageSection className="bg-gray-100">
            <SectionTitle subtitle="Don't just take our word for it. Here's what our clients have to say.">Client Testimonials</SectionTitle>
            {loading ? <LoadingSpinner /> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <Card key={testimonial.id}>
                            <CardContent className="flex flex-col items-center text-center">
                                <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4" />
                                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                                <div className="mt-4 font-semibold text-gray-800">{testimonial.name}</div>
                                <div className="text-sm text-primary-600">{testimonial.eventType}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </PageSection>
    </div>
  );
};

// --- VenuePage ---
export const VenuePage: React.FC = () => {
    const amenities = ['Free Parking', 'Commercial Kitchen', 'Professional Stage', 'Green Rooms', 'High-Speed Wi-Fi', 'AV Equipment'];
    return (
        <div>
            <PageSection>
                <SectionTitle subtitle="Explore our versatile and elegant space, perfect for any occasion.">Our Venue</SectionTitle>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <img src="https://picsum.photos/1200/800?random=venue" alt="Main Venue" className="rounded-lg shadow-lg w-full h-auto object-cover"/>
                    </div>
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold text-gray-800">Venue Specifications</h3>
                        <ul className="mt-4 space-y-2 text-gray-600">
                            <li><strong>Area:</strong> 5,000 sq ft</li>
                            <li><strong>Capacity:</strong> Up to 300 guests</li>
                            <li><strong>Event Types:</strong> Weddings, Corporate, Parties, Cultural</li>
                        </ul>
                        <h3 className="text-2xl font-bold text-gray-800 mt-8">Amenities</h3>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            {amenities.map(amenity => <div key={amenity} className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>{amenity}</div>)}
                        </div>
                        <Button as="a" href="brochure.pdf" download className="mt-8">Download Brochure</Button>
                    </div>
                </div>
            </PageSection>
        </div>
    );
};

// --- PortfolioPage ---
export const PortfolioPage: React.FC = () => {
    const [events, setEvents] = useState<PastEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const data = await api.fetchPastEvents();
            setEvents(data);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    return (
        <PageSection>
            <SectionTitle subtitle="A glimpse into the beautiful memories created at our venue.">Past Events Portfolio</SectionTitle>
            {loading ? <LoadingSpinner/> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <Card key={event.id}>
                            <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover" />
                            <CardContent>
                                <span className="text-sm font-semibold text-primary-600">{event.type}</span>
                                <h3 className="text-xl font-bold mt-1">{event.title}</h3>
                                <p className="text-gray-600 mt-2">{event.caption}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </PageSection>
    )
};

// --- BookingPage ---
const Calendar: React.FC<{ bookings: Booking[]; selectedDate: Date; onDateChange: (date: Date) => void; }> = ({ bookings, selectedDate, onDateChange }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const bookedDates = useMemo(() => new Set(bookings.map(b => b.date)), [bookings]);

    const today = new Date();
    today.setHours(0,0,0,0);

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const calendarDays = Array.from({ length: firstDayOfMonth + daysInMonth }, (_, i) => {
        if (i < firstDayOfMonth) return null;
        const day = i - firstDayOfMonth + 1;
        return new Date(currentYear, currentMonth, day);
    });

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentYear, currentMonth + delta);
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
    }

    const dayClass = (day: Date | null) => {
        if (!day) return "invisible";
        let classes = "w-10 h-10 flex items-center justify-center rounded-full transition-colors ";
        const dayStr = day.toISOString().split('T')[0];

        if (day.getTime() === selectedDate.getTime()) classes += "bg-primary-600 text-white ";
        else if (bookedDates.has(dayStr)) classes += "bg-red-200 text-red-800 cursor-not-allowed ";
        else if (day.getTime() === today.getTime()) classes += "bg-primary-100 text-primary-700 ";
        else classes += "hover:bg-gray-100 cursor-pointer ";
        
        return classes;
    }

    return (
        <Card>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)}>&lt;</button>
                    <div className="font-bold">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                    <button onClick={() => changeMonth(1)}>&gt;</button>
                </div>
                <div className="grid grid-cols-7 text-center text-sm text-gray-500">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 mt-2 text-center">
                    {calendarDays.map((day, i) => (
                        <div key={i} className="p-1">
                            <div className={dayClass(day)} onClick={() => day && !bookedDates.has(day.toISOString().split('T')[0]) && onDateChange(day)}>
                                {day?.getDate()}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export const BookingPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        const fetchBookingsData = async () => {
            setLoading(true);
            const data = await api.fetchBookings();
            setBookings(data);
            setLoading(false);
        };
        fetchBookingsData();
    }, []);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const bookingRequest = {
            clientName: formData.get('name') as string,
            clientEmail: formData.get('email') as string,
            eventType: formData.get('eventType') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            guests: Number(formData.get('guests')),
            notes: formData.get('notes') as string,
        };
        await api.submitBookingRequest(bookingRequest);
        setFormSubmitted(true);
        // Optionally refetch bookings to show the new pending one
        api.fetchBookings().then(setBookings);
    };

    return (
        <PageSection>
            <SectionTitle subtitle="Check our availability and send us a request for your event.">Book Our Venue</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Availability Calendar</h3>
                    {loading ? <LoadingSpinner/> : <Calendar bookings={bookings} selectedDate={selectedDate} onDateChange={handleDateChange} />}
                    <p className="text-sm mt-4 text-gray-600"><span className="inline-block w-3 h-3 rounded-full bg-red-200 mr-2"></span>Booked Dates</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4">Booking Request Form</h3>
                    {formSubmitted ? (
                         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                            <p className="font-bold">Request Submitted!</p>
                            <p>Thank you for your interest. We will review your request and get back to you shortly.</p>
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <Input name="name" type="text" placeholder="Your Name" required/>
                            <Input name="email" type="email" placeholder="Your Email" required/>
                            <Input name="eventType" type="text" placeholder="Event Type (e.g., Wedding)" required/>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input name="date" type="date" value={selectedDate.toISOString().split('T')[0]} onChange={(e) => handleDateChange(new Date(e.target.value))} required/>
                                <Input name="time" type="time" required/>
                            </div>
                            <Input name="guests" type="number" placeholder="Number of Guests" required/>
                            <Textarea name="notes" placeholder="Additional requirements (decoration, catering, etc.)" rows={4}/>
                            <Button type="submit" className="w-full">Submit Request</Button>
                        </form>
                    )}
                </div>
            </div>
        </PageSection>
    );
};

// --- EventsPage ---
export const EventsPage: React.FC = () => {
    const events = [
        {title: "Local Market / Stall Booking", description: "Showcase your products at our vibrant local market. Book a stall today!", image: "https://picsum.photos/600/400?random=market"},
        {title: "Kids Summer Camp", description: "A fun-filled summer camp with activities like arts, crafts, and sports. Register your child now!", image: "https://picsum.photos/600/400?random=camp"}
    ];
    return (
        <PageSection>
            <SectionTitle subtitle="Join our special events or register for our exciting programs.">Our Hosted Events</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.map(event => (
                    <Card key={event.title}>
                        <img src={event.image} alt={event.title} className="w-full h-56 object-cover"/>
                        <CardContent>
                            <h3 className="text-2xl font-bold">{event.title}</h3>
                            <p className="mt-2 text-gray-600">{event.description}</p>
                            <Button className="mt-4">Learn More & Register</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </PageSection>
    );
};

// --- ContactPage ---
export const ContactPage: React.FC = () => (
    <PageSection>
        <SectionTitle subtitle="We'd love to hear from you. Reach out with any questions or inquiries.">Contact Us</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                 <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Your message has been sent!'); }}>
                    <Input type="text" placeholder="Your Name" required/>
                    <Input type="email" placeholder="Your Email" required/>
                    <Textarea placeholder="Your Message" rows={5} required/>
                    <Button type="submit">Send Message</Button>
                </form>
            </div>
            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <MapPinIcon className="h-6 w-6 text-primary-600 mt-1"/>
                    <div>
                        <h4 className="font-semibold">Our Address</h4>
                        <p className="text-gray-600">123 Event Lane, Celebration City, 12345</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <PhoneIcon className="h-6 w-6 text-primary-600 mt-1"/>
                    <div>
                        <h4 className="font-semibold">Call Us</h4>
                        <p className="text-gray-600">(123) 456-7890</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <MailIcon className="h-6 w-6 text-primary-600 mt-1"/>
                    <div>
                        <h4 className="font-semibold">Email Us</h4>
                        <p className="text-gray-600">contact@thesoulgarden.com</p>
                    </div>
                </div>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.225575381836!2d144.9537353159042!3d-37.81720997975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1620286345678!5m2!1sen!2sau" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"></iframe>
                </div>
            </div>
        </div>
    </PageSection>
);