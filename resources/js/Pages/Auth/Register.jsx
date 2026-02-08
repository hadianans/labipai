import React, { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout
            title="Join Our Community"
            subtitle="Start your journey with us. Create an account to borrow books, join courses, and access exclusive content."
        >
            <Head title="Register" />

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 font-serif">Create your account</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Already have an account? <Link href={route('login')} className="font-medium text-primary-600 hover:text-primary-500 hover:underline">Sign in instead</Link>
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">Student ID (NIM)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .854.448 1.621 1.138 2.088C11.666 8.448 12 9.176 12 10v1c0 1.105-.895 2-2 2H9" /></svg>
                        </div>
                        <input
                            id="id"
                            name="id"
                            type="number"
                            value={data.id}
                            className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                            placeholder="e.g. 2005123"
                            isFocused={true}
                            onChange={(e) => setData('id', e.target.value)}
                            required
                        />
                    </div>
                    {errors.id && <div className="text-red-600 mt-1 text-sm">{errors.id}</div>}
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <input
                            id="username"
                            name="username"
                            value={data.username}
                            className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                            placeholder="e.g. Hadiana Nasrullah"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                        />
                    </div>
                    {errors.username && <div className="text-red-600 mt-1 text-sm">{errors.username}</div>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                            // placeholder="hadianans@upi.edu"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <div className="text-red-600 mt-1 text-sm">{errors.email}</div>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    {errors.password && <div className="text-red-600 mt-1 text-sm">{errors.password}</div>}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full pl-10 pr-3 py-3 border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                    {errors.password_confirmation && <div className="text-red-600 mt-1 text-sm">{errors.password_confirmation}</div>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        disabled={processing}
                    >
                        {processing ? 'Creating account...' : 'Create Account'}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Baitulhikmah Library. All rights reserved.
            </div>
        </GuestLayout>
    );
}
