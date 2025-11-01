
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarIcon, BarChartIcon, FileTextIcon, ShoppingBagIcon, MenuIcon, XIcon } from '../constants';

// Public Header
const PublicHeader: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Venue', path: '/venue' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Our Events', path: '/events' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="text-2xl font-bold text-primary-600">TheSoulGarden</NavLink>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map(link => (
                                <NavLink key={link.name} to={link.path} className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-primary-600 bg-primary-100' : 'text-gray-600 hover:bg-gray-100'}`}>{link.name}</NavLink>
                            ))}
                        </div>
                    </div>
                     <div className="hidden md:block">
                        <NavLink to="/booking" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Book Venue</NavLink>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                            {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {navLinks.map(link => (
                            <NavLink key={link.name} to={link.path} className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-primary-700 bg-primary-100' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setIsOpen(false)}>{link.name}</NavLink>
                        ))}
                         <NavLink to="/booking" className="block w-full text-left mt-2 px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700" onClick={() => setIsOpen(false)}>Book Venue</NavLink>
                    </div>
                </div>
            )}
        </header>
    );
};

// Public Footer
const PublicFooter: React.FC = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold">TheSoulGarden</h3>
                    <p className="mt-2 text-gray-400">Your perfect venue for every occasion.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Quick Links</h3>
                    <ul className="mt-2 space-y-1">
                        <li><NavLink to="/venue" className="hover:text-primary-400">The Venue</NavLink></li>
                        <li><NavLink to="/booking" className="hover:text-primary-400">Book Now</NavLink></li>
                        <li><NavLink to="/contact" className="hover:text-primary-400">Contact Us</NavLink></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Connect</h3>
                    <p className="mt-2 text-gray-400">123 Event Lane, Celebration City</p>
                    <p className="text-gray-400">(123) 456-7890</p>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} TheSoulGarden. All rights reserved.
            </div>
        </div>
    </footer>
);

export const PublicLayout: React.FC = () => (
    <div className="flex flex-col min-h-screen">
        <PublicHeader />
        <main className="flex-grow">
            <Outlet />
        </main>
        <PublicFooter />
    </div>
);


// Admin Sidebar
const AdminSidebar: React.FC<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void }> = ({ isOpen, setIsOpen }) => {
    const adminNavLinks = [
        { name: 'Dashboard', path: '/admin', icon: <HomeIcon className="h-5 w-5"/> },
        { name: 'Calendar', path: '/admin/calendar', icon: <CalendarIcon className="h-5 w-5"/> },
        { name: 'Bookings', path: '/admin/bookings', icon: <FileTextIcon className="h-5 w-5"/> },
        { name: 'Registrations', path: '/admin/registrations', icon: <ShoppingBagIcon className="h-5 w-5"/> },
        { name: 'Financials', path: '/admin/financials', icon: <BarChartIcon className="h-5 w-5"/> },
    ];
    return (
        <>
            <div className={`fixed inset-0 z-40 bg-gray-900/50 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`fixed top-0 left-0 z-50 w-64 h-full bg-gray-900 text-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex-shrink-0`}>
                <div className="p-4 flex items-center justify-between">
                    <NavLink to="/admin" className="text-2xl font-bold text-white">Admin</NavLink>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-white">
                        <XIcon className="h-6 w-6"/>
                    </button>
                </div>
                <nav className="mt-4">
                    {adminNavLinks.map(link => (
                        <NavLink 
                            key={link.name} 
                            to={link.path} 
                            end={link.path === '/admin'}
                            className={({isActive}) => `flex items-center gap-3 px-4 py-3 text-sm font-medium ${isActive ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.icon}
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

// Admin Header
const AdminHeader: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const location = useLocation();
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop() || 'dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <button onClick={onMenuClick} className="md:hidden text-gray-500">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
                    <div className="flex items-center">
                        <img className="h-8 w-8 rounded-full" src="https://picsum.photos/100/100?random=15" alt="Admin"/>
                    </div>
                </div>
            </div>
        </header>
    );
};


export const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
