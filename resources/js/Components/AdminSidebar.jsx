import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FiHome, FiBriefcase, FiUsers, FiBarChart2, FiSettings, FiHelpCircle, FiShield, FiCreditCard, FiTag, FiTruck, FiWifi } from 'react-icons/fi';

export default function AdminSidebar() {
    const { url } = usePage();
    const { user } = usePage().props.auth;

    const [activeItem, setActiveItem] = useState('admin-dashboard');
    const [openSection, setOpenSection] = useState('dashboard');

    // Set active item based on current URL
    useEffect(() => {
        if (url.includes('admin/dashboard')) {
            setActiveItem('admin-dashboard');
            setOpenSection('dashboard');
        } else if (url.includes('admin/companies')) {
            if (url.includes('admin/companies/create')) {
                setActiveItem('companies-create');
            } else if (url.includes('admin/companies/users')) {
                setActiveItem('companies-users');
            } else if (url.includes('admin/companies/subscriptions')) {
                setActiveItem('companies-subscriptions');
            } else {
                setActiveItem('companies-list');
            }
            setOpenSection('companies');
        } else if (url.includes('admin/subscriptions/plans')) {
            setActiveItem('subscription-plans');
            setOpenSection('subscriptions');
        } else if (url.includes('admin/assets/types')) {
            setActiveItem('asset-types');
            setOpenSection('assets');
        } else if (url.includes('admin/fleet/makes')) {
            setActiveItem('vehicle-makes');
            setOpenSection('fleet');
        } else if (url.includes('admin/fleet/models')) {
            setActiveItem('vehicle-models');
            setOpenSection('fleet');
        } else if (url.includes('admin/telemetry-providers')) {
            setActiveItem('telemetry-providers');
            setOpenSection('integrations');
        } else if (url.includes('admin/users')) {
            setActiveItem('users');
            setOpenSection('users');
        } else if (url.includes('admin/roles')) {
            setActiveItem('roles');
            setOpenSection('users');
        } else if (url.includes('admin/reports')) {
            setActiveItem('reports');
            setOpenSection('reports');
        } else if (url.includes('profile')) {
            setActiveItem('profile');
            setOpenSection('settings');
        }
    }, [url]);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Admin navigation sections
    const sections = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <FiHome className="h-5 w-5 mr-2" />,
            items: [
                { id: 'admin-dashboard', label: 'Overview', href: route('admin.dashboard') },
            ],
        },
        {
            id: 'companies',
            label: 'Companies',
            icon: <FiBriefcase className="h-5 w-5 mr-2" />,
            items: [
                { id: 'companies-list', label: 'All Companies', href: route('admin.companies.index') },
                { id: 'companies-create', label: 'Add New Company', href: route('admin.companies.create') },
                // { id: 'companies-users', label: 'Company Users', href: route('admin.companies.index') + '?view=users' },
                // { id: 'companies-subscriptions', label: 'Company Subscriptions', href: route('admin.companies.index') + '?view=subscriptions' },
            ],
        },
        {
            id: 'subscriptions',
            label: 'Subscriptions',
            icon: <FiCreditCard className="h-5 w-5 mr-2" />,
            items: [
                { id: 'subscription-plans', label: 'Subscription Plans', href: '/admin/subscriptions/plans' },
                // { id: 'subscription-payments', label: 'Payment History', href: '#' },
                // { id: 'subscription-reports', label: 'Subscription Reports', href: '#' },
            ],
        },
        {
            id: 'assets',
            label: 'Asset Management',
            icon: <FiTag className="h-5 w-5 mr-2" />,
            items: [
                { id: 'asset-types', label: 'Asset Types', href: route('admin.types.index') },
            ],
        },
        {
            id: 'fleet',
            label: 'Fleet Management',
            icon: <FiTruck className="h-5 w-5 mr-2" />,
            items: [
                { id: 'vehicle-makes', label: 'Vehicle Makes', href: route('admin.fleet.makes.index') },
                { id: 'vehicle-models', label: 'Vehicle Models', href: route('admin.fleet.models.index') },
            ],
        },
        {
            id: 'integrations',
            label: 'Integrations',
            icon: <FiWifi className="h-5 w-5 mr-2" />,
            items: [
                { id: 'telemetry-providers', label: 'Telemetry Providers', href: route('admin.telemetry-providers.index') },
            ],
        },
        {
            id: 'users',
            label: 'User Management',
            icon: <FiUsers className="h-5 w-5 mr-2" />,
            items: [
                { id: 'users', label: 'All Users', href: route('admin.users.index') },
                { id: 'roles', label: 'Roles & Permissions', href: '#' },
            ],
        },
        {
            id: 'reports',
            label: 'Reports & Analytics',
            icon: <FiBarChart2 className="h-5 w-5 mr-2" />,
            items: [
                { id: 'reports', label: 'System Reports', href: '#' },
            ],
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: <FiSettings className="h-5 w-5 mr-2" />,
            items: [
                { id: 'profile', label: 'My Profile', href: route('profile.edit') },
                { id: 'system-settings', label: 'System Settings', href: '#' },
                { id: 'help', label: 'Help & Support', href: '#' },
            ],
        },
    ];

    return (
        <div className="h-screen w-64 bg-base-100 text-base-content border-r border-base-300 flex flex-col">
            {/* Logo and App Name */}
            <div className="flex h-16 items-center px-4 border-b border-base-300">
                <div className="flex items-center space-x-2">
                    <div className="avatar">
                        <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                            <span className="text-lg font-bold">CC</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-lg font-semibold">Carbon Credit</div>
                        <div className="text-xs text-primary font-medium">Super Admin</div>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="px-4 py-3 border-b border-base-300">
                <div className="flex items-center space-x-3">
                    <div className="avatar">
                        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={user.profile_photo_url || 'https://placehold.co/100x100'} alt="Profile" />
                        </div>
                    </div>
                    <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs opacity-70 flex items-center">
                            <FiShield className="mr-1 text-primary" /> Super Admin
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                <ul className="menu menu-sm gap-1">
                    {sections.map((section) => (
                        <li key={section.id} className="mb-2">
                            <div
                                className={`flex items-center justify-between p-2 font-medium ${openSection === section.id ? 'bg-base-200 rounded-lg' : ''}`}
                                onClick={() => toggleSection(section.id)}
                            >
                                <div className="flex items-center">
                                    {section.icon}
                                    {section.label}
                                </div>
                                <svg
                                    className={`h-4 w-4 transition-transform ${openSection === section.id ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                            {openSection === section.id && (
                                <ul className="menu menu-sm pl-4 mt-1">
                                    {section.items.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={item.href}
                                                className={`py-2 ${activeItem === item.id ? 'bg-primary/10 text-primary font-medium rounded-lg' : ''}`}
                                                onClick={() => setActiveItem(item.id)}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Version Info */}
            <div className="px-4 py-2 text-xs opacity-50 border-t border-base-300">
                <div>Carbon Credit v1.0.0</div>
                <div>© 2025 K2 Solutions</div>
            </div>
        </div>
    );
}
