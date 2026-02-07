import AdminLayout from '@/Layouts/Admin/AdminLayout'; // Switch to AdminLayout
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';

export default function Index({ auth, tags }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    const openModal = (tag = null) => {
        clearErrors();
        if (tag) {
            setEditingTag(tag);
            setData('name', tag.name);
        } else {
            setEditingTag(null);
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
        if (editingTag) {
            put(route('admin.tags.update', editingTag.id), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('Updated!', 'Tag has been updated.', 'success');
                },
            });
        } else {
            post(route('admin.tags.store'), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('Created!', 'Tag has been created.', 'success');
                },
            });
        }
    };

    const handleDelete = (tag) => {
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
                destroy(route('admin.tags.destroy', tag.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Tag has been deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Tags"
        >
            <Head title="Tags" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div className="flex justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Tag List</h3>
                    <PrimaryButton onClick={() => openModal()}>Add New Tag</PrimaryButton>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tags.map((tag) => (
                                <tr key={tag.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tag.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openModal(tag)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tag)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tags.length === 0 && (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No tags found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingTag ? 'Edit Tag' : 'Create Tag'}
                    </h2>
                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoFocus
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal} className="mr-3">Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingTag ? 'Update' : 'Create'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
