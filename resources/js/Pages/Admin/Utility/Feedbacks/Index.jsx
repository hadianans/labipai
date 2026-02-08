import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';

export default function Index({ auth, feedbacks }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const openModal = (feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFeedback(null);
    };

    const handleDelete = (feedback) => {
        Swal.fire({
            title: 'Delete Feedback?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.feedbacks.destroy', feedback.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Feedback has been deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Feedbacks"
        >
            <Head title="Feedbacks" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div className="flex justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">User Feedbacks</h3>
                </div>

                <div className="overflow-x-auto rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th scope="col" className="hidden sm:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="hidden md:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th scope="col" className="hidden sm:table-cell px-4 py-2 text-right text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {feedbacks.map((feedback) => (
                                <React.Fragment key={feedback.id}>
                                    <tr className={expandedRows.includes(feedback.id) ? 'bg-gray-50' : ''}>
                                        <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => toggleRow(feedback.id)}
                                                    className="md:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    {expandedRows.includes(feedback.id) ? (
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                    ) : (
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                    )}
                                                </button>
                                                <div className="truncate max-w-[clamp(120px,30vw,250px)] sm:max-w-md">
                                                    {feedback.is_anonymous ? 'Anonymous' : (feedback.user?.username || 'Unknown')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                            {new Date(feedback.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate max-w-[clamp(150px,30vw,300px)]">{feedback.subject}</td>
                                        <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                            <button onClick={() => openModal(feedback)} className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                                            <button onClick={() => handleDelete(feedback)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                    {expandedRows.includes(feedback.id) && (
                                        <tr className="bg-gray-50 md:hidden">
                                            <td colSpan="4" className="px-3 py-3 sm:px-6 sm:py-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="sm:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                        <div className="flex gap-4">
                                                            <button onClick={() => openModal(feedback)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">View</button>
                                                            <button onClick={() => handleDelete(feedback)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                                        </div>
                                                    </div>
                                                    <div className="sm:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Date</span>
                                                        <span className="text-sm text-gray-500">{new Date(feedback.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    {/* Subject is hidden on MD, so visible on XS/SM. No responsive class needed for div, just showing it. */}
                                                    <div className="md:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Subject</span>
                                                        <span className="text-sm text-gray-500 break-words">{feedback.subject}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {feedbacks.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No feedbacks received.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Feedback Details</h2>
                    {selectedFeedback && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">From:</label>
                                <p className="mt-1 text-gray-900">{selectedFeedback.is_anonymous ? 'Anonymous' : (selectedFeedback.user?.username || 'Unknown')}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Date:</label>
                                <p className="mt-1 text-gray-900">{new Date(selectedFeedback.created_at).toLocaleString()}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Subject:</label>
                                <p className="mt-1 text-gray-900">{selectedFeedback.subject}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Message:</label>
                                <div className="mt-1 p-3 bg-gray-50 rounded text-gray-900 whitespace-pre-wrap">
                                    {selectedFeedback.message}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Close</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
