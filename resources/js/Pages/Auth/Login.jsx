import React, { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout
            title="Welcome Back"
            subtitle="Sign in to access your digital library, track your borrowing history, and manage your courses."
        >
            <Head title="Log in" />

            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 font-serif">Sign in to your account</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Or <Link href={route('register')} className="font-medium text-primary-600 hover:text-primary-500 hover:underline">create a new account</Link>
                </p>
            </div>

            {status && <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-100">{status}</div>}

            <form onSubmit={submit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
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
                            placeholder="you@example.com"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
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
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    {errors.password && <div className="text-red-600 mt-1 text-sm">{errors.password}</div>}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>

                    {canResetPassword && (
                        <div className="text-sm">
                            <Link
                                href={route('password.request')}
                                className="font-medium text-primary-600 hover:text-primary-500 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        disabled={processing}
                    >
                        {processing ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Baitulhikmah Library. All rights reserved.
            </div>
        </GuestLayout>
    );
}
