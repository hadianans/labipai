@extends('layouts.public')

@section('title', 'Courses - Baitulhikmah')

@section('content')
    <div class="bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h1 class="text-3xl font-extrabold text-gray-900 font-serif sm:text-4xl">
                    Course Catalog
                </h1>
                <p class="mt-4 text-lg text-gray-500">
                    Enroll in our courses to enhance your skills and knowledge.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Mock Course 1 -->
                <div
                    class="card flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden p-0">
                    <div class="h-48 bg-gray-200 w-full relative">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                            Course Image
                        </div>
                        <span
                            class="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900">Beginner</span>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <span class="text-primary-600 text-sm font-semibold mb-2">Technology</span>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Introduction to Web Development</h3>
                        <p class="text-gray-600 mb-4 flex-grow text-sm">Learn the basics of HTML, CSS, and JavaScript to
                            build your first website.</p>

                        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div class="flex items-center text-gray-500 text-sm">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                8 Weeks
                            </div>
                            <div class="flex items-center text-gray-500 text-sm">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                    </path>
                                </svg>
                                25 Students
                            </div>
                        </div>
                        <div class="mt-4">
                            <a href="#" class="btn-primary w-full py-2">Enroll Now</a>
                        </div>
                    </div>
                </div>

                <!-- Mock Course 2 -->
                <div
                    class="card flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden p-0">
                    <div class="h-48 bg-gray-200 w-full relative">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                            Course Image
                        </div>
                        <span
                            class="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900">Intermediate</span>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <span class="text-secondary-600 text-sm font-semibold mb-2">Arts</span>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Creative Writing Masterclass</h3>
                        <p class="text-gray-600 mb-4 flex-grow text-sm">Unlock your creativity and learn the art of
                            storytelling from experienced authors.</p>

                        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div class="flex items-center text-gray-500 text-sm">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                6 Weeks
                            </div>
                            <div class="flex items-center text-gray-500 text-sm">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                    </path>
                                </svg>
                                18 Students
                            </div>
                        </div>
                        <div class="mt-4">
                            <a href="#" class="btn-primary w-full py-2">Enroll Now</a>
                        </div>
                    </div>
                </div>

                <!-- Mock Course 3 -->
                <div
                    class="card flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden p-0">
                    <div class="h-48 bg-gray-200 w-full relative">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                            Course Image
                        </div>
                        <span
                            class="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900">Advanced</span>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <span class="text-green-600 text-sm font-semibold mb-2">Religious Studies</span>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Advanced Fiqh Studies</h3>
                        <p class="text-gray-600 mb-4 flex-grow text-sm">Deep dive into Islamic jurisprudence and
                            understanding complex rulings.</p>

                        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div class="flex items-center text-gray-500 text-sm">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                12 Weeks
                            </div>
                            <div class="flex items-center text-gray-500 text-sm">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                    </path>
                                </svg>
                                30 Students
                            </div>
                        </div>
                        <div class="mt-4">
                            <a href="#" class="btn-primary w-full py-2">Enroll Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection