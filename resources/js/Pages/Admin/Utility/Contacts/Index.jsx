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

export default function Index({ auth, contacts }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingContact, setEditingContact] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        type: '',
        detail: '',
    });

    const openModal = (contact = null) => {
        clearErrors();
        if (contact) {
            setEditingContact(contact);
            setData({
                type: contact.type,
                detail: contact.detail,
            });
        } else {
            setEditingContact(null);
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
                Swal.fire(editingContact ? 'Updated!' : 'Created!', `Contact has been ${editingContact ? 'updated' : 'created'}.`, 'success');
            },
        };

        if (editingContact) {
            put(route('admin.contacts.update', editingContact.id), options);
        } else {
            post(route('admin.contacts.store'), options);
        }
    };

    const handleDelete = (contact) => {
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
                destroy(route('admin.contacts.destroy', contact.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Contact has been deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Contacts"
        >
            <Head title="Contacts" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div className="flex justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                    <PrimaryButton onClick={() => openModal()}>Add New Contact</PrimaryButton>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contacts.map((contact) => (
                                <React.Fragment key={contact.id}>
                                    <tr className={expandedRows.includes(contact.id) ? 'bg-gray-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleRow(contact.id)}
                                                    className="sm:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    {expandedRows.includes(contact.id) ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                    )}
                                                </button>
                                                {contact.type}
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.detail}</td>
                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => openModal(contact)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(contact)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                    {expandedRows.includes(contact.id) && (
                                        <tr className="bg-gray-50 sm:hidden">
                                            <td colSpan="3" className="px-6 py-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                        <div className="flex gap-4">
                                                            <button onClick={() => openModal(contact)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit</button>
                                                            <button onClick={() => handleDelete(contact)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Detail</span>
                                                        <span className="text-sm text-gray-500">{contact.detail}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {contacts.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No contacts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingContact ? 'Edit Contact' : 'Add Contact'}
                    </h2>
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="type" value="Type (e.g., email, whatsapp)" />
                            <TextInput
                                id="type"
                                type="text"
                                className="mt-1 block w-full p-2"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                required
                            />
                            <InputError message={errors.type} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="detail" value="Detail (e.g., info@school.com, +62...)" />
                            <TextInput
                                id="detail"
                                type="text"
                                className="mt-1 block w-full p-2"
                                value={data.detail}
                                onChange={(e) => setData('detail', e.target.value)}
                                required
                            />
                            <InputError message={errors.detail} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal} className="mr-3">Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingContact ? 'Update' : 'Create'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
