import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput'; // Keep for search
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';

export default function Index({ auth, lends, filters = {} }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState(filters.tab || 'active');
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    // Create Form
    const { data, setData, post, processing, errors, reset, transform } = useForm({
        book_id: '',
        user_id: '',
        due_date: '', // Initialize empty, will be set by transform
    });

    const openCreateModal = () => {
        reset();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        reset();
    };

    const submitCreate = (e) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }));

        post(route('admin.lends.store'), {
            onSuccess: () => {
                closeCreateModal();
                Swal.fire('Success', 'Book lent successfully! Due date set to 7 days from now.', 'success');
            },
        });
    };

    const handleReturn = (id) => {
        Swal.fire({
            title: 'Return Book?',
            text: "This will mark the book as returned. Overdue fines may apply.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, return it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(route('admin.lends.update', id), { return: true }, {
                    onSuccess: () => Swal.fire('Returned!', 'Book has been returned.', 'success')
                });
            }
        });
    };

    const handleExtend = (id, count) => {
        if (count >= 2) return;

        Swal.fire({
            title: 'Extend Book Loan?',
            text: "This will extend the due date by 7 days.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, extend it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(route('admin.lends.update', id), { extend: true }, {
                    onSuccess: () => Swal.fire('Extended!', 'Loan period extended.', 'success'),
                    onError: () => Swal.fire('Error', 'Cannot extend loan.', 'error')
                });
            }
        });
    };

    // Search & Filter Logic
    const handleSearch = debounce((query) => {
        router.get(
            route('admin.lends.index'),
            { search: query, tab: activeTab },
            { preserveState: true, replace: true }
        );
    }, 300);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(
            route('admin.lends.index'),
            { search, tab: tab },
            { preserveState: true, replace: true }
        );
    };

    useEffect(() => {
        // Update search state if filters change from outside (e.g. back button)
        setSearch(filters.search || '');
    }, [filters.search]);


    return (
        <AdminLayout
            user={auth.user}
            header="Library: Loans"
        >
            <Head title="Loans" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 xl:mx-8">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleTabChange('active')}
                            className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${activeTab === 'active'
                                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Active Loans
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
                        <PrimaryButton onClick={openCreateModal} className="whitespace-nowrap">
                            Lend New Book
                        </PrimaryButton>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                <th scope="col" className="hidden lg:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                                <th scope="col" className="hidden md:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th scope="col" className="hidden xl:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                {activeTab === 'active' && <th scope="col" className="hidden sm:table-cell px-4 py-2 text-right text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {lends.data.map((lend) => (
                                <React.Fragment key={lend.id}>
                                    <tr className={expandedRows.includes(lend.id) ? 'bg-gray-50' : ''}>
                                        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                {/* Expand Button */}
                                                <button
                                                    onClick={() => toggleRow(lend.id)}
                                                    className="xl:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    {expandedRows.includes(lend.id) ? (
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                    ) : (
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                    )}
                                                </button>
                                                <div>
                                                    <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-xs" title={lend.book?.title}>{lend.book?.title || 'Unknown Book'}</div>
                                                    <div className="text-[10px] sm:text-xs text-gray-500 lg:hidden truncate max-w-[120px]">{lend.user?.username || lend.user?.name || 'Unknown User'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden lg:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate max-w-xs">
                                            {lend.user?.username || lend.user?.name || 'Unknown User'}
                                        </td>
                                        <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                            <span className={new Date(lend.due_date) < new Date() && !lend.returned_at ? 'text-red-600 font-bold' : ''}>
                                                {new Date(lend.due_date).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="hidden xl:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                            {lend.returned_at ? (
                                                <span className="text-green-600 font-medium">Returned on {new Date(lend.returned_at).toLocaleDateString()}</span>
                                            ) : (
                                                <span className="text-blue-600 font-medium">Active</span>
                                            )}
                                        </td>
                                        {activeTab === 'active' && (
                                            <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                                <div className="flex items-center gap-2 justify-end">
                                                    {/* Tombol Extend */}
                                                    <button
                                                        onClick={() => handleExtend(lend.id, lend.extension_count)}
                                                        disabled={lend.extension_count >= 2}
                                                        title={lend.extension_count >= 2 ? "Batas perpanjangan habis" : "Perpanjang Pinjaman"}
                                                        className="group relative flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold tracking-wide uppercase rounded-lg transition-all duration-200 
            disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
            bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-100 active:scale-95"
                                                    >
                                                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>Extend</span>
                                                        <span className="ml-0.5 px-1 sm:px-1.5 py-0.5 bg-indigo-200 text-indigo-700 rounded-full text-[9px] sm:text-[10px] group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                            {lend.extension_count}/2
                                                        </span>
                                                    </button>

                                                    {/* Tombol Return */}
                                                    <button
                                                        onClick={() => handleReturn(lend.id)}
                                                        className="flex items-center gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-bold tracking-wide uppercase rounded-lg transition-all duration-200
            bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-md hover:shadow-emerald-100 active:scale-95"
                                                    >
                                                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                        </svg>
                                                        <span>Return</span>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>

                                    {/* Child Row */}
                                    {expandedRows.includes(lend.id) && (
                                        <tr className="bg-gray-50 xl:hidden">
                                            <td colSpan="5" className="px-3 py-3 sm:px-6 sm:py-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                                    {/* Actions (Hidden on SM) */}
                                                    {activeTab === 'active' && (
                                                        <div className="sm:hidden">
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleExtend(lend.id, lend.extension_count)} disabled={lend.extension_count >= 2} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium disabled:text-gray-400">Extend</button>
                                                                <button onClick={() => handleReturn(lend.id)} className="text-emerald-600 hover:text-emerald-900 text-sm font-medium">Return</button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Due Date (Hidden on MD) */}
                                                    <div className="md:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Due Date</span>
                                                        <span className={new Date(lend.due_date) < new Date() && !lend.returned_at ? 'text-red-600 font-bold' : 'text-gray-900'}>
                                                            {new Date(lend.due_date).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    {/* Borrower (Hidden on LG) */}
                                                    <div className="lg:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Borrower</span>
                                                        <span className="text-gray-900">{lend.user?.username || lend.user?.name || 'Unknown User'}</span>
                                                    </div>

                                                    {/* Status (Hidden on XL) */}
                                                    <div className="xl:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                                        {lend.returned_at ? (
                                                            <span className="text-green-600 font-medium">Returned on {new Date(lend.returned_at).toLocaleDateString()}</span>
                                                        ) : (
                                                            <span className="text-blue-600 font-medium">Active</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {lends.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No {activeTab} loans found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Lend a Book (Manual ID)</h2>
                    <form onSubmit={submitCreate}>
                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="user_id" value="User ID" />
                                <TextInput
                                    id="user_id"
                                    type="number"
                                    className="mt-1 block w-full p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.user_id}
                                    onChange={(e) => setData('user_id', e.target.value)}
                                    required
                                    placeholder="Enter User ID"
                                />
                                <InputError message={errors.user_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="book_id" value="Book ID" />
                                <TextInput
                                    id="book_id"
                                    type="number"
                                    className="mt-1 block w-full p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.book_id}
                                    onChange={(e) => setData('book_id', e.target.value)}
                                    required
                                    placeholder="Enter Book ID"
                                />
                                <InputError message={errors.book_id} className="mt-2" />
                            </div>

                            <p className="text-sm text-gray-500">Due date will be automatically set to 7 days from now.</p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeCreateModal}>Cancel</SecondaryButton>
                            <PrimaryButton className="ml-3" disabled={processing}>
                                Lend Book
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
