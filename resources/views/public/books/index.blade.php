@extends('layouts.public')

@section('title', 'Book Catalog - Baitulhikmah')

@section('content')
    <div class="bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h1 class="text-3xl font-extrabold text-gray-900 font-serif sm:text-4xl">
                    Book Catalog
                </h1>
                <p class="mt-4 text-lg text-gray-500">
                    Explore our extensive collection of books across various genres.
                </p>
            </div>

            <!-- Filters (Mock) -->
            <div class="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10">
                <button
                    class="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-600 text-white rounded-full text-xs sm:text-sm font-medium shadow-sm transition hover:bg-primary-700">All</button>
                <button
                    class="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-xs sm:text-sm font-medium shadow-sm transition hover:bg-gray-50 hover:text-primary-600">Fiction</button>
                <button
                    class="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-xs sm:text-sm font-medium shadow-sm transition hover:bg-gray-50 hover:text-primary-600">Non-Fiction</button>
                <button
                    class="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-xs sm:text-sm font-medium shadow-sm transition hover:bg-gray-50 hover:text-primary-600">Science</button>
                <button
                    class="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-xs sm:text-sm font-medium shadow-sm transition hover:bg-gray-50 hover:text-primary-600">Islamic
                    Studies</button>
            </div>

            <!-- Book Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                <!-- Mock Book 1 -->
                <div
                    class="bg-white rounded-lg overflow-hidden shadow-sm group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div class="aspect-[2/3] bg-gray-200 w-full relative overflow-hidden shrink-0">
                        <div
                            class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 text-center p-2 group-hover:scale-105 transition-transform duration-300 font-medium">
                            Map of Meaning
                        </div>
                        <span class="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">ID:
                            8820</span>
                    </div>
                    <div class="p-3 sm:p-4 flex flex-col flex-grow">
                        <h3
                            class="font-bold text-sm sm:text-base text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                            Map of Meaning</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mb-2">Jordan Peterson</p>

                        <div class="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                            This book explores the architecture of belief, offering a modern take on the connection between
                            myths, beliefs, and scientific understanding. Jordan Peterson dives deep into structure of chaos
                            and order. <span class="text-primary-600 font-semibold cursor-pointer hover:underline">...read
                                more</span>
                        </div>

                        <div class="flex items-center justify-between mt-auto">
                            <span
                                class="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 rounded text-gray-600">Psychology</span>
                            <div class="flex items-center text-yellow-400">
                                <span class="text-xs sm:text-sm font-bold mr-1 text-gray-900">4.8</span>
                                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mock Book 2 -->
                <div
                    class="bg-white rounded-lg overflow-hidden shadow-sm group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div class="aspect-[2/3] bg-gray-200 w-full relative overflow-hidden shrink-0">
                        <div
                            class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 text-center p-2 group-hover:scale-105 transition-transform duration-300 font-medium">
                            Atomic Habits
                        </div>
                        <span class="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">ID:
                            8821</span>
                    </div>
                    <div class="p-3 sm:p-4 flex flex-col flex-grow">
                        <h3
                            class="font-bold text-sm sm:text-base text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                            Atomic Habits</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mb-2">James Clear</p>

                        <div class="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                            An easy and proven way to build good habits and break bad ones. James Clear reveals practical
                            strategies that will teach you exactly how to form good habits, break bad ones, and master the
                            tiny behaviors that lead to remarkable results. <span
                                class="text-primary-600 font-semibold cursor-pointer hover:underline">...read more</span>
                        </div>

                        <div class="flex items-center justify-between mt-auto">
                            <span
                                class="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 rounded text-gray-600">Self-Help</span>
                            <div class="flex items-center text-yellow-400">
                                <span class="text-xs sm:text-sm font-bold mr-1 text-gray-900">4.9</span>
                                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mock Book 3 -->
                <div
                    class="bg-white rounded-lg overflow-hidden shadow-sm group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div class="aspect-[2/3] bg-gray-200 w-full relative overflow-hidden shrink-0">
                        <div
                            class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 text-center p-2 group-hover:scale-105 transition-transform duration-300 font-medium">
                            Al-Hikam
                        </div>
                        <span class="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">ID:
                            8822</span>
                    </div>
                    <div class="p-3 sm:p-4 flex flex-col flex-grow">
                        <h3
                            class="font-bold text-sm sm:text-base text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                            Al-Hikam</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mb-2">Ibn Ata'illah</p>

                        <div class="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                            Classic book of Sufi wisdom. A collection of aphorisms designed to guide the seeker on the
                            spiritual path to God. Rich in metaphors and profound insights into the human soul. <span
                                class="text-primary-600 font-semibold cursor-pointer hover:underline">...read more</span>
                        </div>

                        <div class="flex items-center justify-between mt-auto">
                            <span
                                class="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 rounded text-gray-600">Islamic</span>
                            <div class="flex items-center text-yellow-400">
                                <span class="text-xs sm:text-sm font-bold mr-1 text-gray-900">5.0</span>
                                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mock Book 4 -->
                <div
                    class="bg-white rounded-lg overflow-hidden shadow-sm group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div class="aspect-[2/3] bg-gray-200 w-full relative overflow-hidden shrink-0">
                        <div
                            class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 text-center p-2 group-hover:scale-105 transition-transform duration-300 font-medium">
                            Deep Work
                        </div>
                        <span class="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">ID:
                            8823</span>
                    </div>
                    <div class="p-3 sm:p-4 flex flex-col flex-grow">
                        <h3
                            class="font-bold text-sm sm:text-base text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                            Deep Work</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mb-2">Cal Newport</p>

                        <div class="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                            Rules for focused success in a distracted world. Deep work allows you to master complicated
                            information and produce better results in less time. <span
                                class="text-primary-600 font-semibold cursor-pointer hover:underline">...read more</span>
                        </div>

                        <div class="flex items-center justify-between mt-auto">
                            <span
                                class="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 rounded text-gray-600">Productivity</span>
                            <div class="flex items-center text-yellow-400">
                                <span class="text-xs sm:text-sm font-bold mr-1 text-gray-900">4.7</span>
                                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mock Book 5 -->
                <div
                    class="bg-white rounded-lg overflow-hidden shadow-sm group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div class="aspect-[2/3] bg-gray-200 w-full relative overflow-hidden shrink-0">
                        <div
                            class="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100 text-center p-2 group-hover:scale-105 transition-transform duration-300 font-medium">
                            Sapiens
                        </div>
                        <span class="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">ID:
                            8824</span>
                    </div>
                    <div class="p-3 sm:p-4 flex flex-col flex-grow">
                        <h3
                            class="font-bold text-sm sm:text-base text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                            Sapiens</h3>
                        <p class="text-xs sm:text-sm text-gray-500 mb-2">Yuval Noah Harari</p>

                        <div class="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                            A brief history of humankind, exploring how biology and history have defined us and enhanced our
                            understanding of what it means to be human. <span
                                class="text-primary-600 font-semibold cursor-pointer hover:underline">...read more</span>
                        </div>

                        <div class="flex items-center justify-between mt-auto">
                            <span
                                class="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 rounded text-gray-600">History</span>
                            <div class="flex items-center text-yellow-400">
                                <span class="text-xs sm:text-sm font-bold mr-1 text-gray-900">4.6</span>
                                <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination (Mock) -->
            <div class="mt-12 flex justify-center">
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#"
                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span class="sr-only">Previous</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                            aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </a>
                    <a href="#" aria-current="page"
                        class="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        1
                    </a>
                    <a href="#"
                        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        2
                    </a>
                    <a href="#"
                        class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        3
                    </a>
                    <a href="#"
                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span class="sr-only">Next</span>
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                            aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </a>
                </nav>
            </div>
        </div>
    </div>
@endsection