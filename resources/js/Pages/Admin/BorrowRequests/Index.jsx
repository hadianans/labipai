import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';

export default function Index({ auth, requests, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.tab || 'pending');
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const handleApprove = (id) => {
        Swal.fire({
            title: 'Approve Request?',
            text: "User will be able to pick up the book.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, approve it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('admin.borrow-requests.approve', id), {}, {
                    onSuccess: () => Swal.fire('Approved!', 'Request has been approved.', 'success')
                });
            }
        });
    };

    const handleReject = (id) => {
        Swal.fire({
            title: 'Reject Request?',
            input: 'text',
            inputLabel: 'Reason',
            showCancelButton: true,
            confirmButtonText: 'Reject',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!'
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('admin.borrow-requests.reject', id), { admin_notes: result.value }, {
                    onSuccess: () => Swal.fire('Rejected!', 'Request has been rejected.', 'success')
                });
            }
        });
    };

    // Search & Filter Logic
    const handleSearch = debounce((query) => {
        router.get(
            route('admin.borrow-requests.index'),
            { search: query, tab: activeTab },
            { preserveState: true, replace: true }
        );
    }, 300);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(
            route('admin.borrow-requests.index'),
            { search, tab: tab },
            { preserveState: true, replace: true }
        );
    };

    useEffect(() => {
        setSearch(filters.search || '');
    }, [filters.search]);

    return (
        <AdminLayout
            user={auth.user}
            header="Borrow Requests"
        >
            <Head title="Borrow Requests" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* Header Actions */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleTabChange('pending')}
                                        className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${activeTab === 'pending'
                                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('history')}
                                        className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${activeTab === 'history'
                                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        History
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <TextInput
                                        type="text"
                                        placeholder="Search user or book..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            handleSearch(e.target.value);
                                        }}
                                        className="w-full md:w-64 p-2"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-md">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">User</th>
                                            <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Book</th>
                                            <th scope="col" className="hidden lg:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                                            <th scope="col" className="hidden md:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                            <th scope="col" className="hidden xl:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Expires At</th>
                                            {activeTab === 'pending' && <th scope="col" className="hidden sm:table-cell px-4 py-2 text-right text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requests.data.map((req) => (
                                            <React.Fragment key={req.id}>
                                                <tr className={`hover:bg-gray-50 transition-colors ${expandedRows.includes(req.id) ? 'bg-gray-50' : ''}`}>
                                                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            {/* Expand Button */}
                                                            <button
                                                                onClick={() => toggleRow(req.id)}
                                                                className="xl:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            >
                                                                {expandedRows.includes(req.id) ? (
                                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                                ) : (
                                                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                                )}
                                                            </button>
                                                            <div>
                                                                <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-[150px]" title={req.user.username}>{req.user.username}</div>
                                                                <div className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[100px] sm:max-w-[150px]" title={req.user.email}>{req.user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                                                        <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[100px] sm:max-w-xs" title={req.book.title}>{req.book.title}</div>
                                                    </td>
                                                    <td className="hidden lg:table-cell px-4 py-2 whitespace-nowrap">
                                                        <div className="text-xs sm:text-sm text-gray-500">{new Date(req.created_at).toLocaleString()}</div>
                                                    </td>
                                                    <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                    req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {req.status}
                                                        </span>
                                                    </td>
                                                    <td className="hidden xl:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                                        {req.expires_at ? new Date(req.expires_at).toLocaleTimeString() : '-'}
                                                    </td>
                                                    {activeTab === 'pending' && (
                                                        <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleApprove(req.id)}
                                                                    className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 sm:px-3 sm:py-1 rounded-md transition-colors"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(req.id)}
                                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 sm:px-3 sm:py-1 rounded-md transition-colors"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>

                                                {/* Child Row */}
                                                {expandedRows.includes(req.id) && (
                                                    <tr className="bg-gray-50 xl:hidden">
                                                        <td colSpan="6" className="px-3 py-3 sm:px-6 sm:py-4">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                {/* Actions (Hidden on SM) */}
                                                                {activeTab === 'pending' && (
                                                                    <div className="sm:hidden">
                                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={() => handleApprove(req.id)}
                                                                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors text-sm"
                                                                            >
                                                                                Approve
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleReject(req.id)}
                                                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors text-sm"
                                                                            >
                                                                                Reject
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Status (Hidden on MD) */}
                                                                <div className="md:hidden">
                                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                        ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                            req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                                req.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                        {req.status}
                                                                    </span>
                                                                </div>

                                                                {/* Date (Hidden on LG) */}
                                                                <div className="lg:hidden">
                                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Date</span>
                                                                    <div className="text-sm text-gray-500">{new Date(req.created_at).toLocaleString()}</div>
                                                                </div>

                                                                {/* Expires At (Hidden on XL) */}
                                                                <div className="xl:hidden">
                                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Expires At</span>
                                                                    <div className="text-sm text-gray-500">{req.expires_at ? new Date(req.expires_at).toLocaleTimeString() : '-'}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        {requests.data.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 italic">
                                                    No {activeTab} requests found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
