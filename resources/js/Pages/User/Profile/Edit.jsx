import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        username: auth.user.username,
        email: auth.user.email,
        phone: auth.user.phone || '',
        photo: null,
        _method: 'PATCH',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'));
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Update your account's profile information and email address.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                                    <div className="mt-2 flex items-center gap-x-3">
                                        <img
                                            src={data.photo ? URL.createObjectURL(data.photo) : (auth.user.img_url || `https://ui-avatars.com/api/?name=${auth.user.username}&background=random`)}
                                            alt="Current profile photo"
                                            className="h-48 w-48 rounded-full object-cover"
                                        />
                                        <input
                                            type="file"
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            onChange={(e) => setData('photo', e.target.files[0])}
                                            accept="image/*"
                                        />
                                    </div>
                                    {errors.photo && <div className="text-red-600 mt-1 text-sm">{errors.photo}</div>}
                                </div>

                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        id="username"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        required
                                        autoComplete="username"
                                    />
                                    {errors.username && <div className="text-red-600 mt-1 text-sm">{errors.username}</div>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                    />
                                    {errors.email && <div className="text-red-600 mt-1 text-sm">{errors.email}</div>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        autoComplete="tel"
                                    />
                                    {errors.phone && <div className="text-red-600 mt-1 text-sm">{errors.phone}</div>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        disabled={processing}
                                    >
                                        Save
                                    </button>

                                    {recentlySuccessful && (
                                        <p className="text-sm text-gray-600 fade-in">Saved.</p>
                                    )}
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Password Update could be another section */}
                    {/* Delete Account could be another section */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
