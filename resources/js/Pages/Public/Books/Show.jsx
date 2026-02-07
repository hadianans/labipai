import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Swal from 'sweetalert2';

export default function BookShow({ book, reviews, auth }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Optimistic UI for Favorites
    const [isFavorited, setIsFavorited] = useState(book.is_favorited);

    // Check if user has already reviewed
    const myReview = auth.user ? reviews.find(r => r.user_id === auth.user.id) : null;
    const [isEditingReview, setIsEditingReview] = useState(false);

    // Review Form
    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        star: myReview ? myReview.star : 5,
        review: myReview ? myReview.review : '',
    });

    useEffect(() => {
        if (myReview) {
            setData({
                star: myReview.star,
                review: myReview.review
            });
        }
    }, [myReview]);

    const submitReview = (e) => {
        e.preventDefault();

        if (!data.review || data.review.trim() === '') {
            Swal.fire('Error', 'Review content cannot be empty.', 'error');
            return;
        }

        if (isEditingReview && myReview) {
            // Update (Controller uses updateOrCreate, so POST is fine)
            post(route('books.review', book.id), {
                onSuccess: () => {
                    setIsEditingReview(false);
                    Swal.fire('Success', 'Review updated successfully', 'success');
                },
            });
        } else {
            // Create
            post(route('books.review', book.id), {
                onSuccess: () => {
                    reset();
                    Swal.fire('Success', 'Review submitted successfully', 'success');
                },
            });
        }
    };

    const handleDeleteReview = () => {
        Swal.fire({
            title: 'Delete Review?',
            text: "Are you sure?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('reviews.destroy', myReview.id), {
                    onSuccess: () => {
                        reset();
                        Swal.fire('Deleted!', 'Your review has been deleted.', 'success');
                    }
                });
            }
        });
    };

    // Borrow Action
    const handleBorrow = () => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }

        Swal.fire({
            title: 'Borrow this book?',
            text: "Request to borrow this book. Must be picked up within 1 hour of approval.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, borrow it!'
        }).then((result) => {
            if (result.isConfirmed) {
                import('@inertiajs/react').then(({ router }) => {
                    router.post(route('books.borrow', selectedCopyId), {}, {
                        onSuccess: () => Swal.fire('Success', 'Borrow request submitted!', 'success'),
                        onError: (err) => Swal.fire('Error', 'Failed to submit request.', 'error'),
                    });
                });
            }
        });
    };

    const handleCancelRequest = (requestId) => {
        Swal.fire({
            title: 'Cancel Request?',
            text: "Do you want to cancel your borrow request?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                import('@inertiajs/react').then(({ router }) => {
                    router.post(route('borrow-requests.cancel', requestId), {}, {
                        onSuccess: () => Swal.fire('Cancelled', 'Request cancelled.', 'success')
                    });
                });
            }
        });
    }

    // Favorite Action
    const handleFavorite = () => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }

        // Optimistic Update
        const previousState = isFavorited;
        setIsFavorited(!isFavorited);

        // Use Axios for seamless background request without Page Reload/Flash
        window.axios.post(route('books.favorite', book.id))
            .then(response => {
                // Success - State already updated.
                // Optionally log or handle response if needed
            })
            .catch(error => {
                // Revert on error
                console.error("Favorite failed", error);
                setIsFavorited(previousState);
                Swal.fire('Error', 'Failed to update favorite status.', 'error');
            });
    };

    // Copies
    const [copies, setCopies] = useState(book.copies || []);

    // Selection Logic
    const [selectedCopyId, setSelectedCopyId] = useState(null);

    useEffect(() => {
        if (copies.length > 0) {
            // Find first available copy
            const available = copies.find(c => c.status === '0');
            if (available) {
                setSelectedCopyId(available.id);
            } else {
                // If no available, select the first one (or keep null/logic to default to current page book if in list)
                // Default to the current book ID if it's in the list, otherwise first.
                const currentInList = copies.find(c => c.id == book.id);
                setSelectedCopyId(currentInList ? currentInList.id : copies[0].id);
            }
        }
    }, [copies, book.id]);

    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            return () => { document.body.style.overflow = 'unset'; };
        }
    }, [isDrawerOpen]);

    useEffect(() => {
        if (flash.success) {
            Swal.fire('Success', flash.success, 'success');
        }
        if (flash.error) {
            Swal.fire('Error', flash.error, 'error');
        }
    }, [flash]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Derived state for selected copy
    const selectedCopy = copies.find(c => c.id === selectedCopyId);

    return (
        <PublicLayout user={auth.user}>
            <Head title={`${book.title} - Baitulhikmah`} />

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary-600">Home</Link>
                        <svg className="h-5 w-5 mx-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <Link href="/books" className="hover:text-primary-600">Books</Link>
                        <svg className="h-5 w-5 mx-2 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-900 font-medium truncate max-w-xs">{book.title}</span>
                    </nav>
                </div>
            </div>

            <div className="bg-neutral-bg py-12 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Top Section: Info & Cover */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            {/* Cover Image */}
                            <div className="bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
                                <div className="w-full max-w-sm shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-500 relative">
                                    <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                                        {book.img_url ? (
                                            <img
                                                src={book.img_url}
                                                alt={book.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col">
                                                <div className="text-center p-4">
                                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                    <span className="text-sm font-semibold uppercase tracking-wider block">{book.title}{book.volume ? ` ${book.volume}` : ''}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded shadow-lg backdrop-blur-sm">
                                        ID: {selectedCopyId || book.id || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="col-span-2 p-8 md:p-12">
                                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">{book.title}{book.volume ? ` ${book.volume}` : ''}</h1>
                                        <p className="text-xl text-primary-600 font-medium">{book.author}</p>
                                    </div>
                                    <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100 shrink-0">
                                        <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="ml-2 font-bold text-gray-900 text-lg">{book.rating ? Number(book.rating).toFixed(1) : 'N/A'}</span>
                                        <span className="text-sm text-gray-500 ml-1">({reviews.length} reviews)</span>
                                    </div>
                                </div>

                                {/* ... (Metadata Grid - Keep same) ... */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 mb-8 text-sm">
                                    <div><span className="block text-gray-400 mb-1 uppercase text-xs tracking-wide">Publisher</span><span className="font-semibold text-gray-900">{book.publisher}</span></div>
                                    <div><span className="block text-gray-400 mb-1 uppercase text-xs tracking-wide">Year</span><span className="font-semibold text-gray-900">{book.year}</span></div>
                                    <div><span className="block text-gray-400 mb-1 uppercase text-xs tracking-wide">Pages</span><span className="font-semibold text-gray-900">{book.page}</span></div>
                                    <div><span className="block text-gray-400 mb-1 uppercase text-xs tracking-wide">Language</span><span className="font-semibold text-gray-900">{book.language}</span></div>
                                    <div><span className="block text-gray-400 mb-1 uppercase text-xs tracking-wide">ISBN</span><span className="font-semibold text-gray-900">{book.isbn}</span></div>
                                    <div><span className="block text-gray-400 mb-1 uppercase text-xs tracking-wide">Type</span><span className="font-semibold text-gray-900">{book.type === '1' ? 'Open Access' : 'Restricted'}</span></div>
                                </div>


                                <div className="prose max-w-none text-gray-600 mb-8 leading-relaxed">
                                    <h3 className="text-gray-900 font-serif font-bold text-lg mb-2">Synopsis</h3>
                                    {book.synopsis && book.synopsis.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>

                                {/* Available Copies Section */}
                                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                            Copies ({copies.length})
                                        </span>
                                        <span className={`text-xs font-normal px-2 py-0.5 rounded border ${copies.filter(c => c.status === '0').length > 0
                                            ? 'text-green-600 bg-green-50 border-green-200'
                                            : 'text-red-500 bg-red-50 border-red-200'
                                            }`}>
                                            {copies.filter(c => c.status === '0').length} Available
                                        </span>
                                    </h3>
                                    <div className="max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                            {copies.map((copy, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedCopyId(copy.id)}
                                                    className={`text-xs px-2 py-1.5 rounded border flex justify-between items-center w-full transition-all duration-200 ${selectedCopyId === copy.id
                                                        ? 'ring-2 ring-primary-500 ring-offset-1 z-10'
                                                        : ''
                                                        } ${copy.status === '0' ? 'bg-white border-green-200 hover:border-green-300 hover:bg-green-50' :
                                                            copy.status === '1' ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-70' :
                                                                'bg-red-50 border-red-100 text-red-400 opacity-70'
                                                        }`}>
                                                    <span className={`font-mono font-medium ${copy.status === '0' ? 'text-gray-700' : ''}`}>
                                                        {copy.id}
                                                    </span>
                                                    <div className={`w-2 h-2 rounded-full ${copy.status === '0' ? 'bg-green-500' :
                                                        copy.status === '1' ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`} title={copy.status_label}></div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-center text-gray-400 mt-2">Click on a copy ID to select it for borrowing.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">

                                    {/* BUTTON LOGIC - Uses selectedCopyId instead of book.id for Borrowing */}
                                    {book.my_request ? (
                                        // User has a pending/approved request (globally for this book/title? Or specific copy? Logic check needed)
                                        // Usually request is for a specific Book ID. 
                                        book.my_request.book_id === selectedCopyId ? (
                                            book.my_request.status === 'pending' ? (
                                                <button
                                                    onClick={() => handleCancelRequest(book.my_request.id)}
                                                    className="bg-yellow-100 text-yellow-700 px-8 py-3 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-yellow-200 transition"
                                                >
                                                    Cancel Request
                                                </button>
                                            ) : (
                                                <button disabled className="bg-green-100 text-green-700 px-8 py-3 rounded-xl font-bold text-lg flex items-center justify-center cursor-default">
                                                    Request Approved
                                                </button>
                                            )
                                        ) : book.my_request.status === 'pending' ? (
                                            <div className="flex flex-col items-center justify-center w-full sm:w-auto">
                                                <button disabled className="bg-gray-100 text-gray-400 px-8 py-3 rounded-xl font-bold text-lg flex items-center justify-center cursor-not-allowed w-full">
                                                    Pending (Other Copy)
                                                </button>
                                                <span className="text-xs text-gray-400 mt-1">You represent a request for #{book.my_request.book_id}</span>
                                            </div>
                                        ) : null
                                    ) : (
                                        // No personal request. Check status of selected copy.
                                        selectedCopy && selectedCopy.status === '0' ? (
                                            // Available
                                            <button onClick={handleBorrow} className="btn-primary px-8 py-3 rounded-xl shadow-lg shadow-primary-500/30 font-bold text-lg flex items-center justify-center transition hover:scale-105 active:scale-95">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                Borrow Request
                                            </button>
                                        ) : (
                                            // Unavailable (Borrowed/Lost or None Selected)
                                            <button disabled className="bg-gray-200 text-gray-500 px-8 py-3 rounded-xl font-bold text-lg flex items-center justify-center cursor-not-allowed">
                                                {selectedCopy ? (selectedCopy.status === '1' ? 'Currently Borrowed' : 'Lost / Archived') : 'Select a Copy'}
                                            </button>
                                        )
                                    )}

                                    {/* FAVORITE BUTTON */}
                                    <button
                                        onClick={handleFavorite}
                                        className={`px-8 py-3 rounded-xl shadow-lg font-bold text-lg flex items-center justify-center transition hover:scale-105 active:scale-95
                                            ${isFavorited
                                                ? 'bg-red-50 text-red-500 shadow-red-500/10 border border-red-100'
                                                : 'btn-secondary shadow-secondary-500/30'
                                            }`}
                                    >
                                        <svg className={`w-5 h-5 mr-2 ${isFavorited ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                        </svg>
                                        {isFavorited ? 'Favorited' : 'Favorite'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Reviews List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
                                <div className="space-y-8">
                                    {reviews.slice(0, 3).map((review, index) => (
                                        <div key={index} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                            <div className="flex-shrink-0">
                                                {review.user_avatar ? (
                                                    <img src={review.user_avatar} alt={review.user} className="w-12 h-12 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-lg">
                                                        {review.user ? review.user.charAt(0) : '?'}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-bold text-gray-900">{review.user || 'Anonymous'}</h4>
                                                    <span className="text-sm text-gray-400">{formatDate(review.created_at || review.date)}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className={`w-4 h-4 ${i < review.star ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <p className="text-gray-600">{review.review || review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
                                </div>
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => setIsDrawerOpen(true)}
                                        className="text-primary-600 font-medium hover:text-primary-700 cursor-pointer"
                                    >
                                        View all reviews
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Write Review */}
                        <div>
                            <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
                                <h3 className="text-xl font-serif font-bold text-primary-900 mb-4">Rate this book</h3>

                                {auth.user ? (
                                    myReview && !isEditingReview ? (
                                        // User ALREADY reviewed - Show their review
                                        <div>
                                            <p className="text-gray-600 mb-4">You have already reviewed this book.</p>
                                            <div className="bg-white p-4 rounded-lg mb-4">
                                                <div className="flex text-yellow-400 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={i < myReview.star ? "text-yellow-400" : "text-gray-300"}>★</span>
                                                    ))}
                                                </div>
                                                <p className="text-gray-700 italic">"{myReview.review}"</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setIsEditingReview(true)}
                                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm"
                                                >
                                                    Edit Review
                                                </button>
                                                <button
                                                    onClick={handleDeleteReview}
                                                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 font-medium text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // User HAS NOT reviewed OR is editing
                                        <form onSubmit={submitReview}>
                                            <p className="text-gray-600 mb-6">{isEditingReview ? 'Update your review.' : 'Share your thoughts with other readers. Write a review and tell us what you think.'}</p>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Rating</label>
                                                <div className="flex space-x-2 mt-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <button
                                                            type="button"
                                                            key={s}
                                                            onClick={() => setData('star', s)}
                                                            className={`text-2xl ${s <= data.star ? 'text-yellow-500' : 'text-gray-300'}`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Review</label>
                                                <textarea
                                                    className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                    rows="3"
                                                    value={data.review}
                                                    onChange={(e) => setData('review', e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="submit" disabled={processing} className="flex-1 btn-primary py-3 rounded-lg shadow-sm font-bold">
                                                    {processing ? 'Submitting...' : (isEditingReview ? 'Update Review' : 'Submit Review')}
                                                </button>
                                                {isEditingReview && (
                                                    <button type="button" onClick={() => setIsEditingReview(false)} className="px-4 py-3 bg-gray-200 rounded-lg text-gray-700 font-bold">
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    )
                                ) : (
                                    <div>
                                        <p className="text-gray-600 mb-6">Share your thoughts with other readers. Write a review and tell us what you think.</p>
                                        <Link href={route('login')} className="w-full btn-primary py-3 rounded-lg shadow-sm block text-center font-bold">Login to Review</Link>
                                        <p className="text-xs text-center text-gray-400 mt-4">You must be logged in to review.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Drawer (Offcanvas) */}
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsDrawerOpen(false)}
            ></div>

            <div
                className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] transition-transform duration-300 transform ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ maxHeight: '90vh', height: '80vh' }}
            >
                <div className="flex flex-col h-full">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                        <h2 className="text-xl font-bold font-serif text-gray-900">All Reviews ({reviews.length})</h2>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-8 max-w-3xl mx-auto">
                            {reviews.map((review, index) => (
                                <div key={index} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-lg">
                                            {review.user ? review.user.charAt(0) : '?'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-gray-900">{review.user || 'Anonymous'}</h4>
                                            <span className="text-sm text-gray-400">{formatDate(review.created_at || review.date)}</span>
                                        </div>
                                        <div className="flex items-center mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < review.star ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-gray-600">{review.review || review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
