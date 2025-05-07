import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import AdminSidebar from '@/Components/AdminSidebar';
import { FiMenu, FiX, FiHome, FiUsers, FiSettings, FiLogOut, FiChevronDown, FiChevronUp, FiBriefcase } from 'react-icons/fi';

export default function AdminLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showCompanySubmenu, setShowCompanySubmenu] = useState(false);

    const isImpersonating = user && user.impersonating;

    return (
        <div className="flex min-h-screen bg-base-100">
            {/* Sidebar - hidden on mobile, visible on desktop */}
            <div className="hidden md:block">
                <AdminSidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {showingNavigationDropdown && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowingNavigationDropdown(false)}></div>
                    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-base-200">
                        <AdminSidebar />
                    </div>
                </div>
            )}

            <div className="flex flex-1 flex-col">
            <nav className="border-b border-base-300 bg-base-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="rounded-md p-2 text-base-content md:hidden"
                                aria-label="Open menu"
                            >
                                <FiMenu className="h-6 w-6" />
                            </button>

                            {/* Page title - shown on mobile only */}
                            <div className="md:hidden ml-2 font-semibold">
                                {route().current('admin.dashboard') && 'Dashboard'}
                                {route().current('admin.companies.index') && 'Companies'}
                                {route().current('admin.companies.create') && 'Create Company'}
                            </div>
                        </div>

                        <div className="hidden md:flex md:items-center">
                            {/* Header title - desktop only */}
                            {header && (
                                <div className="mr-4 font-semibold text-xl">
                                    {route().current('admin.dashboard') && 'Dashboard'}
                                    {route().current('admin.companies.index') && 'Companies'}
                                    {route().current('admin.companies.create') && 'Create Company'}
                                </div>
                            )}

                            {isImpersonating && (
                                <div className="mr-3">
                                    <Link
                                        href={route('admin.stop-impersonating')}
                                        method="post"
                                        as="button"
                                        className="btn btn-sm btn-error"
                                    >
                                        Stop Impersonating
                                    </Link>
                                </div>
                            )}

                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                <div className="avatar mr-2">
                                                    <div className="w-6 rounded-full">
                                                        <img src={user.profile_photo_url || 'https://placehold.co/100x100'} alt="Profile" />
                                                    </div>
                                                </div>
                                                {user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
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
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            <FiSettings className="mr-2" /> Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            <FiLogOut className="mr-2" /> Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile user menu */}
                        <div className="flex items-center md:hidden">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        className="inline-flex items-center justify-center p-2 rounded-md text-base-content"
                                    >
                                        <div className="avatar">
                                            <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                                                <img src={user.profile_photo_url || 'https://placehold.co/100x100'} alt="Profile" />
                                            </div>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        <FiSettings className="mr-2" /> Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        <FiLogOut className="mr-2" /> Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow-sm border-b border-base-300">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6  bg-base-200">
                <div>
                    {children}
                </div>
            </main>
            </div>
        </div>
    );
}
