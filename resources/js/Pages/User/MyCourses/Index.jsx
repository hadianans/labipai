import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, enrolled_courses }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Courses</h2>}
        >
            <Head title="My Courses" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {enrolled_courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolled_courses.map((enrollment) => (
                                <div key={enrollment.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col h-full">
                                    <div className="p-6 flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{enrollment.course.title}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{enrollment.course.description}</p>

                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${enrollment.progress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 text-right">{enrollment.progress}% Complete</p>
                                    </div>
                                    <div className="p-6 pt-0 mt-auto">
                                        <Link
                                            href={route('my-courses.show', enrollment.course.id)}
                                            className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                                        >
                                            Continue Learning
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-10 text-center">
                            <h3 className="text-xl font-medium text-gray-900">You are not enrolled in any courses yet.</h3>
                            <p className="text-gray-500 mt-2 mb-6">Explore our course catalog to find something interesting.</p>
                            <Link href={route('courses.index')} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Browse Courses</Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
