import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 px-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Books Borrowed</h3>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-semibold text-gray-900">{stats.books_borrowed}</span>
                                <span className="ml-2 text-sm text-gray-500">Active</span>
                            </div>
                            <div className="mt-4">
                                <Link href={route('my-books.index')} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View Books &rarr;</Link>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Courses Enrolled</h3>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-semibold text-gray-900">{stats.courses_enrolled}</span>
                                <span className="ml-2 text-sm text-gray-500">Active</span>
                            </div>
                            <div className="mt-4">
                                <Link href="#" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View Courses &rarr;</Link>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Favorite Books</h3>
                            <div className="mt-2 flex items-baseline">
                                <span className="text-3xl font-semibold text-gray-900">{stats.books_favorited}</span>
                            </div>
                            <div className="mt-4">
                                <Link href={route('my-books.index')} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View Favorites &rarr;</Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Welcome back, {auth.user.username}!</h3>
                            <p className="text-gray-600">
                                You are logged in. From here you can manage your library books, access your enrolled courses, and update your profile.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('home')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Go to Homepage
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
