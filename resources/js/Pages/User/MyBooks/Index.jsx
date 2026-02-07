import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import TextInput from '@/Components/TextInput';

export default function Index({ auth, borrowed, favorites, reviews, filters = {} }) {
    const [activeTab, setActiveTab] = useState('borrowed');
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = debounce((query) => {
        router.get(
            route('my-books.index'),
            { search: query },
            { preserveState: true, replace: true, only: ['borrowed'] }
        );
    }, 300);

    const handleCancelRequest = (id) => {
        Swal.fire({
            title: 'Cancel Request?',
            text: "Are you sure you want to cancel this borrow request?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('borrow-requests.cancel', id), {}, {
                    onSuccess: () => Swal.fire('Cancelled!', 'Request has been cancelled.', 'success')
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Books</h2>}
        >
            <Head title="My Books" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex">
                                <button
                                    onClick={() => setActiveTab('borrowed')}
                                    className={`${activeTab === 'borrowed'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                                >
                                    Borrowed / Requests
                                </button>
                                <button
                                    onClick={() => setActiveTab('favorites')}
                                    className={`${activeTab === 'favorites'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                                >
                                    Favorites
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`${activeTab === 'reviews'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                                >
                                    My Reviews
                                </button>
                            </nav>
                        </div>

                        <div className="p-6 text-gray-900">
                            {activeTab === 'borrowed' && (
                                <div>
                                    <div className="mb-4">
                                        <TextInput
                                            type="text"
                                            placeholder="Search borrowed books..."
                                            defaultValue={search}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-full md:w-1/3 p-2 border rounded"
                                        />
                                    </div>
                                    {borrowed.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {borrowed.map((item) => (
                                                <div key={item.id} className="border rounded-lg p-4 flex gap-4">
                                                    <img src={item.book.img_url || 'https://placehold.co/100x150'} alt={item.book.title} className="w-20 h-28 object-cover rounded" />
                                                    <div>
                                                        <Link href={route('public.books.show', item.book.id)} className="font-bold text-lg hover:text-indigo-600 hover:underline">
                                                            {item.book.title}
                                                        </Link>

                                                        {/* Check if it's a Lend or Request */}
                                                        {item.due_date ? (
                                                            // BookLend
                                                            <>
                                                                <p className="text-sm text-gray-600">Due: {new Date(item.due_date).toLocaleDateString('id-ID', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}</p>
                                                                <p className={`text-sm font-medium ${item.returned_at ? 'text-green-600' : 'text-blue-600'}`}>
                                                                    {item.returned_at ? 'Returned' : 'Active Loan'}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            // BorrowRequest
                                                            <>
                                                                <p className="text-sm text-gray-600">Requested: {new Date(item.created_at).toLocaleDateString()}</p>
                                                                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                        item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                                                                    }`}>
                                                                    {item.status.toUpperCase()}
                                                                </span>
                                                                {item.status === 'pending' && (
                                                                    <button
                                                                        onClick={() => handleCancelRequest(item.id)}
                                                                        className="block mt-2 text-xs text-red-600 hover:underline"
                                                                    >
                                                                        Cancel Request
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No borrowed books or active requests found.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'favorites' && (
                                <div>
                                    {favorites.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {favorites.map((fav) => (
                                                fav.book && (
                                                    <div key={fav.id} className="border rounded-lg p-4 flex gap-4 relative">
                                                        <img src={fav.book.img_url || 'https://placehold.co/100x150'} alt={fav.book.title} className="w-20 h-28 object-cover rounded" />
                                                        <div>
                                                            <h4 className="font-bold text-lg">{fav.book.title}</h4>
                                                            <Link href={route('public.books.show', fav.book.id)} className="text-indigo-600 hover:text-indigo-900 text-sm mt-2 inline-block">View Details</Link>
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No favorite books yet.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div>
                                    {reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="border rounded-lg p-4">
                                                    <Link href={route('public.books.show', review.book.id)} className="font-bold text-lg hover:text-indigo-600 hover:underline">
                                                        {review.book.title}
                                                    </Link>
                                                    <div className="flex text-yellow-400 my-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={i < review.star ? "text-yellow-400" : "text-gray-300"}>★</span>
                                                        ))}
                                                    </div>
                                                    <p className="text-gray-700">{review.review}</p>
                                                    <Link href={route('public.books.show', review.book.id)} className="text-indigo-600 hover:text-indigo-900 text-sm mt-2 inline-block">View Details</Link>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">You haven't written any reviews yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
