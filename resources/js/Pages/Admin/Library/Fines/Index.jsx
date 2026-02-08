import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';

export default function Index({ auth, fines, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.tab || 'unpaid');
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const handlePay = (id) => {
        Swal.fire({
            title: 'Mark as Paid?',
            text: "Confirm that this fine has been paid.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Mark Paid'
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(route('admin.fines.update', id), { pay: true }, {
                    onSuccess: () => Swal.fire('Paid!', 'Fine has been marked as paid.', 'success')
                });
            }
        });
    };

    // Search & Filter Logic
    const handleSearch = debounce((query) => {
        router.get(
            route('admin.fines.index'),
            { search: query, tab: activeTab },
            { preserveState: true, replace: true }
        );
    }, 300);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(
            route('admin.fines.index'),
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
            header="Library: Fines"
        >
            <Head title="Fines" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 xl:mx-8">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleTabChange('unpaid')}
                            className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${activeTab === 'unpaid'
                                ? 'border-red-500 text-red-600 bg-red-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Unpaid
                        </button>
                        <button
                            onClick={() => handleTabChange('paid')}
                            className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${activeTab === 'paid'
                                ? 'border-green-500 text-green-600 bg-green-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            History (Paid)
                        </button>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <TextInput
                            type="text"
                            placeholder="Search..."
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
                                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                <th scope="col" className="hidden lg:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="hidden md:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="hidden xl:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                {activeTab === 'unpaid' && <th scope="col" className="hidden sm:table-cell px-4 py-2 text-right text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fines.data.map((fine) => (
                                <React.Fragment key={fine.id}>
                                    <tr className={expandedRows.includes(fine.id) ? 'bg-gray-50' : ''}>
                                        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                {/* Expand Button */}
                                                <button
                                                    onClick={() => toggleRow(fine.id)}
                                                    className="xl:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                >
                                                    {expandedRows.includes(fine.id) ? (
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                    ) : (
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                    )}
                                                </button>
                                                <div>
                                                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs" title={fine.lend?.book?.title}>{fine.lend?.book?.title || 'Unknown Book'}</div>
                                                    <div className="text-[10px] sm:text-xs text-gray-500 lg:hidden truncate max-w-[120px]">{fine.lend?.user?.username || 'Unknown User'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden lg:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate max-w-xs">
                                            {fine.lend?.user?.username || 'Unknown User'}
                                        </td>
                                        <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-bold">
                                            Rp {parseInt(fine.amount).toLocaleString('id-ID')}
                                        </td>
                                        <td className="hidden xl:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm">
                                            {fine.is_paid ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Unpaid
                                                </span>
                                            )}
                                        </td>
                                        {activeTab === 'unpaid' && (
                                            <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                                <button
                                                    onClick={() => handlePay(fine.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Mark Paid
                                                </button>
                                            </td>
                                        )}
                                    </tr>

                                    {/* Child Row */}
                                    {expandedRows.includes(fine.id) && (
                                        <tr className="bg-gray-50 xl:hidden">
                                            <td colSpan="5" className="px-3 py-3 sm:px-6 sm:py-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                                    {/* Actions (Hidden on SM) */}
                                                    {activeTab === 'unpaid' && (
                                                        <div className="sm:hidden">
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                            <button
                                                                onClick={() => handlePay(fine.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                                            >
                                                                Mark Paid
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Amount (Hidden on MD) */}
                                                    <div className="md:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Amount</span>
                                                        <span className="text-gray-900 font-bold">Rp {parseInt(fine.amount).toLocaleString('id-ID')}</span>
                                                    </div>

                                                    {/* User (Hidden on LG) */}
                                                    <div className="lg:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">User</span>
                                                        <span className="text-gray-900">{fine.lend?.user?.username || 'Unknown User'}</span>
                                                    </div>

                                                    {/* Status (Hidden on XL) */}
                                                    <div className="xl:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                                        {fine.is_paid ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Paid
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                Unpaid
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {fines.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No fines recorded.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
