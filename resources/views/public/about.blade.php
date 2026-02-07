@extends('layouts.public')

@section('title', 'About Us - Baitulhikmah')

@section('content')
    <!-- Hero Section -->
    <div class="bg-primary-900 py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl font-extrabold text-white font-serif sm:text-5xl">
                About Baitulhikmah
            </h1>
            <p class="mt-4 text-xl text-primary-200 max-w-2xl mx-auto">
                A center dedicated to the pursuit of knowledge, wisdom, and community development.
            </p>
        </div>
    </div>

    <!-- Visi Misi Section -->
    <div class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <div class="bg-primary-50 rounded-2xl p-8 h-full border border-primary-100">
                        <h2 class="text-2xl font-bold text-primary-900 mb-4 font-serif flex items-center">
                            <svg class="w-8 h-8 mr-3 text-primary-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                </path>
                            </svg>
                            Our Vision
                        </h2>
                        <p class="text-gray-700 leading-relaxed text-lg">
                            To become a leading center of excellence in cultivating knowledge, wisdom, and moral values,
                            inspiring positive change in society and nurturing future generations of leaders.
                        </p>
                    </div>
                </div>
                <div>
                    <div class="bg-secondary-50 rounded-2xl p-8 h-full border border-secondary-100">
                        <h2 class="text-2xl font-bold text-secondary-900 mb-4 font-serif flex items-center">
                            <svg class="w-8 h-8 mr-3 text-secondary-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                                </path>
                            </svg>
                            Our Mission
                        </h2>
                        <ul class="space-y-3 text-gray-700">
                            <li class="flex items-start">
                                <svg class="w-5 h-5 mr-2 text-secondary-500 mt-1" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Provide accessible and high-quality educational resources to the community.</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 mr-2 text-secondary-500 mt-1" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Foster a culture of lifelong learning and critical thinking.</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 mr-2 text-secondary-500 mt-1" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Facilitate intellectual and spiritual growth through diverse programs.</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 mr-2 text-secondary-500 mt-1" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Engage with the community to address social challenges through wisdom and
                                    compassion.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Organization Structure Section -->
    <div class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-extrabold text-gray-900 font-serif sm:text-4xl">
                    Organization Structure
                </h2>
                <p class="mt-4 text-lg text-gray-500">
                    Meet the dedicated team behind Baitulhikmah.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <!-- Director -->
                <div class="md:col-start-2">
                    <div class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary-500">
                        <div
                            class="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500 text-2xl font-bold">
                            AZ
                        </div>
                        <h3 class="text-xl font-bold text-gray-900">Ahmad Zaki</h3>
                        <p class="text-primary-600 font-medium">Director</p>
                    </div>
                </div>

                <!-- Second Row -->
                <div class="md:col-start-1">
                    <div class="bg-white rounded-xl shadow p-6 border-t-4 border-secondary-500">
                        <div
                            class="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500 text-xl font-bold">
                            SK
                        </div>
                        <h3 class="text-lg font-bold text-gray-900">Sarah Khan</h3>
                        <p class="text-secondary-600 font-medium">Head of Education</p>
                    </div>
                </div>
                <div class="md:col-start-2">
                    <div class="bg-white rounded-xl shadow p-6 border-t-4 border-yellow-500">
                        <div
                            class="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500 text-xl font-bold">
                            OM
                        </div>
                        <h3 class="text-lg font-bold text-gray-900">Omar Malik</h3>
                        <p class="text-yellow-600 font-medium">Head of Library</p>
                    </div>
                </div>
                <div class="md:col-start-3">
                    <div class="bg-white rounded-xl shadow p-6 border-t-4 border-blue-500">
                        <div
                            class="w-20 h-20 mx-auto rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500 text-xl font-bold">
                            FL
                        </div>
                        <h3 class="text-lg font-bold text-gray-900">Fatima Lee</h3>
                        <p class="text-blue-600 font-medium">Head of Outreach</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection