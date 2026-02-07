import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, course, progress }) {
    const [activeModule, setActiveModule] = useState(course.modules.length > 0 ? course.modules[0].id : null);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{course.title}</h2>}
        >
            <Head title={course.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
                    {/* Sidebar / Modules List */}
                    <div className="w-full lg:w-1/3 bg-white overflow-hidden shadow-sm sm:rounded-lg h-fit">
                        <div className="p-4 border-b">
                            <h3 className="font-bold text-lg">Course Modules</h3>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{progress}% Complete</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {course.modules.map((module) => (
                                <div key={module.id} className="collapse collapse-arrow">
                                    <input
                                        type="radio"
                                        name="my-accordion-2"
                                        checked={activeModule === module.id}
                                        onChange={() => setActiveModule(module.id)}
                                    />
                                    <div className="collapse-title text-md font-medium px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                        {module.title}
                                    </div>
                                    <div className="collapse-content px-4 pb-4">
                                        <ul className="space-y-2 mt-2">
                                            {module.contents && module.contents.map((content) => (
                                                <li key={content.id} className="flex items-center text-sm p-2 hover:bg-gray-100 rounded cursor-pointer">
                                                    <span className="mr-2 text-gray-400">
                                                        {content.type === '1' ? '🎥' : '📄'}
                                                    </span>
                                                    <span>{content.title}</span>
                                                    {/* Add checkmark if done (needs activity log data) */}
                                                </li>
                                            ))}
                                            {(!module.contents || module.contents.length === 0) && (
                                                <li className="text-gray-400 text-xs italic">No content available</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="w-full lg:w-2/3 bg-white overflow-hidden shadow-sm sm:rounded-lg min-h-[500px] p-6">
                        <div className="text-center h-full flex flex-col justify-center items-center text-gray-500">
                            <p className="text-lg mb-2">Select a module content to view</p>
                            <p className="text-sm">Content viewer will be implemented here (Video/Text)</p>
                            {/* In a real implementation, you would have state for 'selectedContent' and render it here */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
