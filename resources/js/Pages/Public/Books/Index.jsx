import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import axios from 'axios';

export default function BookIndex({ books, genres, seed }) {
    const { version } = usePage();
    const [currentSeed, setCurrentSeed] = useState(seed);
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedBook, setSelectedBook] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Infinite scroll state
    const [allBooks, setAllBooks] = useState(books.data || []);
    const [currentPage, setCurrentPage] = useState(books.current_page || 1);
    const [hasMore, setHasMore] = useState(books.next_page_url !== null);
    const [loading, setLoading] = useState(false);
    const [seenIds, setSeenIds] = useState(new Set((books.data || []).map(b => b.id)));

    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    // Reset when search or genre changes
    useEffect(() => {
        // Build URL with query params
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedGenre !== 'All') params.set('genre', selectedGenre);

        // Debounce the search
        const timer = setTimeout(() => {
            router.get('/books', Object.fromEntries(params), {
                preserveState: true,
                preserveScroll: true,
                only: ['books'],
                onSuccess: (page) => {
                    const newBooks = page.props.books.data || [];
                    setAllBooks(newBooks);
                    setCurrentPage(page.props.books.current_page || 1);
                    setHasMore(page.props.books.next_page_url !== null);
                    setSeenIds(new Set(newBooks.map(b => b.id)));
                    setCurrentSeed(page.props.seed);
                }
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [search, selectedGenre]);

    // Load more books function
    const loadMoreBooks = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = currentPage + 1;

        const params = new URLSearchParams();
        params.set('page', nextPage.toString());
        if (search) params.set('search', search);
        if (selectedGenre !== 'All') params.set('genre', selectedGenre);
        if (currentSeed) params.set('seed', currentSeed);

        axios.get(`/books?${params.toString()}`, {
            headers: {
                'X-Inertia': 'true',
                'X-Inertia-Partial-Data': 'books',
                'X-Inertia-Partial-Component': 'Public/Books/Index',
                'X-Inertia-Version': version,
                'Accept': 'application/json',
            }
        })
            .then(response => {
                const data = response.data;
                const newBooks = data.props.books.data || [];

                // Filter out duplicates
                const uniqueNewBooks = newBooks.filter(book => !seenIds.has(book.id));

                if (uniqueNewBooks.length > 0) {
                    setAllBooks(prev => [...prev, ...uniqueNewBooks]);
                    setSeenIds(prev => {
                        const newSet = new Set(prev);
                        uniqueNewBooks.forEach(b => newSet.add(b.id));
                        return newSet;
                    });
                }

                setCurrentPage(data.props.books.current_page);
                setHasMore(data.props.books.next_page_url !== null);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading more books:', err);
                setLoading(false);
            });
    }, [loading, hasMore, currentPage, search, selectedGenre, seenIds, version, currentSeed]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMoreBooks();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [hasMore, loading, loadMoreBooks]);

    const openModal = (book) => {
        setSelectedBook(book);
        setModalOpen(true);
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
        setModalOpen(false);
        setTimeout(() => setSelectedBook(null), 300);
        document.body.classList.remove('overflow-hidden');
    };

    return (
        <PublicLayout>
            <Head title="Book Catalog" />

            <div className="bg-neutral-bg py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-extrabold text-gray-900 font-serif sm:text-4xl">
                            Library Collection
                        </h1>
                        <p className="mt-4 text-lg text-gray-500">
                            Explore our extensive collection of books across various genres.
                        </p>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-10">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by title or author..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                />
                            </div>

                            {/* Genre Dropdown */}
                            <div className="w-full md:w-64">
                                <div className="relative">
                                    <select
                                        value={selectedGenre}
                                        onChange={(e) => setSelectedGenre(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg appearance-none bg-white focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                    >
                                        <option value="All">All Genres</option>
                                        {genres.map((genre) => (
                                            <option key={genre} value={genre}>{genre}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Book Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {allBooks.map((book) => (
                            <div key={book.id} onClick={() => openModal(book)} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col h-full">
                                {/* Image Container */}
                                <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden">
                                    {book.img_url ? (
                                        <img
                                            src={book.img_url}
                                            alt={book.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col">
                                            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                            <span className="text-xs uppercase tracking-wider font-semibold">Cover</span>
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide shadow-sm ${book.status === '0' || book.status === 0 ? 'bg-green-100 text-green-800' :
                                            book.status === '1' || book.status === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {book.status_label}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="mb-1">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{book.publisher}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">{book.title}{book.volume ? ` ${book.volume}` : ''}</h3>
                                    <p className="text-sm text-gray-600 mb-3">{book.author}</p>

                                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                                        <div className="flex items-center text-yellow-500 text-sm">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            <span className="ml-1 font-medium text-gray-700">{book.rating}</span>
                                            <span className="ml-1 text-gray-400 text-xs">({book.reviews_count})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Loading Indicator & Infinite Scroll Trigger */}
                    <div ref={loadMoreRef} className="flex justify-center py-8">
                        {loading ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Loading more books...</span>
                            </div>
                        ) : hasMore ? (
                            <span className="text-gray-400 text-sm">Scroll for more</span>
                        ) : allBooks.length > 0 ? (
                            <span className="text-gray-400 text-sm">No more books to load</span>
                        ) : null}
                    </div>

                    {/* Empty State */}
                    {allBooks.length === 0 && !loading && (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <h3 className="text-lg font-medium text-gray-900">No books found</h3>
                            <p className="text-gray-500">Try adjusting your search query.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick View Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Panel */}
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                                <button type="button" onClick={closeModal} className="bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none hover:bg-gray-100 transition-colors">
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {selectedBook && (
                                    <div className="sm:flex sm:items-start gap-8">
                                        {/* Left: Image */}
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full sm:w-1/3 flex-shrink-0">
                                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 shadow-md flex items-center justify-center text-gray-400 flex-col">
                                                {selectedBook.img_url ? (
                                                    <img src={selectedBook.img_url} alt={selectedBook.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                        <span className="text-sm font-semibold uppercase tracking-wider">Book Preview</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Content */}
                                        <div className="mt-4 sm:mt-0 w-full text-left">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-3xl leading-tight font-serif font-bold text-gray-900 mb-1">{selectedBook.title}{selectedBook.volume ? ` ${selectedBook.volume}` : ''}</h3>
                                                    <p className="text-xl text-primary-600 mb-4">{selectedBook.author}</p>
                                                </div>
                                            </div>

                                            {/* Meta */}
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-4">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                                    <span>{selectedBook.publisher}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    <span>{selectedBook.year}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                    <span>{selectedBook.page} Pages</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                                                    <span>ID: {selectedBook.id}</span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 leading-relaxed mb-6">{selectedBook.synopsis}</p>

                                            {/* Available Copies Section */}
                                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                                        Available Copies
                                                    </span>
                                                    <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                                                        {selectedBook.copies ? selectedBook.copies.filter(c => c.status === '0' || c.status === 0).length : 0} Available
                                                    </span>
                                                </h3>
                                                <div className="max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                        {selectedBook.copies ? selectedBook.copies.map((copy, idx) => (
                                                            <div key={idx} className={`text-xs px-2 py-1.5 rounded border flex justify-between items-center ${copy.status === '0' || copy.status === 0 ? 'bg-white border-green-200 hover:border-green-300' :
                                                                copy.status === '1' || copy.status === 1 ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-red-50 border-red-100 text-red-400'
                                                                }`}>
                                                                <span className={`font-mono font-medium ${copy.status === '0' || copy.status === 0 ? 'text-gray-700' : ''}`}>{copy.id.split('-')[1] || copy.id}</span>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${copy.status === '0' || copy.status === 0 ? 'bg-green-500' :
                                                                    copy.status === '1' || copy.status === 1 ? 'bg-yellow-500' : 'bg-red-500'
                                                                    }`}></div>
                                                            </div>
                                                        )) : null}
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex justify-between text-[10px] text-gray-400 px-1">
                                                    <div className="flex gap-3">
                                                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Avail</span>
                                                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Borrowed</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Link href={`/books/${selectedBook.id}`} className="btn-primary px-6 py-3 rounded-lg shadow-lg shadow-primary-500/30 flex items-center justify-center w-full sm:w-auto hover:bg-primary-700 transition">
                                                    View Full Details & Reviews
                                                </Link>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                                                    <span className="text-sm font-semibold text-gray-500">Status:</span>
                                                    <span className={`font-bold uppercase text-sm ${selectedBook.status === '0' || selectedBook.status === 0 ? 'text-green-600' :
                                                        selectedBook.status === '1' || selectedBook.status === 1 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                        }`}>
                                                        {selectedBook.status_label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
