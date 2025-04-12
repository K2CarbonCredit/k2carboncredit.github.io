import InputError from '@/Components/InputError';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState } from 'react';

export default function UpdateProfileInformationForm({ className = '', mustVerifyEmail = false, status }) {
    const user = usePage().props.auth.user;
    const [darkMode, setDarkMode] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name || '',
        email: user.email || '',
        title: user.title || 'Chief Sustainability Officer',
        department: user.department || 'PlanA India',
        about: user.about || "I'm in charge of driving sustainability initiatives at the organization.",
        language: user.language || 'English',
        timezone: user.timezone || 'IST',
        sex: user.sex || 'Male',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-lg font-medium">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="avatar">
                                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={user.profile_photo_url || 'https://placehold.co/100x100'} alt="Profile" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium">{data.name}</h3>
                                <p className="text-sm text-gray-500">{data.email}</p>
                                {mustVerifyEmail && user.email_verified_at === null && (
                                    <p className="text-sm mt-2">
                                        <span className="badge badge-warning">Your email address is unverified.</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Name</span>
                            </label>
                            <input 
                                type="text" 
                                className="input input-bordered w-full" 
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <div className="text-error text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input 
                                type="email" 
                                className="input input-bordered w-full" 
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Title</span>
                            </label>
                            <input 
                                type="text" 
                                className="input input-bordered w-full" 
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            {errors.title && <div className="text-error text-sm mt-1">{errors.title}</div>}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Department</span>
                            </label>
                            <input 
                                type="text" 
                                className="input input-bordered w-full" 
                                value={data.department}
                                onChange={(e) => setData('department', e.target.value)}
                            />
                            {errors.department && <div className="text-error text-sm mt-1">{errors.department}</div>}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">About</span>
                            </label>
                            <textarea 
                                className="textarea textarea-bordered w-full h-24" 
                                value={data.about}
                                onChange={(e) => setData('about', e.target.value)}
                            ></textarea>
                            {errors.about && <div className="text-error text-sm mt-1">{errors.about}</div>}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Language</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                value={data.language}
                                onChange={(e) => setData('language', e.target.value)}
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>Hindi</option>
                                <option>Chinese</option>
                            </select>
                            {errors.language && <div className="text-error text-sm mt-1">{errors.language}</div>}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Timezone</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                value={data.timezone}
                                onChange={(e) => setData('timezone', e.target.value)}
                            >
                                <option>IST</option>
                                <option>UTC</option>
                                <option>EST</option>
                                <option>PST</option>
                                <option>CST</option>
                                <option>JST</option>
                            </select>
                            {errors.timezone && <div className="text-error text-sm mt-1">{errors.timezone}</div>}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Sex</span>
                            </label>
                            <select 
                                className="select select-bordered w-full" 
                                value={data.sex}
                                onChange={(e) => setData('sex', e.target.value)}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                                <option>Prefer not to say</option>
                            </select>
                            {errors.sex && <div className="text-error text-sm mt-1">{errors.sex}</div>}
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-3">
                                <span className="label-text font-medium">Dark Mode</span>
                                <input 
                                    type="checkbox" 
                                    className="toggle toggle-primary" 
                                    checked={darkMode}
                                    onChange={(e) => setDarkMode(e.target.checked)}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-in-out"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="mt-4"
                >
                    <div className="alert alert-success">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Profile updated successfully.</span>
                    </div>
                </Transition>
            </form>
        </section>
    );
}