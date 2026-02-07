import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { url, props } = usePage();
    const { flash } = props;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: flash.success,
                timer: 3000,
                showConfirmButton: false
            });
        }
        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error,
            });
        }
        if (flash?.message) {
            Swal.fire({
                icon: 'info',
                title: 'Info',
                text: flash.message,
            });
        }
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <h1 className="text-xl font-bold text-primary">Baitulhikmah</h1>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 md:-my-px md:ml-10 md:flex">
                                <Link
                                    href={route('dashboard')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${route().current('dashboard')
                                        ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('my-books.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${route().current('my-books.*')
                                        ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                                        }`}
                                >
                                    My Books
                                </Link>
                                {/* <Link
                                    href={route('my-courses.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${route().current('my-courses.*')
                                        ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                                        }`}
                                >
                                    My Courses
                                </Link> */}
                                <Link
                                    href={route('feedback.index')}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${route().current('feedback.*')
                                        ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
                                        }`}
                                >
                                    Feedback
                                </Link>
                            </div>
                        </div>

                        <div className="hidden md:flex md:items-center md:ml-6">
                            <div className="ml-3 relative">
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('profile.edit')}
                                        className="text-sm text-gray-500 hover:text-gray-900"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-sm text-red-600 hover:text-red-900"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center md:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href={route('dashboard')}
                            className={`block w-full pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium transition duration-150 ease-in-out ${route().current('dashboard')
                                ? 'border-indigo-400 text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700'
                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={route('my-books.index')}
                            className="block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-left text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                        >
                            My Books
                        </Link>
                        <Link
                            href={route('my-courses.index')}
                            className="block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-left text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                        >
                            My Courses
                        </Link>
                        <Link
                            href={route('feedback.index')}
                            className="block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-left text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                        >
                            Feedback
                        </Link>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.username}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <Link
                                href={route('profile.edit')}
                                className="block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-left text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                            >
                                Profile
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-left text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
