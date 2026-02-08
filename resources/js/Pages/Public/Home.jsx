import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';


export default function Home({ slides, vision, stats, programs, randomBooks, contacts }) {
    const [activeSlide, setActiveSlide] = useState(0);

    const nextSlide = () => {
        setActiveSlide(activeSlide === slides.length - 1 ? 0 : activeSlide + 1);
    };

    const prevSlide = () => {
        setActiveSlide(activeSlide === 0 ? slides.length - 1 : activeSlide - 1);
    };

    // Touch support for swipe
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
        setTouchEnd(null); // Reset touch end
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide(); // Swipe Left -> Show Next
        }
        if (isRightSwipe) {
            prevSlide(); // Swipe Right -> Show Prev
        }
    };

    return (
        <PublicLayout>
            <Head title="Home" />

            {/* Hero Section */}
            <div
                className="relative bg-neutral-bg h-[600px] overflow-hidden group"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSlide === index ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {slide.image ? (
                            <div className="absolute inset-0">
                                <img src={slide.image} alt="Baitulhikmah" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60"></div>
                            </div>
                        ) : (
                            <div className={`absolute inset-0 bg-primary-900`}>
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                        )}

                        <div className={`absolute inset-0 flex items-center justify-center text-center`}>
                            <div className="z-10 px-4 max-w-4xl mx-auto">
                                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-md tracking-tight">
                                    {slide.title}
                                </h1>
                                <p className="text-md sm:text-xl md:text-2xl px-4 sm:px-6 md:px-10 text-gray-200 mb-12 font-light drop-shadow-sm leading-relaxed">
                                    {slide.subtitle}
                                </p>

                                <div>
                                    <Link
                                        href={slide.button.url}
                                        className={`inline-flex items-center px-8 py-3 font-medium rounded-full transition transform hover:scale-105 shadow-lg ${index === 1
                                            ? 'bg-white text-primary-900 hover:bg-gray-100'
                                            : index === 2
                                                ? 'border-2 border-white text-white hover:bg-white/10'
                                                : 'bg-secondary-600 text-white hover:bg-secondary-700'
                                            }`}
                                    >
                                        {/* Icon based on button type */}
                                        {index === 0 && <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>}
                                        {index === 1 && <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>}
                                        {index === 2 && <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}

                                        {slide.button.text}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Controls */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${activeSlide === index ? 'bg-white' : 'bg-white/40'}`}
                        />
                    ))}
                </div>

                {/* Arrows */}
                {/* Arrows */}
                <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white z-30 transition-all shadow-lg hover:scale-100 hidden md:block">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white z-30 transition-all shadow-lg hover:scale-100 hidden md:block">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>

            {/* About Section */}
            <div className="py-20 bg-neutral-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary-100 rounded-tl-3xl z-0"></div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-100 rounded-br-3xl z-0"></div>
                            <div className="relative z-10 bg-gray-200 rounded-2xl h-[400px] overflow-hidden shadow-xl flex items-center justify-center text-gray-400">
                                {/* Ideally fetch another gallery image or static placeholder */}
                                <img src="/storage/gallery/about1.jpg" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }} className="w-full h-full object-cover" alt="About" />
                                <div className="hidden text-lg">Baitulhikmah</div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-primary-600 font-bold uppercase tracking-wide text-sm mb-2">Apa yang kami cari?</h2>
                            <h3 className="text-4xl font-serif font-bold text-gray-900 mb-6">Sebuah Harapan</h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Baitulhikmah lebih dari sekadar perpustakaan, ia adalah pusat pertumbuhan intelektual. Kami berupaya menciptakan lingkungan yang mendukung perkembangan ilmu.
                            </p>
                            <Link href="/about" className="text-secondary-600 font-semibold hover:text-secondary-700 flex items-center group">
                                Learn more about us
                                <svg className="w-5 h-5 ml-2 mt-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vision Section */}
            {vision && (
                <div className="py-20 bg-primary-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <div className="inline-block p-4 rounded-full bg-white/10 mb-8 backdrop-blur">
                            <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-serif font-bold mb-8 leading-tight">"{vision.vision_point}"</h2>
                        <p className="text-primary-200 text-xl font-light">
                            Our Vision ({vision.year})
                        </p>
                    </div>
                </div>
            )}

            {/* Stats Section */}
            <div className="py-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-neutral-bg transition border border-gray-100">
                            <div className="text-4xl font-bold text-primary-600 font-serif mb-2">{stats.books}+</div>
                            <div className="text-gray-500 font-medium">Books Collection</div>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-neutral-bg transition border border-gray-100">
                            <div className="text-4xl font-bold text-secondary-600 font-serif mb-2">{stats.active_loans}</div>
                            <div className="text-gray-500 font-medium">Active Loans</div>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-neutral-bg transition border border-gray-100">
                            <div className="text-4xl font-bold text-primary-600 font-serif mb-2">{stats.programs}</div>
                            <div className="text-gray-500 font-medium">Programs</div>
                        </div>
                        <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-neutral-bg transition border border-gray-100">
                            <div className="text-4xl font-bold text-secondary-600 font-serif mb-2">{stats.users}+</div>
                            <div className="text-gray-500 font-medium">Community Members</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Books Section (Horizontal Scroll) */}
            <div className="py-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* New Books Section - Horizontal Scroll */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-serif">New Arrivals</h2>
                            <Link href={route('public.books.index')} className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
                                View All Books
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>

                        <div className="flex overflow-x-auto gap-6 pb-6 custom-scrollbar snap-x snap-mandatory">
                            {randomBooks.map((book) => (
                                <Link key={book.id} href={`/books/${book.id}`} className="min-w-[160px] w-[160px] sm:min-w-[180px] sm:w-[180px] flex-shrink-0 group snap-start">
                                    <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition mb-3 relative">
                                        {book.img_url ? (
                                            <img src={book.img_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-gray-900 truncate group-hover:text-primary-600 transition">{book.title}</h4>
                                    <p className="text-sm text-gray-500 truncate">{book.author}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Program Section */}
            <div className="py-20 bg-neutral-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-2">Program Kami</h2>
                            <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Jelajahi Pengetahuan</h3>
                        </div>
                        <Link href="/about#programs" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
                            View All <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {programs.slice(0, 3).map((program) => (
                            <div key={program.id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                    {/* Placeholder icons based on ID or random loop */}
                                    {program.img_url ? (
                                        <img src={`/storage/${program.img_url}`} alt={program.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-primary-50 text-primary-200">
                                            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" /></svg>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h4 className="text-xl font-bold text-gray-900 mb-3 font-serif group-hover:text-primary-600 transition-colors">{program.name}</h4>
                                    <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
                                        {program.description}
                                    </p>
                                    {program.detail_url ? (
                                        <a href={program.detail_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary-600 uppercase tracking-wide border-b-2 border-transparent hover:border-primary-600 transition-colors block w-max">Details &rarr;</a>
                                    ) : (
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wide cursor-default">Coming Soon</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {programs.length === 0 && (
                            <div className="col-span-3 text-center text-gray-500 italic py-10">No programs currently available.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Contact Us Section */}
            <div className="bg-white py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">Have Questions?</h2>
                            <p className="text-gray-600 text-lg mb-8">
                                Connect with us to learn more about our library, membership, or how you can contribute to our community.
                            </p>

                            <div className="space-y-4 mb-8">
                                {contacts['email'] && (
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 mr-3 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        {contacts['email']}
                                    </div>
                                )}
                                {contacts['whatsapp'] && (
                                    <div className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                        {contacts['whatsapp']}
                                    </div>
                                )}
                            </div>

                            <Link href="/contact" className="btn-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 inline-flex items-center">
                                Contact Us
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </Link>
                        </div>
                        <div className="relative h-64 md:h-full min-h-[300px] bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.2426372481846!2d107.59218697509587!3d-6.861492993137021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6b943229b11%3A0x26664d25797f119!2sUniversitas%20Pendidikan%20Indonesia!5e0!3m2!1sen!2sid!4v1709440000000!5m2!1sen!2sid"
                                className="absolute inset-0 w-full h-full border-0"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>

        </PublicLayout >
    );
}
