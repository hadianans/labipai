import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';
import React from 'react';

import { useState } from 'react';

export default function Index({ auth, announcements }) {
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };
    const handleDelete = (announcement) => {
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
                router.delete(route('admin.announcements.destroy', announcement.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Announcement has been deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Announcements"
        >
            <Head title="Announcements" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                    <h3 className="text-lg font-medium text-gray-900">All Announcements</h3>
                    <Link
                        href={route('admin.announcements.create')}
                        className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Create Announcement
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Image</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Priority</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Status</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Duration</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {announcements.map((item) => (
                                <React.Fragment key={item.id}>
                                    <tr className={expandedRows.includes(item.id) ? 'bg-gray-50' : ''}>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleRow(item.id)}
                                                    className="lg:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    {expandedRows.includes(item.id) ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                    )}
                                                </button>
                                                {item.img_url ? (
                                                    <img className="h-10 w-10 rounded object-cover" src={`/storage/${item.img_url}`} alt="" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Img</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 whitespace-normal break-words">{item.title}</td>
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.priority === '2' ? 'Important' : item.priority === '1' ? 'Standard' : 'Low'}
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === '1' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {item.status === '1' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'Now'} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Forever'}
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={route('admin.announcements.edit', item.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                            <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                    {expandedRows.includes(item.id) && (
                                        <tr className="bg-gray-50 lg:hidden">
                                            <td colSpan="6" className="px-3 sm:px-6 py-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="sm:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                        <div className="flex gap-4">
                                                            <Link href={route('admin.announcements.edit', item.id)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit</Link>
                                                            <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                                        </div>
                                                    </div>
                                                    <div className="sm:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === '1' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {item.status === '1' ? 'Published' : 'Draft'}
                                                        </span>
                                                    </div>
                                                    <div className="md:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Priority</span>
                                                        <span className="text-sm text-gray-900">
                                                            {item.priority === '2' ? 'Important' : item.priority === '1' ? 'Standard' : 'Low'}
                                                        </span>
                                                    </div>
                                                    <div className="lg:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Duration</span>
                                                        <span className="text-sm text-gray-500">
                                                            {item.start_date ? new Date(item.start_date).toLocaleDateString() : 'Now'} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Forever'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {announcements.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500">No announcements found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
