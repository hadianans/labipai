@extends('layouts.public')

@section('title', 'Contact Us - Baitulhikmah')

@section('content')
    <div class="bg-gray-50 min-h-screen py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h1 class="text-3xl font-extrabold text-gray-900 font-serif sm:text-4xl">
                    Contact Us
                </h1>
                <p class="mt-4 text-lg text-gray-500">
                    We'd love to hear from you. Reach out to us for any inquiries.
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Contact Information & Map -->
                <div>
                    <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6 font-serif">Get in Touch</h2>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <div class="flex-shrink-0">
                                    <span
                                        class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600">
                                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                                            </path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                    </span>
                                </div>
                                <div class="ml-4">
                                    <h3 class="text-lg font-medium text-gray-900">Address</h3>
                                    <p class="mt-1 text-gray-500">123 Wisdom Street, Knowledge City, Country 45678</p>
                                </div>
                            </div>

                            <div class="flex items-start">
                                <div class="flex-shrink-0">
                                    <span
                                        class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600">
                                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z">
                                            </path>
                                        </svg>
                                    </span>
                                </div>
                                <div class="ml-4">
                                    <h3 class="text-lg font-medium text-gray-900">Phone</h3>
                                    <p class="mt-1 text-gray-500">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div class="flex items-start">
                                <div class="flex-shrink-0">
                                    <span
                                        class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600">
                                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                                            </path>
                                        </svg>
                                    </span>
                                </div>
                                <div class="ml-4">
                                    <h3 class="text-lg font-medium text-gray-900">Email</h3>
                                    <p class="mt-1 text-gray-500">info@baitulhikmah.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Google Map Placeholder -->
                    <div class="bg-gray-200 rounded-xl overflow-hidden h-64 md:h-80 relative shadow-lg">
                        <div class="absolute inset-0 flex items-center justify-center text-gray-500 font-medium">
                            Google Map Embed Placeholder
                        </div>
                        <!-- Embed code would go here -->
                    </div>
                </div>

                <!-- Contact Form -->
                <div>
                    <div class="bg-white rounded-xl shadow-lg p-8">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6 font-serif">Send us a message</h2>
                        <form action="#" method="POST" class="space-y-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" name="name" id="name" class="input-field mt-1" placeholder="Your Name">
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" id="email" class="input-field mt-1"
                                    placeholder="you@example.com">
                            </div>
                            <div>
                                <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
                                <input type="text" name="subject" id="subject" class="input-field mt-1"
                                    placeholder="Inquiry about...">
                            </div>
                            <div>
                                <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
                                <textarea name="message" id="message" rows="4" class="input-field mt-1"
                                    placeholder="How can we help you?"></textarea>
                            </div>
                            <div>
                                <button type="button" class="btn-primary w-full py-3 shadow-lg shadow-primary-500/30">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection