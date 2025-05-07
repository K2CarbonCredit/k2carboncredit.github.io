import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <div className="flex min-h-screen bg-base-100">
            {/* Sidebar - hidden on mobile, visible on desktop */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {showMobileMenu && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}></div>
                    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-base-200">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex flex-1 flex-col">
                {/* Top navigation */}
                <nav className="border-b border-base-300 bg-base-100 shadow-sm">
                    <div className="px-4 py-3 md:py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {/* Mobile menu button */}
                                <button
                                    onClick={() => setShowMobileMenu(true)}
                                    className="mr-2 rounded-md p-2 text-base-content md:hidden"
                                    aria-label="Open menu"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                                <div className="md:hidden">
                                    <Link href="/" className="flex items-center">
                                        <ApplicationLogo className="h-8 w-8 fill-current text-primary" />
                                        <span className="ml-2 text-lg font-semibold">Carbon Credit</span>
                                    </Link>
                                </div>
                            </div>

                            {/* User dropdown */}
                            <div className="flex items-center">
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="flex items-center space-x-2 rounded-full border border-base-300 px-2 py-1 hover:bg-base-200">
                                                <div className="avatar">
                                                    <div className="w-8 rounded-full">
                                                        <img src={user.profile_photo_url || 'https://placehold.co/100x100'} alt="Profile" />
                                                    </div>
                                                </div>
                                                <span className="hidden text-sm font-medium md:block">{user.name}</span>
                                                <svg
                                                    className="h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Header */}
                {header && (
                    <header className="bg-base-100 border-b border-base-200 px-4 py-4 md:px-6">
                        {header}
                    </header>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6 bg-base-200">{children}</main>
            </div>
        </div>
    );
}
