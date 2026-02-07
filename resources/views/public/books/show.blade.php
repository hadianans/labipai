@extends('layouts.public')

@section('title', $book['title'] . ' - Baitulhikmah')

@section('content')
    <!-- Breadcrumbs -->
    <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav class="flex text-sm text-gray-500">
                <a href="{{ route('home') }}" class="hover:text-primary-600">Home</a>
                <svg class="h-5 w-5 mx-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                </svg>
                <a href="{{ route('books.index') }}" class="hover:text-primary-600">Books</a>
                <svg class="h-5 w-5 mx-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                </svg>
                <span class="text-gray-900 font-medium truncate max-w-xs">{{ $book['title'] }}</span>
            </nav>
        </div>
    </div>

    <div class="bg-neutral-bg py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Top Section: Info & Cover -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                <div class="grid grid-cols-1 md:grid-cols-3">
                    <!-- Cover Image -->
                    <div class="bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
                        <div
                            class="w-full max-w-sm shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-500">
                            <img src="{{ $book['img_url'] }}" alt="{{ $book['title'] }}" class="w-full h-auto">
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="col-span-2 p-8 md:p-12">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h1 class="text-4xl font-serif font-bold text-gray-900 mb-2">{{ $book['title'] }}</h1>
                                <p class="text-xl text-primary-600 font-medium">{{ $book['author'] }}</p>
                            </div>
                            <div class="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                <svg class="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span class="ml-2 font-bold text-gray-900">{{ $book['rating'] }}</span>
                                <span class="text-xs text-gray-500 ml-1">({{ $book['reviews_count'] }} reviews)</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 text-sm">
                            <div>
                                <span class="block text-gray-400 mb-1">Publisher</span>
                                <span class="font-semibold text-gray-900">{{ $book['publisher'] }}</span>
                            </div>
                            <div>
                                <span class="block text-gray-400 mb-1">Year</span>
                                <span class="font-semibold text-gray-900">{{ $book['year'] }}</span>
                            </div>
                            <div>
                                <span class="block text-gray-400 mb-1">Pages</span>
                                <span class="font-semibold text-gray-900">{{ $book['page'] }}</span>
                            </div>
                            <div>
                                <span class="block text-gray-400 mb-1">Language</span>
                                <span class="font-semibold text-gray-900">{{ $book['language'] }}</span>
                            </div>
                            <div>
                                <span class="block text-gray-400 mb-1">ISBN</span>
                                <span class="font-semibold text-gray-900">{{ $book['isbn'] }}</span>
                            </div>
                            <div>
                                <span class="block text-gray-400 mb-1">Type</span>
                                <span
                                    class="font-semibold text-gray-900">{{ $book['type'] == '1' ? 'Open Access' : 'Restricted' }}</span>
                            </div>
                            <div>
                                <span class="block text-gray-400 mb-1">Status</span>
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $book['status'] == '0' ? 'bg-green-100 text-green-800' : ($book['status'] == '1' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800') }}">
                                    {{ $book['status_label'] }}
                                </span>
                            </div>
                        </div>

                        <div class="prose max-w-none text-gray-600 mb-8 leading-relaxed">
                            <h3 class="text-gray-900 font-serif font-bold text-lg mb-2">Synopsis</h3>
                            {!! nl2br(e($book['synopsis'])) !!}
                        </div>

                        <div class="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
                            @if ($book['status'] == '0')
                                <button
                                    class="btn-primary px-8 py-3 rounded-xl shadow-lg shadow-primary-500/30 font-bold text-lg flex items-center justify-center">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                                        </path>
                                    </svg>
                                    Borrow Book
                                </button>
                            @elseif ($book['status'] == '1')
                                <button disabled
                                    class="bg-gray-200 text-gray-500 px-8 py-3 rounded-xl font-bold text-lg flex items-center justify-center cursor-not-allowed">
                                    Unavailable
                                </button>
                                <span class="text-sm text-yellow-600 mt-2 sm:mt-0 sm:ml-4 flex items-center">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Expected return: 3 days
                                </span>
                            @else
                                <button disabled
                                    class="bg-red-100 text-red-500 px-8 py-3 rounded-xl font-bold text-lg flex items-center justify-center cursor-not-allowed">
                                    Lost / Archive
                                </button>
                            @endif

                            <button
                                class="btn-secondary px-8 py-3 rounded-xl shadow-lg shadow-secondary-500/30 font-bold text-lg flex items-center justify-center">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                                    </path>
                                </svg>
                                Add to Favorites
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reviews Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Reviews List -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 class="text-2xl font-serif font-bold text-gray-900 mb-6">Reviews & Ratings</h2>

                        <div class="space-y-8">
                            @foreach ($reviews as $review)
                                <div class="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                    <div class="flex-shrink-0">
                                        <div
                                            class="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-lg">
                                            {{ substr($review['user'], 0, 1) }}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex items-center justify-between mb-2">
                                            <h4 class="font-bold text-gray-900">{{ $review['user'] }}</h4>
                                            <span
                                                class="text-sm text-gray-400">{{ \Carbon\Carbon::parse($review['date'])->diffForHumans() }}</span>
                                        </div>
                                        <div class="flex items-center mb-2">
                                            @for ($i = 1; $i <= 5; $i++)
                                                <svg class="w-4 h-4 {{ $i <= $review['star'] ? 'text-yellow-400 fill-current' : 'text-gray-200' }}"
                                                    viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            @endfor
                                        </div>
                                        <p class="text-gray-600">{{ $review['comment'] }}</p>
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        <div class="mt-8 text-center">
                            <button class="text-primary-600 font-medium hover:text-primary-700">View all reviews</button>
                        </div>
                    </div>
                </div>

                <!-- Sidebar (e.g. Related or CTA) -->
                <div>
                    <div class="bg-primary-50 rounded-2xl p-8 border border-primary-100">
                        <h3 class="text-xl font-serif font-bold text-primary-900 mb-4">Rate this book</h3>
                        <p class="text-gray-600 mb-6">Share your thoughts with other readers. Write a review and tell us
                            what you think.</p>
                        <button class="w-full btn-primary py-3 rounded-lg shadow-sm">Write Review</button>
                        <p class="text-xs text-center text-gray-400 mt-4">You must be logged in to review.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection