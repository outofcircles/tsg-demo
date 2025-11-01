import React, { useState, useMemo, useEffect } from 'react';
import { Booking, BookingStatus, StallRegistration, CampRegistration } from '../types';
import { api } from '../services/api';
import { STATUS_COLORS, CalendarIcon, UsersIcon, DollarSignIcon, CheckCircleIcon, ClockIcon, XCircleIcon, MoreHorizontalIcon } from '../constants';
import { Card, CardContent, CardHeader, CardTitle, StatCard, Badge, Button, Select } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const LoadingComponent: React.FC = () => (
    <div className="flex justify-center items-center h-64">
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

    const totalRevenue = bookings.reduce((acc, b) => acc + b.payment, 0);
    const confirmedBookings = bookings.filter(b => b.status === BookingStatus.Confirmed).length;
    const pendingBookings = bookings.filter(b => b.status === BookingStatus.Pending).length;

    const monthlyRevenue = useMemo(() => {
        const data: { [key: string]: number } = {};
        bookings.forEach(b => {
            const month = new Date(b.date).toLocaleString('default', { month: 'short' });
            if (!data[month]) data[month] = 0;
            data[month] += b.payment;
        });
        return Object.entries(data).map(([name, revenue]) => ({ name, revenue }));
    }, [bookings]);

    const eventTypeData = useMemo(() => {
        const data: { [key: string]: number } = {};
        bookings.forEach(b => {
            if (!data[b.eventType]) data[b.eventType] = 0;
            data[b.eventType]++;
        });
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [bookings]);
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    if (loading) return <LoadingComponent />;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSignIcon className="h-6 w-6 text-green-600"/>} color="bg-green-100"/>
                <StatCard title="Confirmed Bookings" value={confirmedBookings.toString()} icon={<CheckCircleIcon className="h-6 w-6 text-blue-600"/>} color="bg-blue-100"/>
                <StatCard title="Pending Requests" value={pendingBookings.toString()} icon={<ClockIcon className="h-6 w-6 text-yellow-600"/>} color="bg-yellow-100"/>
                <StatCard title="Total Events (This Year)" value={bookings.length.toString()} icon={<CalendarIcon className="h-6 w-6 text-indigo-600"/>} color="bg-indigo-100"/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Event Types</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                             <PieChart>
                                {/* FIX: Handle potential undefined 'percent' value from recharts Pie component. */}
                                <Pie data={eventTypeData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({name, percent}) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                                    {eventTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};


// --- CalendarPage ---
const AdminCalendar: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const bookingsByDate = useMemo(() => {
        const map = new Map<string, Booking[]>();
        bookings.forEach(b => {
            const dateStr = b.date;
            if (!map.has(dateStr)) map.set(dateStr, []);
            map.get(dateStr)?.push(b);
        });
        return map;
    }, [bookings]);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    const calendarDays = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    
    const changeMonth = (delta: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta));
    };

    const statusDotColor = (status: BookingStatus) => {
        switch(status) {
            case BookingStatus.Confirmed: return "bg-green-500";
            case BookingStatus.Pending: return "bg-yellow-500";
            case BookingStatus.Cancelled: return "bg-red-500";
            case BookingStatus.Completed: return "bg-blue-500";
        }
    }

    return (
        <Card>
            <CardHeader className="flex justify-between items-center">
                <Button onClick={() => changeMonth(-1)} variant="ghost" size="sm">&lt; Prev</Button>
                <CardTitle>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
                <Button onClick={() => changeMonth(1)} variant="ghost" size="sm">Next &gt;</Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 border-t border-l border-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center font-semibold text-sm border-r border-b border-gray-200 bg-gray-50">{day}</div>
                    ))}
                    {calendarDays.map((day, index) => {
                        const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                        const dayBookings = bookingsByDate.get(dateStr) || [];
                        return (
                        <div key={index} className="h-32 p-1 border-r border-b border-gray-200 overflow-y-auto">
                           {day && <span className="text-sm font-medium">{day}</span>}
                           <div className="space-y-1 mt-1">
                                {dayBookings.map(b => (
                                    <div key={b.id} className="text-xs p-1 rounded bg-primary-100 text-primary-800 flex items-center">
                                       <span className={`w-2 h-2 rounded-full mr-1.5 flex-shrink-0 ${statusDotColor(b.status)}`}></span>
                                       <span className="truncate">{b.clientName}</span>
                                    </div>
                                ))}
                           </div>
                        </div>
                    )})}
                </div>
            </CardContent>
        </Card>
    );
};

export const CalendarPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.fetchBookings().then(data => {
            setBookings(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <LoadingComponent />;

    return <AdminCalendar bookings={bookings} />;
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

    const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
        await api.updateBookingStatus(id, newStatus);
        setBookings(prevBookings => 
            prevBookings.map(b => b.id === id ? { ...b, status: newStatus } : b)
        );
    };

    if (loading) return <LoadingComponent />;

    return (
        <Card>
            <CardHeader><CardTitle>Manage Bookings</CardTitle></CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{booking.clientName}</div>
                                        <div className="text-sm text-gray-500">{booking.clientEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{booking.eventType}</div>
                                        <div className="text-sm text-gray-500">{booking.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={STATUS_COLORS[booking.status]}>{booking.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.guests}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Select value={booking.status} onChange={(e) => handleUpdateStatus(booking.id, e.target.value as BookingStatus)}>
                                            {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                        </Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

// --- EventRegistrationsPage ---
export const EventRegistrationsPage: React.FC = () => {
    const [stalls, setStalls] = useState<StallRegistration[]>([]);
    const [camps, setCamps] = useState<CampRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [stallsData, campsData] = await Promise.all([
                api.fetchStalls(),
                api.fetchCamps()
            ]);
            setStalls(stallsData);
            setCamps(campsData);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <LoadingComponent/>;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Local Market Stall Bookings</CardTitle></CardHeader>
                <CardContent>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stall Size</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stall No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stalls.map(stall => (
                                <tr key={stall.id}>
                                    <td className="px-6 py-4">{stall.vendorName}</td>
                                    <td className="px-6 py-4">{stall.stallSize}</td>
                                    <td className="px-6 py-4"><Badge className={stall.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{stall.paymentStatus}</Badge></td>
                                    <td className="px-6 py-4">{stall.stallNumber || 'Not Assigned'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Kids Summer Camp Registrations</CardTitle></CardHeader>
                <CardContent>
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Child Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {camps.map(camp => (
                                <tr key={camp.id}>
                                    <td className="px-6 py-4">{camp.childName}</td>
                                    <td className="px-6 py-4">{camp.age}</td>
                                    <td className="px-6 py-4">{camp.activity}</td>
                                    <td className="px-6 py-4"><Badge className={camp.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{camp.paymentStatus}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

// --- FinancialsPage ---
export const FinancialsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.fetchBookings().then(data => {
            setBookings(data);
            setLoading(false);
        });
    }, []);

    const monthlyData = useMemo(() => {
        const data: { [key: string]: { revenue: number, expenses: number } } = {};
        bookings.forEach(b => {
            const month = new Date(b.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!data[month]) data[month] = { revenue: 0, expenses: 0 };
            data[month].revenue += b.payment;
            // Mock expenses as 40% of revenue
            data[month].expenses += b.payment * 0.4;
        });
        return Object.entries(data).map(([name, values]) => ({ name, ...values }));
    }, [bookings]);
    
    if (loading) return <LoadingComponent />;

    return (
        <Card>
            <CardHeader><CardTitle>Financial Overview (Profit/Loss)</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
