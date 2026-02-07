import AdminLayout from '@/Layouts/Admin/AdminLayout'; // Standard layout
import { Head, useForm } from '@inertiajs/react'; // Inertia helpers
import { useState } from 'react';
import Modal from '@/Components/Modal'; // Assuming Modal exists
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';

export default function Index({ auth, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    const openModal = (category = null) => {
        clearErrors();
        if (category) {
            setEditingCategory(category);
            setData('name', category.name);
        } else {
            setEditingCategory(null);
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
        if (editingCategory) {
            put(route('admin.categories.update', editingCategory.id), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('Updated!', 'Category has been updated.', 'success');
                },
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => {
                    closeModal();
                    Swal.fire('Created!', 'Category has been created.', 'success');
                },
            });
        }
    };

    const handleDelete = (category) => {
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
                destroy(route('admin.categories.destroy', category.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Category has been deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Categories"
        >
            <Head title="Categories" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div className="flex justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Category List</h3>
                    <PrimaryButton onClick={() => openModal()}>Add New Category</PrimaryButton>
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
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openModal(category)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingCategory ? 'Edit Category' : 'Create Category'}
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
                                {editingCategory ? 'Update' : 'Create'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
