import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout, AdminLayout } from './components/Layouts';
import { HomePage, VenuePage, PortfolioPage, BookingPage, EventsPage, ContactPage } from './pages/PublicPages';
import { DashboardPage, CalendarPage, BookingsPage, EventRegistrationsPage, FinancialsPage } from './pages/AdminPages';

const App: React.FC = () => {
    return (
        <HashRouter>
            <Routes>
                {/* Public Website Routes */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="venue" element={<VenuePage />} />
                    <Route path="portfolio" element={<PortfolioPage />} />
                    <Route path="booking" element={<BookingPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="contact" element={<ContactPage />} />
                </Route>

                {/* Admin Dashboard Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="bookings" element={<BookingsPage />} />
                    <Route path="registrations" element={<EventRegistrationsPage />} />
                    <Route path="financials" element={<FinancialsPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
};

export default App;