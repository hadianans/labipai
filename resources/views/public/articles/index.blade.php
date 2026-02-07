@extends('layouts.public')

@section('title', 'Articles - Baitulhikmah')

@section('content')
    <div class="bg-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h1 class="text-3xl font-extrabold text-gray-900 font-serif sm:text-4xl">
                    Articles & Blog
                </h1>
                <p class="mt-4 text-lg text-gray-500">
                    Read our latest insights, news, and stories.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Mock Article 1 -->
                <div class="card p-0 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div class="h-48 bg-gray-200 relative">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                            Article Image
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <span class="text-xs font-semibold tracking-wide uppercase text-primary-600">Education</span>
                            <span class="mx-2 text-gray-300">&bull;</span>
                            <span class="text-xs text-gray-500">Jan 12, 2026</span>
                        </div>
                        <a href="#" class="block mt-2">
                            <h3 class="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">The
                                Importance of Lifelong Learning</h3>
                            <p class="mt-3 text-base text-gray-500">
                                Learning doesn't stop after school. Discover why continuous education is key to personal and
                                professional growth.
                            </p>
                        </a>
                        <div class="mt-6 flex items-center">
                            <div class="flex-shrink-0">
                                <span class="sr-only">Author</span>
                                <div
                                    class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                                    A</div>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-gray-900">Admin</p>
                                <div class="flex space-x-1 text-sm text-gray-500">
                                    <span>5 min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mock Article 2 -->
                <div class="card p-0 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div class="h-48 bg-gray-200 relative">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                            Article Image
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <span class="text-xs font-semibold tracking-wide uppercase text-secondary-600">Community</span>
                            <span class="mx-2 text-gray-300">&bull;</span>
                            <span class="text-xs text-gray-500">Jan 08, 2026</span>
                        </div>
                        <a href="#" class="block mt-2">
                            <h3 class="text-xl font-semibold text-gray-900 hover:text-secondary-600 transition-colors">
                                Building a Stronger Community</h3>
                            <p class="mt-3 text-base text-gray-500">
                                How we can work together to create a supportive and thriving environment for everyone.
                            </p>
                        </a>
                        <div class="mt-6 flex items-center">
                            <div class="flex-shrink-0">
                                <span class="sr-only">Author</span>
                                <div
                                    class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                                    S</div>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-gray-900">Sarah</p>
                                <div class="flex space-x-1 text-sm text-gray-500">
                                    <span>4 min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mock Article 3 -->
                <div class="card p-0 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div class="h-48 bg-gray-200 relative">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                            Article Image
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <span class="text-xs font-semibold tracking-wide uppercase text-green-600">Events</span>
                            <span class="mx-2 text-gray-300">&bull;</span>
                            <span class="text-xs text-gray-500">Jan 05, 2026</span>
                        </div>
                        <a href="#" class="block mt-2">
                            <h3 class="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors">Recap:
                                Annual Book Fair</h3>
                            <p class="mt-3 text-base text-gray-500">
                                A look back at the highlights from our successful annual book fair held last week.
                            </p>
                        </a>
                        <div class="mt-6 flex items-center">
                            <div class="flex-shrink-0">
                                <span class="sr-only">Author</span>
                                <div
                                    class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">
                                    J</div>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-gray-900">John</p>
                                <div class="flex space-x-1 text-sm text-gray-500">
                                    <span>3 min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection