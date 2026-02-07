@extends('layouts.public')

@section('title', 'Home - Baitulhikmah')

@section('content')
<!-- Hero Section (Carousel) -->
<div class="relative bg-neutral-bg h-[600px] overflow-hidden" x-data="{ activeSlide: 0, slides: [
    { title: 'Empowering Knowledge', subtitle: 'Join our comprehensive programs designed to nurture wisdom and intellect.', cta: 'Explore Programs', link: '{{ route('courses.index') }}', image: 'bg-primary-900' },
    { title: 'A World of Books', subtitle: 'Dive into our extensive collection of classic and modern literature.', cta: 'Browse Catalog', link: '{{ route('books.index') }}', image: 'bg-primary-800' },
     { title: 'Get in Touch', subtitle: 'We are here to answer your questions and guide you on your journey.', cta: 'Contact Us', link: '{{ route('contact') }}', image: 'bg-secondary-800' }
] }">
    <!-- Slides -->
    <template x-for="(slide, index) in slides" :key="index">
        <div class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
             :class="{ 'opacity-100': activeSlide === index, 'opacity-0': activeSlide !== index }">
            <div class="absolute inset-0 flex items-center justify-center text-center" :class="slide.image">
                <div class="absolute inset-0 bg-black/40"></div> <!-- Overlay -->
                <!-- Content -->
                <div class="z-10 px-4 max-w-4xl mx-auto">
                    <h1 class="text-4xl md:text-6xl font-serif font-bold text-white mb-6" x-text="slide.title"></h1>
                    <p class="text-xl text-gray-200 mb-10 font-light" x-text="slide.subtitle"></p>
                    <a :href="slide.link" class="inline-block px-8 py-3 bg-secondary-600 text-white font-medium rounded-full hover:bg-secondary-700 transition transform hover:scale-105 shadow-lg" x-text="slide.cta"></a>
                </div>
            </div>
        </div>
    </template>

    <!-- Controls -->
    <div class="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 z-20">
        <template x-for="(slide, index) in slides" :key="index">
            <button @click="activeSlide = index" 
                    class="w-3 h-3 rounded-full transition-colors duration-300"
                    :class="{ 'bg-white': activeSlide === index, 'bg-white/40': activeSlide !== index }"></button>
        </template>
    </div>

    <!-- Arrows -->
    <button @click="activeSlide = activeSlide === 0 ? slides.length - 1 : activeSlide - 1" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-20 backdrop-blur-sm">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
    </button>
    <button @click="activeSlide = activeSlide === slides.length - 1 ? 0 : activeSlide + 1" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-20 backdrop-blur-sm">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
    </button>
</div>

<!-- About Section -->
<div class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div class="relative">
                <div class="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-tl-3xl z-0"></div>
                <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-100 rounded-br-3xl z-0"></div>
                <div class="relative z-10 bg-gray-200 rounded-2xl h-[400px] overflow-hidden shadow-xl flex items-center justify-center text-gray-400">
                    <span class="text-lg">Image: Lab Atmosphere</span>
                </div>
            </div>
            <div>
                <h2 class="text-primary-600 font-bold uppercase tracking-wide text-sm mb-2">Who We Are</h2>
                <h3 class="text-4xl font-serif font-bold text-gray-900 mb-6">A Beacon of Wisdom in the Modern Age</h3>
                <p class="text-gray-600 text-lg leading-relaxed mb-6">
                    Baitulhikmah is more than just a library; it is a center for intellectual growth and community building. Integrating classic values with modern methodologies, we strive to create an environment where knowledge flourishes.
                </p>
                <a href="{{ route('about') }}" class="text-secondary-600 font-semibold hover:text-secondary-700 flex items-center group">
                    Learn more about us 
                    <svg class="w-5 h-5 ml-2 mt-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Vision Section -->
<div class="py-20 bg-primary-900 text-white relative overflow-hidden">
    <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div> <!-- Subtle texture -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div class="inline-block p-4 rounded-full bg-white/10 mb-8 backdrop-blur">
            <svg class="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h2 class="text-4xl md:text-5xl font-serif font-bold mb-8">"Cultivating minds, enriching souls, and building a civilization of knowledge."</h2>
        <p class="text-primary-200 text-xl font-light">
            Our vision is to be the premier cornerstone for educational advancement and moral integrity.
        </p>
    </div>
</div>

<!-- Recap/Stats Section -->
<div class="py-16 bg-neutral-bg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <div class="text-4xl font-bold text-primary-600 font-serif mb-2">1,200+</div>
                <div class="text-gray-500 font-medium">Books Available</div>
            </div>
            <div class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <div class="text-4xl font-bold text-secondary-600 font-serif mb-2">350+</div>
                <div class="text-gray-500 font-medium">Active Loans</div>
            </div>
            <div class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <div class="text-4xl font-bold text-primary-600 font-serif mb-2">15</div>
                <div class="text-gray-500 font-medium">Active Courses</div>
            </div>
            <div class="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <div class="text-4xl font-bold text-secondary-600 font-serif mb-2">500+</div>
                <div class="text-gray-500 font-medium">Community Members</div>
            </div>
        </div>
    </div>
</div>

<!-- Program Section -->
<div class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-sm font-bold text-primary-600 uppercase tracking-widest mb-2">Our Programs</h2>
            <h3 class="text-3xl md:text-4xl font-serif font-bold text-gray-900">Pathways to Knowledge</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Program 1 -->
            <div class="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div class="h-48 bg-primary-100 relative overflow-hidden">
                    <div class="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <svg class="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                </div>
                <div class="p-8">
                    <h4 class="text-xl font-bold text-gray-900 mb-3 font-serif group-hover:text-primary-600 transition-colors">Literacy & Reading</h4>
                    <p class="text-gray-600 mb-6 line-clamp-3">
                        Promoting the habit of reading through book clubs, reading challenges, and access to a diverse library.
                    </p>
                    <a href="#" class="text-sm font-bold text-primary-600 uppercase tracking-wide border-b-2 border-transparent hover:border-primary-600 transition-colors">Details &rarr;</a>
                </div>
            </div>

            <!-- Program 2 -->
            <div class="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div class="h-48 bg-secondary-100 relative overflow-hidden">
                     <div class="absolute inset-0 bg-secondary-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <svg class="w-16 h-16 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                </div>
                <div class="p-8">
                    <h4 class="text-xl font-bold text-gray-900 mb-3 font-serif group-hover:text-secondary-600 transition-colors">Skill Workshops</h4>
                    <p class="text-gray-600 mb-6 line-clamp-3">
                        Hands-on sessions covering technology, arts, writing, and leadership to equip you with practical skills.
                    </p>
                    <a href="#" class="text-sm font-bold text-secondary-600 uppercase tracking-wide border-b-2 border-transparent hover:border-secondary-600 transition-colors">Details &rarr;</a>
                </div>
            </div>

            <!-- Program 3 -->
            <div class="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div class="h-48 bg-gray-100 relative overflow-hidden">
                     <div class="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                </div>
                <div class="p-8">
                    <h4 class="text-xl font-bold text-gray-900 mb-3 font-serif group-hover:text-primary-600 transition-colors">Community Engagement</h4>
                    <p class="text-gray-600 mb-6 line-clamp-3">
                        Initiatives that foster social responsibility, volunteerism, and collaborative projects for local impact.
                    </p>
                    <a href="#" class="text-sm font-bold text-gray-600 uppercase tracking-wide border-b-2 border-transparent hover:border-gray-600 transition-colors">Details &rarr;</a>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Service Section -->
<div class="py-20 bg-neutral-bg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-sm font-bold text-secondary-600 uppercase tracking-widest mb-2">Our Services</h2>
            <h3 class="text-3xl md:text-4xl font-serif font-bold text-gray-900">What We Offer</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform duration-300">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-2">Book Lending</h4>
                <p class="text-sm text-gray-600">Borrow from our vast collection of physical and digital books.</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform duration-300">
                 <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center text-secondary-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-2">Study Space</h4>
                <p class="text-sm text-gray-600">Quiet and comfortable areas dedicated for focused study and research.</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform duration-300">
                 <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-2">Digital Access</h4>
                <p class="text-sm text-gray-600">Free Wi-Fi and computer terminals for digital literacy and research.</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-1 transition-transform duration-300">
                 <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h4 class="font-bold text-gray-900 mb-2">Event Hosting</h4>
                <p class="text-sm text-gray-600">Facilities for hosting educational seminars, talks, and community meetings.</p>
            </div>
        </div>
    </div>
</div>

<!-- Article Section (Horizontal Scroll) -->
<div class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
            <div>
                 <h2 class="text-sm font-bold text-primary-600 uppercase tracking-widest mb-2">Insights</h2>
                 <h3 class="text-3xl font-serif font-bold text-gray-900">Latest Articles</h3>
            </div>
            <a href="{{ route('articles.index') }}" class="hidden md:inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary-600 transition">
                View All Articles
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </a>
        </div>

        <div class="flex overflow-x-auto pb-8 -mx-4 px-4 space-x-6 scrollbar-hide">
            <!-- Article 1 -->
            <div class="min-w-[300px] md:min-w-[350px] bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition">
                 <div class="h-48 bg-gray-200">
                     <div class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">Image</div>
                 </div>
                 <div class="p-6">
                     <span class="text-xs font-bold text-primary-600 uppercase mb-2 block">Education</span>
                     <h4 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition">The Future of Digital Learning in Traditional Settings</h4>
                     <p class="text-sm text-gray-500 mb-4">Jan 12, 2026</p>
                 </div>
            </div>
            
             <!-- Article 2 -->
             <div class="min-w-[300px] md:min-w-[350px] bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition">
                 <div class="h-48 bg-gray-200">
                      <div class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">Image</div>
                 </div>
                 <div class="p-6">
                     <span class="text-xs font-bold text-secondary-600 uppercase mb-2 block">Community</span>
                     <h4 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-secondary-600 transition">Revitalizing Local Libraries</h4>
                     <p class="text-sm text-gray-500 mb-4">Jan 08, 2026</p>
                 </div>
            </div>

            <!-- Article 3 -->
             <div class="min-w-[300px] md:min-w-[350px] bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition">
                 <div class="h-48 bg-gray-200">
                      <div class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">Image</div>
                 </div>
                 <div class="p-6">
                     <span class="text-xs font-bold text-gray-600 uppercase mb-2 block">Philosophy</span>
                     <h4 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-gray-900 transition">Understanding Classical Wisdom</h4>
                     <p class="text-sm text-gray-500 mb-4">Jan 05, 2026</p>
                 </div>
            </div>
             
              <!-- Article 4 -->
              <div class="min-w-[300px] md:min-w-[350px] bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition">
                 <div class="h-48 bg-gray-200">
                      <div class="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">Image</div>
                 </div>
                 <div class="p-6">
                     <span class="text-xs font-bold text-primary-600 uppercase mb-2 block">Events</span>
                     <h4 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition">Upcoming Annual Symposium</h4>
                     <p class="text-sm text-gray-500 mb-4">Dec 28, 2025</p>
                 </div>
            </div>
        </div>
        
         <div class="mt-4 text-center md:hidden">
            <a href="{{ route('articles.index') }}" class="text-sm font-bold text-primary-600 hover:text-primary-700">View All Articles &rarr;</a>
        </div>
    </div>
</div>

<!-- Contact Section -->
<div class="bg-primary-900 text-white py-20 relative overflow-hidden">
    <!-- Decor -->
    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-secondary-500/10 blur-3xl"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 class="text-sm font-bold text-secondary-400 uppercase tracking-widest mb-2">Contact Us</h2>
                <h3 class="text-4xl font-serif font-bold mb-6">Let's Start a Conversation</h3>
                <p class="text-primary-200 text-lg mb-8 max-w-lg">
                    Have questions about our programs or library? We are ready to help you.
                </p>
                
                <div class="space-y-4">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <span>info@baitulhikmah.com</span>
                    </div>
                     <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <span>+1 (555) 123-4567</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-2xl p-8 shadow-2xl text-gray-900">
                <h4 class="text-xl font-bold mb-6 font-serif">Send Message</h4>
                <form action="#" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="First Name" class="input-field bg-gray-50 border-gray-200">
                         <input type="text" placeholder="Last Name" class="input-field bg-gray-50 border-gray-200">
                    </div>
                    <input type="email" placeholder="Email Address" class="input-field bg-gray-50 border-gray-200">
                    <textarea rows="4" placeholder="Your Message" class="input-field bg-gray-50 border-gray-200"></textarea>
                    <button type="button" class="w-full btn-primary py-3 shadow-lg shadow-primary-500/30">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection