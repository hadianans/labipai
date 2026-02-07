import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function CourseIndex() {
    return (
        <PublicLayout>
            <Head title="Courses - Baitulhikmah" />

            <div className="bg-neutral-bg py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-extrabold text-gray-900 font-serif sm:text-4xl">
                            Our Courses
                        </h1>
                        <p className="mt-4 text-lg text-gray-500">
                            Enhance your knowledge with our specialized programs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Mock Data for visual purpose */}
                        {[
                            { id: 1, level: 'Beginner', color: 'bg-green-100 text-green-800' },
                            { id: 2, level: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
                            { id: 3, level: 'Advanced', color: 'bg-blue-100 text-blue-800' },
                            { id: 4, level: 'Expert', color: 'bg-red-100 text-red-800' },
                            { id: 5, level: 'Beginner', color: 'bg-green-100 text-green-800' },
                            { id: 6, level: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' }
                        ].map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                                <div className="h-48 bg-primary-100 flex items-center justify-center text-primary-400">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v5m0 0v5m0-5h5m-5 0H7"></path></svg>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-accent-600 uppercase">Education</span>
                                        <span className={`${item.color} text-xs font-medium px-2.5 py-0.5 rounded`}>{item.level}</span>
                                    </div>
                                    <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">Islamic Philosophy {item.id}</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        An introduction to the major schools of Islamic thought and their relevance today.
                                    </p>
                                    <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            8 Weeks
                                        </div>
                                        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">Enroll Now &rarr;</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
