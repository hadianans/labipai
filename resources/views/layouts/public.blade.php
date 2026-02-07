<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'Baitulhikmah')</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap"
        rel="stylesheet">

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="font-sans antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen">
    <nav class="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <!-- Logo -->
                <div class="shrink-0 flex items-center">
                    <a href="{{ route('home') }}"
                        class="font-serif text-2xl font-bold text-primary-700 flex items-center gap-2">
                        <span>Baitulhikmah</span>
                    </a>
                </div>

                <!-- Spacer -->
                <div class="flex-1"></div>

                <!-- Navigation Links -->
                <div class="hidden space-x-6 lg:space-x-8 sm:-my-px sm:flex sm:items-center">
                    <x-nav-link :href="route('home')" :active="request()->routeIs('home')">
                        Home
                    </x-nav-link>
                    <x-nav-link :href="route('books.index')" :active="request()->routeIs('books.*')">
                        Books
                    </x-nav-link>
                    <x-nav-link :href="route('courses.index')" :active="request()->routeIs('courses.*')">
                        Courses
                    </x-nav-link>
                    <x-nav-link :href="route('articles.index')" :active="request()->routeIs('articles.*')">
                        Articles
                    </x-nav-link>
                    <x-nav-link :href="route('gallery.index')" :active="request()->routeIs('gallery.*')">
                        Gallery
                    </x-nav-link>
                    <x-nav-link :href="route('about')" :active="request()->routeIs('about')">
                        About
                    </x-nav-link>
                    <x-nav-link :href="route('contact')" :active="request()->routeIs('contact')">
                        Contact
                    </x-nav-link>
                </div>

                <!-- Settings Dropdown / Auth -->
                <div class="hidden sm:flex sm:items-center sm:ml-6">
                    @auth
                        <a href="{{ url('/dashboard') }}" class="btn-primary text-sm px-4 py-2 rounded-full">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="btn-primary text-sm px-4 py-2 rounded-full">Login</a>
                    @endauth
                </div>

                <!-- Hamburger -->
                <div class="-mr-2 flex items-center sm:hidden">
                    <button @click="open = ! open"
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                        <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path :class="{'hidden': open, 'inline-flex': ! open }" class="inline-flex"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                            <path :class="{'hidden': ! open, 'inline-flex': open }" class="hidden"
                                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu (To be implemented with Alpine.js if available or simple JS) -->
    </nav>

    <!-- Page Content -->
    <main class="flex-grow">
        @yield('content')
    </main>

    <footer class="bg-gray-900 text-white mt-12 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 class="font-serif text-2xl font-bold mb-4">Baitulhikmah</h3>
                <p class="text-gray-400 text-sm">Empowering the community through knowledge and wisdom.</p>
            </div>
            <div>
                <h4 class="font-bold text-lg mb-4">Quick Links</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="{{ route('books.index') }}" class="hover:text-white transition">Books</a></li>
                    <li><a href="{{ route('courses.index') }}" class="hover:text-white transition">Courses</a></li>
                    <li><a href="{{ route('about') }}" class="hover:text-white transition">About Us</a></li>
                    <li><a href="{{ route('contact') }}" class="hover:text-white transition">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold text-lg mb-4">Resources</h4>
                <ul class="space-y-2 text-sm text-gray-400">
                    <li><a href="{{ route('articles.index') }}" class="hover:text-white transition">Articles</a></li>
                    <li><a href="{{ route('gallery.index') }}" class="hover:text-white transition">Gallery</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold text-lg mb-4">Contact</h4>
                <p class="text-gray-400 text-sm mb-2">123 Wisdom Street, Knowledge City</p>
                <p class="text-gray-400 text-sm">info@baitulhikmah.com</p>
            </div>
        </div>
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {{ date('Y') }} Baitulhikmah. All rights reserved.
        </div>
    </footer>
</body>

</html>