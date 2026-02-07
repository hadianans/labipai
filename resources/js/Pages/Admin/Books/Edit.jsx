import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Dialog } from '@headlessui/react';

export default function Edit({ auth, book, genres, relatedBooks = [] }) {
    const { data, setData, patch, post, processing, errors } = useForm({
        _method: 'PATCH',
        title: book.title || '',
        author: book.author || '',
        editor: book.editor || '',
        translator: book.translator || '',
        duplicate_book_ids: relatedBooks.map(b => b.id),
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        year: book.year || '',
        language: book.language || '',
        page: book.page || '',
        volume: book.volume || '',
        synopsis: book.synopsis || '',
        type: book.type || '1',
        status: book.status || '0',
        genres: book.genres ? book.genres.map(g => g.id) : [],
        img_url: null,
    });

    const [previewUrl, setPreviewUrl] = useState(book.img_url || null);
    const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
    const [isManageGenresMode, setIsManageGenresMode] = useState(false);

    // Local state for newly linked books to show their titles and error handling
    const [extraBooks, setExtraBooks] = useState([]);
    const [duplicateError, setDuplicateError] = useState('');

    // Genre Modal State
    const [genreMode, setGenreMode] = useState('create');
    const [editingGenre, setEditingGenre] = useState(null);
    const [genreName, setGenreName] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('img_url', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const toggleGenre = (id) => {
        if (isManageGenresMode) return;

        if (data.genres.includes(id)) {
            setData('genres', data.genres.filter(gId => gId !== id));
        } else {
            if (data.genres.length >= 3) {
                alert('Maximum 3 genres allowed.');
                return;
            }
            setData('genres', [...data.genres, id]);
        }
    };

    // Genre Management Functions
    const openCreateGenre = () => {
        setGenreMode('create');
        setGenreName('');
        setEditingGenre(null);
        setIsGenreModalOpen(true);
    };

    const openEditGenre = (e, genre) => {
        e.stopPropagation();
        setGenreMode('edit');
        setGenreName(genre.name);
        setEditingGenre(genre);
        setIsGenreModalOpen(true);
    };

    const submitGenre = (e) => {
        e.preventDefault();
        if (genreMode === 'create') {
            router.post(route('admin.genres.store'), { name: genreName }, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsGenreModalOpen(false);
                    setGenreName('');
                },
            });
        } else {
            router.put(route('admin.genres.update', editingGenre.id), { name: genreName }, {
                preserveScroll: true,
                onSuccess: () => setIsGenreModalOpen(false),
            });
        }
    };

    const deleteGenre = (e, id) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this genre?')) {
            router.delete(route('admin.genres.destroy', id), { preserveScroll: true });
        }
    };


    const submit = (e) => {
        e.preventDefault();
        post(route('admin.books.update', book.id));
    };

    return (
        <AdminLayout user={auth.user} header={`Edit Book: ${book.title} `}>
            <Head title="Edit Book" />

            {/* Genre Modal */}
            <Dialog open={isGenreModalOpen} onClose={() => setIsGenreModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-md w-full rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <Dialog.Title className="text-xl font-semibold text-gray-900">
                                {genreMode === 'create' ? 'Add New Genre' : 'Edit Genre'}
                            </Dialog.Title>
                            <button onClick={() => setIsGenreModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={submitGenre} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Genre Name</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                    placeholder="e.g., Fiqh, History"
                                    value={genreName}
                                    onChange={(e) => setGenreName(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsGenreModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    {genreMode === 'create' ? 'Add Genre' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>

            <div className="max-w-7xl mx-auto">
                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN - MAIN INFO */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-lg font-semibold text-gray-900">Book Information</h3>
                                <p className="text-sm text-gray-500">Update the book details and metadata.</p>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Synopsis</label>
                                    <textarea
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 h-32"
                                        value={data.synopsis}
                                        onChange={(e) => setData('synopsis', e.target.value)}
                                    />
                                    {errors.synopsis && <p className="mt-1 text-sm text-red-600">{errors.synopsis}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Metadata Grid Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-lg font-semibold text-gray-900">Publication Details</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.author}
                                        onChange={(e) => setData('author', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.publisher}
                                        onChange={(e) => setData('publisher', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Editor</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.editor}
                                        onChange={(e) => setData('editor', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Translator</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.translator}
                                        onChange={(e) => setData('translator', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <input
                                        type="number"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                    />
                                    {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.language}
                                        onChange={(e) => setData('language', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                                    <input
                                        type="text"
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.isbn}
                                        onChange={(e) => setData('isbn', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                                        <input
                                            type="number"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                            value={data.volume}
                                            onChange={(e) => setData('volume', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                                        <input
                                            type="number"
                                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                            value={data.page}
                                            onChange={(e) => setData('page', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Publishing Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Availability</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="0">Available</option>
                                        <option value="1">Borrowed</option>
                                        <option value="2">Lost</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Type</label>
                                    <select
                                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        <option value="1">Open Access (Public)</option>
                                        <option value="0">Restricted</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-6">



                        {/* Cover Image */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Cover Image</h3>
                            <div className="flex flex-col items-center justify-center">
                                <div className="mb-4 relative group">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-64 w-48 object-cover rounded shadow-md border"
                                        />
                                    ) : (
                                        <div className="h-64 w-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                                            <svg className="h-12 w-12 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="text-xs">No image selected</span>
                                        </div>
                                    )}
                                </div>

                                <label className="block w-full">
                                    <span className="sr-only">Choose profile photo</span>
                                    <input type="file" onChange={handleImageChange} accept="image/*" className="block w-full text-sm text-gray-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-indigo-50 file:text-indigo-700
                                      hover:file:bg-indigo-100
                                      cursor-pointer
                                    "/>
                                </label>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    PNG, JPG, GIF, WEBP up to 1MB
                                </p>
                                {errors.img_url && <p className="mt-1 text-sm text-red-600 text-center">{errors.img_url}</p>}
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-h-108 overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-semibold text-gray-900">Genres <span className="text-xs text-gray-500 font-normal ml-1">(Max 3)</span></h3>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsManageGenresMode(!isManageGenresMode)}
                                        className={`text - xs font - medium px - 2 py - 1 rounded transition - colors ${isManageGenresMode ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'} `}
                                    >
                                        {isManageGenresMode ? 'Done' : 'Manage'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={openCreateGenre}
                                        className="text-indigo-600 hover:text-indigo-800"
                                        title="Add Genre"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {genres.map((genre) => (
                                    <div
                                        key={genre.id}
                                        onClick={() => toggleGenre(genre.id)}
                                        className={`group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer select-none ${data.genres.includes(genre.id)
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {genre.name}

                                        {/* Icons for Edit/Delete (Manage Mode) */}
                                        {isManageGenresMode && (
                                            <div className="ml-2 pl-2 border-l border-white/30 flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={(e) => openEditGenre(e, genre)}
                                                    className="text-white/80 hover:text-white p-0.5 rounded hover:bg-white/20"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => deleteGenre(e, genre.id)}
                                                    className="text-red-200 hover:text-red-100 p-0.5 rounded hover:bg-red-500/50"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            </div>
                                        )}
                                        {/* Checkmark for selection (Normal Mode) */}
                                        {!isManageGenresMode && data.genres.includes(genre.id) && (
                                            <svg className="ml-1.5 h-4 w-4 text-indigo-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </div>
                                ))}
                                {genres.length === 0 && (
                                    <p className="text-sm text-gray-500 italic p-2">No genres found. Add one above.</p>
                                )}
                            </div>
                            {errors.genres && <p className="mt-2 text-sm text-red-600">{errors.genres}</p>}
                        </div>

                        {/* Duplicate Book Management (New) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Duplicate Books</h3>

                            <div className="mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        className={`flex-1 w-full border rounded-lg shadow-sm focus:ring-indigo-500 p-2 text-sm ${duplicateError ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}`}
                                        placeholder="Enter Book ID"
                                        id="duplicateInput"
                                        onKeyDown={async (e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = e.target.value;
                                                const input = e.target;

                                                if (!val) return;
                                                if (val == book.id) {
                                                    setDuplicateError('Cannot link to self.');
                                                    return;
                                                }
                                                if (data.duplicate_book_ids.includes(val) || data.duplicate_book_ids.includes(parseInt(val))) {
                                                    setDuplicateError('Book already added.');
                                                    input.value = '';
                                                    return;
                                                }

                                                try {
                                                    setDuplicateError('');
                                                    const response = await window.axios.post('/admin/books/check-duplicate', { id: val });
                                                    if (response.data && response.data.id) {
                                                        setExtraBooks(prev => [...prev, response.data]);
                                                        setData('duplicate_book_ids', [...data.duplicate_book_ids, response.data.id]);
                                                        input.value = '';
                                                    }
                                                } catch (err) {
                                                    if (err.response && err.response.status === 404) {
                                                        setDuplicateError('Book not found.');
                                                    } else {
                                                        setDuplicateError('Error validating ID.');
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const input = document.getElementById('duplicateInput');
                                            const val = input.value;

                                            if (!val) return;
                                            if (val == book.id) {
                                                setDuplicateError('Cannot link to self.');
                                                return;
                                            }
                                            if (data.duplicate_book_ids.includes(val) || data.duplicate_book_ids.includes(parseInt(val))) {
                                                setDuplicateError('Book already added.');
                                                input.value = '';
                                                return;
                                            }

                                            try {
                                                setDuplicateError('');
                                                const response = await window.axios.post('/admin/books/check-duplicate', { id: val });
                                                if (response.data && response.data.id) {
                                                    setExtraBooks(prev => [...prev, response.data]);
                                                    setData('duplicate_book_ids', [...data.duplicate_book_ids, response.data.id]);
                                                    input.value = '';
                                                }
                                            } catch (err) {
                                                if (err.response && err.response.status === 404) {
                                                    setDuplicateError('Book not found.');
                                                } else {
                                                    setDuplicateError('Error validating ID.');
                                                }
                                            }
                                        }}
                                        className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
                                    >
                                        Add
                                    </button>
                                </div>
                                {duplicateError && <p className="text-xs text-red-600 mt-1">{duplicateError}</p>}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {data.duplicate_book_ids.map((id) => {
                                    // Find title if available in relatedBooks or extraBooks
                                    const related = relatedBooks.find(b => b.id == id) || extraBooks.find(b => b.id == id);
                                    const displayText = related ? `ID: ${id} - ${related.title}` : `Book ID: ${id}`;

                                    return (
                                        <div
                                            key={id}
                                            className="group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                                        >
                                            <span className="truncate max-w-[150px]">{displayText}</span>
                                            <button
                                                type="button"
                                                onClick={() => setData('duplicate_book_ids', data.duplicate_book_ids.filter(item => item != id))}
                                                className="ml-2 text-indigo-400 hover:text-indigo-600"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    );
                                })}
                                {data.duplicate_book_ids.length === 0 && (
                                    <p className="text-xs text-gray-500 italic">No duplicates linked.</p>
                                )}
                                {errors.duplicate_book_ids && (
                                    <p className="mt-2 text-sm text-red-600">{errors.duplicate_book_ids}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                className="w-full inline-flex justify-center items-center px-4 py-3 bg-indigo-600 border border-transparent rounded-lg font-semibold text-sm text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 shadow-sm"
                                disabled={processing}
                            >
                                {processing ? 'Updating...' : 'Update Book'}
                            </button>
                            <Link
                                href={route('admin.books.index')}
                                className="w-full inline-flex justify-center items-center px-4 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
