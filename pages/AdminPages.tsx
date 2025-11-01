import React, { useState, useEffect, useMemo } from 'react';
import { Booking, BookingStatus, StallRegistration, CampRegistration } from '../types';
import { api } from '../services/api';
import { Card, CardHeader, CardContent, CardTitle, Badge, StatCard, Select } from '../components/UI';
import { STATUS_COLORS, UsersIcon, DollarSignIcon, CheckCircleIcon, ClockIcon } from '../constants';

// --- Reusable Admin Page Components ---
const PageTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h1 className="text-2xl font-semibold text-gray-800 mb-6">{children}</h1>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
);


// --- DashboardPage ---
export const DashboardPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.fetchBookings().then(data => {
            setBookings(data);
            setLoading(false);
        });
    }, []);

    const stats = useMemo(() => {
        const totalRevenue = bookings
            .filter(b => b.status === BookingStatus.Completed || b.status === BookingStatus.Confirmed)
            .reduce((sum, b) => sum + b.payment, 0);
        const pendingRequests = bookings.filter(b => b.status === BookingStatus.Pending).length;
        const upcomingEvents = bookings.filter(b => b.status === BookingStatus.Confirmed && new Date(b.date) >= new Date()).length;
        const totalBookings = bookings.length;
        return { totalRevenue, pendingRequests, upcomingEvents, totalBookings };
    }, [bookings]);

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <PageTitle>Dashboard</PageTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<DollarSignIcon className="h-6 w-6 text-white"/>} color="bg-green-500" />
                <StatCard title="Total Bookings" value={stats.totalBookings.toString()} icon={<UsersIcon className="h-6 w-6 text-white"/>} color="bg-blue-500" />
                <StatCard title="Upcoming Events" value={stats.upcomingEvents.toString()} icon={<CheckCircleIcon className="h-6 w-6 text-white"/>} color="bg-indigo-500" />
                <StatCard title="Pending Requests" value={stats.pendingRequests.toString()} icon={<ClockIcon className="h-6 w-6 text-white"/>} color="bg-yellow-500" />
            </div>
            
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.slice(0, 5).map(booking => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.clientName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={STATUS_COLORS[booking.status]}>{booking.status}</Badge>
                                        </td>
                                    </tr>
                                ))}
                           </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// --- CalendarPage ---
export const CalendarPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        api.fetchBookings().then(data => {
            setBookings(data);
            setLoading(false);
        });
    }, []);

    const bookingsByDate = useMemo(() => {
        return bookings.reduce((acc, booking) => {
            (acc[booking.date] = acc[booking.date] || []).push(booking);
            return acc;
        }, {} as Record<string, Booking[]>);
    }, [bookings]);

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

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <PageTitle>Event Calendar</PageTitle>
             <Card>
                <CardHeader className="flex justify-between items-center">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-gray-100">&lt;</button>
                    <CardTitle>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-gray-100">&gt;</button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-2">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7">
                       {calendarDays.map((day, i) => {
                           const dayStr = day?.toISOString().split('T')[0];
                           const dayBookings = dayStr ? bookingsByDate[dayStr] : [];
                           return (
                                <div key={i} className={`border-t border-r p-2 h-28 overflow-y-auto ${!day ? 'bg-gray-50' : ''} ${i % 7 === 0 ? 'border-l' : ''}`}>
                                    <div className="font-semibold text-sm text-gray-700">{day?.getDate()}</div>
                                    {dayBookings?.map(b => (
                                        <div key={b.id} className={`text-xs p-1 rounded-md mt-1 truncate ${STATUS_COLORS[b.status]}`}>
                                            {b.eventType}
                                        </div>
                                    ))}
                               </div>
                           )
                       })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


// --- BookingsPage ---
export const BookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.fetchBookings().then(data => {
            setBookings(data);
            setLoading(false);
        });
    }, []);

    const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
        setBookings(currentBookings => 
            currentBookings.map(b => 
                b.id === bookingId ? { ...b, status: newStatus } : b
            )
        );
        api.updateBookingStatus(bookingId, newStatus);
    };
    
    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <PageTitle>Manage Bookings</PageTitle>
             <Card>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{booking.clientName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.eventType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.guests}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                             <Badge className={STATUS_COLORS[booking.status]}>{booking.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Select 
                                                value={booking.status}
                                                onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                                className="text-xs p-1"
                                            >
                                                {Object.values(BookingStatus).map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// --- EventRegistrationsPage ---
export const EventRegistrationsPage: React.FC = () => {
    const [stalls, setStalls] = useState<StallRegistration[]>([]);
    const [camps, setCamps] = useState<CampRegistration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.fetchStalls(), api.fetchCamps()]).then(([stallsData, campsData]) => {
            setStalls(stallsData);
            setCamps(campsData);
            setLoading(false);
        });
    }, []);

    if (loading) return <LoadingSpinner />;
    
    return (
        <div>
            <PageTitle>Event Registrations</PageTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle>Stall Registrations</CardTitle></CardHeader>
                    <CardContent>
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                                {stalls.map(stall => (
                                    <tr key={stall.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{stall.vendorName}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{stall.stallSize}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            <Badge className={stall.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{stall.paymentStatus}</Badge>
                                        </td>
                                    </tr>
                                ))}
                           </tbody>
                        </table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Summer Camp Registrations</CardTitle></CardHeader>
                     <CardContent>
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Child Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                </tr>
                           </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                                {camps.map(camp => (
                                    <tr key={camp.id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{camp.childName}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">{camp.age}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                                            <Badge className={camp.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{camp.paymentStatus}</Badge>
                                        </td>
                                    </tr>
                                ))}
                           </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
};


// --- FinancialsPage ---
export const FinancialsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.fetchBookings().then(data => {
            setBookings(data.filter(b => b.status === BookingStatus.Completed || b.status === BookingStatus.Confirmed));
            setLoading(false);
        });
    }, []);

    const totalRevenue = useMemo(() => bookings.reduce((sum, b) => sum + b.payment, 0), [bookings]);
    
    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <PageTitle>Financials</PageTitle>
            <div className="mb-6">
                <StatCard 
                    title="Total Confirmed/Completed Revenue" 
                    value={`$${totalRevenue.toLocaleString()}`}
                    icon={<DollarSignIcon className="h-8 w-8 text-white"/>}
                    color="bg-green-500"
                />
            </div>
            <Card>
                <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
                <CardContent>
                    <table className="min-w-full divide-y divide-gray-200">
                       <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.eventType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{booking.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">${booking.payment.toLocaleString()}</td>
                                </tr>
                            ))}
                       </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
};
