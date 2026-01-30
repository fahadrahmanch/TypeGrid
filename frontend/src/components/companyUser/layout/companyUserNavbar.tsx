import React from 'react';
import {
    House,
    BookOpen,
    Trophy,
    Swords,
    Keyboard,
    Sparkles,
    Bell,
    User,
    // Gamepad2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/Icon/logo.png';
const CompanyUserNavbar: React.FC = () => {
    const location = useLocation();

    // Mapping for navigation items
    const navItems = [
        { name: 'Dashboard', icon: House, path: '/company/user/dashboard' },
        { name: 'Lessons', icon: BookOpen, path: '/company/user/lessons' },
        { name: 'Contests', icon: Trophy, path: '/company/user/my-contests' },
        { name: 'Challenges', icon: Swords, path: '/company/user/my-challenges', badge: true },
        { name: 'Keyboard', icon: Keyboard, path: '/company/user/my-keyboard' },
        { name: 'Practice', icon: Sparkles, path: '/company/user/my-practice' },
        { name: 'Notifications', icon: Bell, path: '/company/user/my-notifications' },
        { name: 'Profile', icon: User, path: '/company-user/profile' },
    ];

    const handleLogout = () => {
        // Implement logout logic here
        console.log('User logged out');
    };

    return (
        <div className="fixed top-0 left-0 w-full h-16 bg-[#FFF8EA] border-b border-[#F0E6D2] z-50 flex items-center justify-between px-8 shadow-sm">

            {/* Logo Section */}
            <div className="flex items-center gap-3">
                <img
                    src={logo}
                    alt="TypeGrid logo"
                    className="w-10 h-10 object-contain"
                />
                <div className="flex flex-col">
                    <p
                        className="text-2xl font-bold text-gray-900 tracking-wide leading-none"
                        style={{ fontFamily: 'Jaini, sans-serif' }}
                    >
                        TypeGrid
                    </p>
                    <div className="h-0.5 w-full bg-pink-500 rounded-full mt-0.5" />
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group relative
                                ${isActive
                                    ? "text-[#8B7355] font-bold"
                                    : "text-gray-500 hover:text-[#8B7355] font-medium"
                                }
                            `}
                        >
                            <item.icon
                                className={`
                                    w-5 h-5 transition-colors duration-200
                                    ${isActive ? "text-[#8B7355]" : "text-gray-400 group-hover:text-[#8B7355]"}
                                `}
                            />
                            <span>{item.label}</span>
                            {isActive && (
                                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8B7355] rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="User"
                        className="w-9 h-9 rounded-full bg-white border-2 border-white shadow-sm"
                    />
                    <div className="hidden lg:block text-sm">
                        <p className="font-bold text-gray-900">Fahad Rahman</p>
                        <p className="text-xs text-gray-500">Company User</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Logout"
                >
                    {/* <LogOut className="w-5 h-5" /> */}
                </button>
            </div>
        </div>
    );
};

export default CompanyUserNavbar;