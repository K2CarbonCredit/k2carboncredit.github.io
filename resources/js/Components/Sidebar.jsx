import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Sidebar() {
    const { url } = usePage();
    const { user } = usePage().props.auth;
    const { company, isImpersonating } = usePage().props;

    // Get roles and permissions directly from auth props
    const { roles = [], permissions = [] } = usePage().props.auth;

    const [activeItem, setActiveItem] = useState('company-dashboard');
    const [openSection, setOpenSection] = useState('dashboards');

    // Set active item based on current URL path and handle impersonation state
    useEffect(() => {
        const currentPath = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const currentTab = searchParams.get('tab');

        if (currentPath.includes('company/fleet')) {
            setActiveItem('fleet');
            setOpenSection('fleet-management');
        } else if (currentPath.includes('profile')) {
            setActiveItem('profile');
            setOpenSection('settings');
        } else if (currentPath.includes('admin/dashboard')) {
            setActiveItem('admin-dashboard');
            setOpenSection('admin');
        } else if (currentPath.includes('admin/companies')) {
            setActiveItem('companies');
            setOpenSection('admin');
        } else if (currentPath.includes('platform/dashboard')) {
            setActiveItem('platform-dashboard');
            setOpenSection('admin');
        } else if (currentPath.includes('company/dashboard')) {
            setActiveItem('company-dashboard');
            setOpenSection('dashboards');
        } else if (currentPath.includes('company/projects')) {
            setActiveItem('projects');
            setOpenSection('carbon-management');
        } else if (currentPath.includes('company/inventory')) {
            setActiveItem('inventory');
            setOpenSection('carbon-management');
        } else if (currentPath.includes('company/reports')) {
            setActiveItem('reports');
            setOpenSection('carbon-management');
        } else if (currentPath.includes('company/marketplace')) {
            setActiveItem('marketplace');
            setOpenSection('carbon-management');
        } else if (currentPath.includes('company/telemetry')) {
            setActiveItem('telemetry-integrations');
            setOpenSection('settings');
        } else if (currentPath.includes('company/settings')) {
            setActiveItem('company-settings');
            setOpenSection('settings');

            // Handle settings sub-tabs
            if (currentTab === 'users') {
                window.currentSettingsTab = 'users-settings';
            } else if (currentTab === 'integrations') {
                window.currentSettingsTab = 'integrations-settings';
            } else if (currentTab === 'billing') {
                window.currentSettingsTab = 'billing-settings';
            } else if (currentTab === 'security') {
                window.currentSettingsTab = 'security-settings';
            } else {
                window.currentSettingsTab = 'general-settings';
            }
        } else if (currentPath.includes('help')) {
            setActiveItem('help');
            setOpenSection('settings');
        }
    }, [url, isImpersonating]); // Add isImpersonating to dependency array to re-evaluate when it changes

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const stopImpersonating = async () => {
        try {
            await axios.post(route('admin.stop-impersonating'));
            window.location.href = route('admin.dashboard');
        } catch (error) {
            console.error('Failed to stop impersonating', error);
        }
    };

    // Check if user has a specific role
    const hasRole = (roleName) => {
        return roles.includes(roleName);
    };

    // Check if user has a specific permission
    const hasPermission = (permissionName) => {
        return permissions.includes(permissionName);
    };

    // Super Admin sections
    const adminSections = [
        {
            id: 'admin',
            label: 'Administration',
            icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            items: [
                { id: 'admin-dashboard', label: 'Admin Dashboard', href: route('admin.dashboard') },
                { id: 'companies', label: 'Companies', href: route('admin.companies.index') },
                { id: 'users', label: 'User Management', href: '/admin/users' },
            ],
        },
    ];

    // Platform Admin sections
    const platformAdminSections = [
        {
            id: 'admin',
            label: 'Administration',
            icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            items: [
                { id: 'platform-dashboard', label: 'Platform Dashboard', href: route('platform.dashboard') },
            ],
        },
    ];

    // Company sections
    const companySections = [
        {
            id: 'fleet-management',
            label: 'Fleet Management',
            icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
            items: [
                { id: 'fleet', label: 'Vehicles', href: route('company.fleet.vehicles.index') },
                { id: 'fleets', label: 'Fleets', href: route('company.fleets.index') },
            ],
        },
        {
            id: 'dashboards',
            label: 'Dashboards',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            items: [
                { id: 'company-dashboard', label: 'Company Dashboard', href: route('company.dashboard') },
            ],
        },
        {
            id: 'carbon-management',
            label: 'Carbon Management',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            items: [
                hasPermission('view projects') ? { id: 'projects', label: 'Projects', href: route('company.projects') } : null,
                hasPermission('view carbon inventory') ? { id: 'inventory', label: 'Carbon Inventory', href: route('company.inventory') } : null,
                hasPermission('view reports') ? { id: 'reports', label: 'Reports & Analysis', href: route('company.reports') } : null,
                hasPermission('view marketplace') ? { id: 'marketplace', label: 'Carbon Marketplace', href: route('company.marketplace') } : null,
            ].filter(Boolean),
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
            items: [
                { id: 'profile', label: 'Profile', href: route('profile.edit') },
                hasRole('company_owner') || hasRole('super_admin') ? {
                    id: 'company-settings',
                    label: 'Company Settings',
                    href: route('company.settings'),
                    subItems: [
                        { id: 'general-settings', label: 'General', href: route('company.settings') },
                        { id: 'users-settings', label: 'Users', href: route('company.settings') + '?tab=users' },
                        { id: 'integrations-settings', label: 'Integrations', href: route('company.settings') + '?tab=integrations' },
                        { id: 'billing-settings', label: 'Billing', href: route('company.settings') + '?tab=billing' },
                        { id: 'security-settings', label: 'Security', href: route('company.settings') + '?tab=security' },
                    ]
                } : null,
                hasRole('company_owner') || hasRole('super_admin') ? {
                    id: 'telemetry-integrations',
                    label: 'Telemetry Integrations',
                    href: route('company.telemetry.index')
                } : null,
                { id: 'help', label: 'Help & Support', href: '#' },
            ].filter(Boolean),
        },
    ];

    // Determine which sections to show based on user role
    let sections = [];

    if (hasRole('super_admin') && !isImpersonating) {
        sections = adminSections;
    } else if (hasRole('platform_admin') && !isImpersonating) {
        sections = platformAdminSections;
    } else {
        sections = companySections;
    }

    return (
        <div className="h-screen w-64 bg-base-100 text-base-content border-r border-base-300 flex flex-col">
            {/* Logo and Company Name */}
            {/* <div className="flex h-16 items-center px-4 border-b border-base-300">
                <div className="flex items-center space-x-2">
                    <div className="avatar">
                        <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                            <span className="text-lg font-bold">CC</span>
                        </div>
                    </div>
                    <div className="text-lg font-semibold">Carbon Credit</div>
                </div>
            </div> */}

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
                        <div className="text-xs opacity-70">{user.title || 'Carbon Manager'}</div>
                    </div>
                </div>

                {/* Show company name if impersonating */}
                {isImpersonating && company && (
                    <div className="mt-2 p-2 bg-warning/10 rounded-lg text-sm">
                        <div className="flex justify-between items-center">
                            <span>Viewing: <strong>{company.name}</strong></span>
                            <button
                                onClick={stopImpersonating}
                                className="btn btn-xs btn-ghost"
                            >
                                Exit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                <ul className="menu gap-1">
                    {sections.map((section) => (
                        <li key={section.id} className="mb-2">
                            <div
                                className={`flex items-center justify-between p-2 font-medium ${openSection === section.id ? 'bg-base-200 rounded-lg' : ''}`}
                                onClick={() => toggleSection(section.id)}
                            >
                                <div className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d={section.icon}
                                        />
                                    </svg>
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
                                <ul className="menu pl-4 mt-1">
                                    {section.items.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={item.href}
                                                className={`py-2 ${activeItem === item.id ? 'bg-primary/10 text-primary font-medium rounded-lg' : ''}`}
                                                onClick={() => setActiveItem(item.id)}
                                            >
                                                {item.label}
                                            </Link>
                                            {item.subItems && activeItem === item.id && (
                                                <ul className="menu pl-2 mt-1">
                                                    {item.subItems.map((subItem) => (
                                                        <li key={subItem.id}>
                                                            <Link
                                                                href={subItem.href}
                                                                className={`py-2 text-sm ${window.currentSettingsTab === subItem.id ? 'text-primary font-medium' : ''}`}
                                                                onClick={() => { window.currentSettingsTab = subItem.id; }}
                                                            >
                                                                {subItem.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
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
