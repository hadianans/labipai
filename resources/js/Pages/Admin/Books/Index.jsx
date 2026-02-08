import React from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, books, filters }) {
    const { url } = usePage();
    const [search, setSearch] = React.useState(filters.search || '');
    const [expandedRows, setExpandedRows] = React.useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.books.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.books.destroy', id), {
                    preserveScroll: true,
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Book Management"
        >
            <Head title="Books" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg xl:mx-8">
                <div className="p-6 text-gray-900">

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                            <input
                                type="text"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full p-2"
                                placeholder="Search books..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                                Search
                            </button>
                        </form>

                        <Link
                            href={route('admin.books.create')}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Add New Book
                        </Link>
                    </div>

                    <div className="overflow-x-auto rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider max-w-[150px] sm:max-w-sm">
                                        Cover``
                                    </th>
                                    <th scope="col" className="px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Title / Author
                                    </th>
                                    <th scope="col" className="hidden lg:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Genres
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="hidden xl:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="hidden xl:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Year
                                    </th>
                                    <th scope="col" className="hidden sm:table-cell px-4 py-2 text-right text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {books.data.length > 0 ? (
                                    books.data.map((book) => (
                                        <React.Fragment key={book.id}>
                                            <tr className={expandedRows.includes(book.id) ? 'bg-gray-50' : ''}>
                                                <td className="p-2 sm:px-4 sm:py-2 whitespace-nowrap max-w-[150px] sm:max-w-sm">
                                                    <div className="flex items-center gap-3">
                                                        {/* Expand Button (Visible on small screens) */}
                                                        <button
                                                            onClick={() => toggleRow(book.id)}
                                                            className="xl:hidden flex-shrink-0 inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        >
                                                            {expandedRows.includes(book.id) ? (
                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                            ) : (
                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                            )}
                                                        </button>

                                                        {book.img_url ? (
                                                            <img
                                                                src={book.img_url}
                                                                alt={book.title}
                                                                className="h-20 w-15 md:h-32 md:w-24 lg:h-42 lg:w-32 object-cover rounded shadow"
                                                            />
                                                        ) : (
                                                            <div className="h-20 w-15 md:h-32 md:w-24 lg:h-42 lg:w-32 object-cover rounded shadow flex items-center justify-center bg-gray-100 text-gray-400 flex-col">
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-2 sm:px-4 sm:py-2">
                                                    <div className="text-xs sm:text-sm md:text-base font-medium text-gray-900 truncate max-w-[clamp(100px,42vw,360px)] sm:max-w-[clamp(150px,30vw,360px)]" title={book.title}>{book.title}</div>
                                                    <div className="text-xs sm:text-sm md:text-base text-gray-500 truncate max-w-[clamp(100px,42vw,360px)] sm:max-w-[clamp(150px,30vw,360px)]">{book.author}</div>
                                                    <div className="text-xs text-gray-400">{book.id}</div>
                                                </td>
                                                <td className="hidden lg:table-cell px-4 py-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {book.genres.map(genre => (
                                                            <span key={genre.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs lg:text-sm font-medium bg-gray-100 text-gray-800">
                                                                {genre.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${book.status === '0' ? 'bg-green-100 text-green-800' :
                                                            book.status === '1' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'}`}>
                                                        {book.status === '0' ? 'Available' : book.status === '1' ? 'Borrowed' : 'Lost'}
                                                    </span>
                                                </td>
                                                <td className="hidden xl:table-cell px-4 py-2 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${book.type === '1' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                                        {book.type === '1' ? 'Open Access' : 'Restricted'}
                                                    </span>
                                                </td>
                                                <td className="hidden xl:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                    {book.year}
                                                </td>
                                                <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link href={route('admin.books.edit', book.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                                    <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>

                                            {/* Child Row */}
                                            {expandedRows.includes(book.id) && (
                                                <tr className="bg-gray-50 xl:hidden">
                                                    <td colSpan="7" className="px-4 py-4 sm:px-6">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                                            {/* Actions (Hidden on SM) */}
                                                            <div className="sm:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                                <div className="flex gap-4">
                                                                    <Link href={route('admin.books.edit', book.id)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit Book</Link>
                                                                    <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete Book</button>
                                                                </div>
                                                            </div>

                                                            {/* Status (Hidden on MD) */}
                                                            <div className="md:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                    ${book.status === '0' ? 'bg-green-100 text-green-800' :
                                                                        book.status === '1' ? 'bg-yellow-100 text-yellow-800' :
                                                                            'bg-red-100 text-red-800'}`}>
                                                                    {book.status === '0' ? 'Available' : book.status === '1' ? 'Borrowed' : 'Lost'}
                                                                </span>
                                                            </div>

                                                            {/* Genres (Hidden on LG) */}
                                                            <div className="lg:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Genres</span>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {book.genres.map(genre => (
                                                                        <span key={genre.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                            {genre.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Type (Hidden on XL) */}
                                                            <div className="xl:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Type</span>
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                    ${book.type === '1' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                                                    {book.type === '1' ? 'Open Access' : 'Restricted'}
                                                                </span>
                                                            </div>

                                                            {/* Year (Hidden on XL) */}
                                                            <div className="xl:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Year</span>
                                                                <span className="text-sm text-gray-900">{book.year}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No books found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4">
                        <Pagination links={books.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
