@extends('layouts.public')

@section('title', 'Gallery - Baitulhikmah')

@section('content')
    <div class="bg-gray-50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h1 class="text-3xl font-extrabold text-gray-900 font-serif sm:text-4xl">
                    Photo Gallery
                </h1>
                <p class="mt-4 text-lg text-gray-500">
                    Moments captured from our events and activities.
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Mock Gallery Item 1 -->
                <div
                    class="group relative aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-primary-500 cursor-pointer">
                    <div
                        class="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500 group-hover:opacity-75 transition-opacity">
                        Image 1
                    </div>
                    <!-- Overlay -->
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p class="text-white font-medium">Community Gathering</p>
                    </div>
                    <button type="button" class="absolute inset-0 focus:outline-none">
                        <span class="sr-only">View details for Community Gathering</span>
                    </button>
                </div>

                <!-- Mock Gallery Item 2 -->
                <div
                    class="group relative aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-primary-500 cursor-pointer">
                    <div
                        class="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500 group-hover:opacity-75 transition-opacity">
                        Image 2
                    </div>
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p class="text-white font-medium">Workshop Session</p>
                    </div>
                </div>

                <!-- Mock Gallery Item 3 -->
                <div
                    class="group relative aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-primary-500 cursor-pointer">
                    <div
                        class="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500 group-hover:opacity-75 transition-opacity">
                        Image 3
                    </div>
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p class="text-white font-medium">Library Tour</p>
                    </div>
                </div>

                <!-- Mock Gallery Item 4 -->
                <div
                    class="group relative aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-primary-500 cursor-pointer">
                    <div
                        class="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500 group-hover:opacity-75 transition-opacity">
                        Image 4
                    </div>
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p class="text-white font-medium">Charity Drive</p>
                    </div>
                </div>

                <!-- Mock Gallery Item 5 -->
                <div
                    class="group relative aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-primary-500 cursor-pointer">
                    <div
                        class="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500 group-hover:opacity-75 transition-opacity">
                        Image 5
                    </div>
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p class="text-white font-medium">Guest Speaker</p>
                    </div>
                </div>

                <!-- Mock Gallery Item 6 -->
                <div
                    class="group relative aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-primary-500 cursor-pointer">
                    <div
                        class="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500 group-hover:opacity-75 transition-opacity">
                        Image 6
                    </div>
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p class="text-white font-medium">Reading Club</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection