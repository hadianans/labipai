import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';
import React from 'react';

export default function Index({ auth, events }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingEvent, setEditingEvent] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
    });

    const openModal = (event = null) => {
        clearErrors();
        if (event) {
            setEditingEvent(event);
            const formatDateTime = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().slice(0, 16);
            };

            setData({
                title: event.title,
                description: event.description || '',
                start_time: formatDateTime(event.start_time),
                end_time: formatDateTime(event.end_time),
            });
        } else {
            setEditingEvent(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                closeModal();
                Swal.fire(editingEvent ? 'Updated!' : 'Created!', `Event has been ${editingEvent ? 'updated' : 'created'}.`, 'success');
            },
        };

        if (editingEvent) {
            put(route('admin.calendar.update', editingEvent.id), options);
        } else {
            post(route('admin.calendar.store'), options);
        }
    };

    const handleDelete = (event) => {
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
                destroy(route('admin.calendar.destroy', event.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Event has been deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Calendar"
        >
            <Head title="Calendar" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div className="flex justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
                    <PrimaryButton onClick={() => openModal()}>Add Event</PrimaryButton>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {events.map((event) => (
                                <React.Fragment key={event.id}>
                                    <tr className={expandedRows.includes(event.id) ? 'bg-gray-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleRow(event.id)}
                                                    className="lg:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    {expandedRows.includes(event.id) ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                    )}
                                                </button>
                                                {event.title}
                                            </div>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{event.description}</td>
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(event.start_time).toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\./g, ':')}
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(event.end_time).toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\./g, ':')}
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openModal(event)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(event)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                    {expandedRows.includes(event.id) && (
                                        <tr className="bg-gray-50 lg:hidden">
                                            <td colSpan="5" className="px-6 py-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="sm:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                        <div className="flex gap-4">
                                                            <button onClick={() => openModal(event)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit</button>
                                                            <button onClick={() => handleDelete(event)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                                        </div>
                                                    </div>
                                                    <div className="md:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Time</span>
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(event.start_time).toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\./g, ':')}
                                                            <span className="mx-2">-</span>
                                                            {new Date(event.end_time).toLocaleString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/\./g, ':')}
                                                        </div>
                                                    </div>
                                                    <div className="lg:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Description</span>
                                                        <span className="text-sm text-gray-500 line-clamp-2">{event.description}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No events found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingEvent ? 'Edit Event' : 'Add Event'}
                    </h2>
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="title" value="Title" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full p-2"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="description" value="Description" />
                            <TextInput
                                id="description"
                                type="text"
                                className="mt-1 block w-full p-2"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="start_time" value="Start Time" />
                                <TextInput
                                    id="start_time"
                                    type="datetime-local"
                                    className="mt-1 block w-full p-2"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    required
                                />
                                <InputError message={errors.start_time} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_time" value="End Time" />
                                <TextInput
                                    id="end_time"
                                    type="datetime-local"
                                    className="mt-1 block w-full p-2"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    required
                                />
                                <InputError message={errors.end_time} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal} className="mr-3">Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingEvent ? 'Update' : 'Create'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
