import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, programs }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Note: When handling files with Inertia useForm, we need to be careful with 'put' vs 'post' with _method spoofing if creating a FormData object manually usually, 
    // but useForm handles it if we use forceFormData for multipart. 
    // However, for updates with files, Laravel usually needs POST with _method: PUT. 
    // Inertia's router.post with transform function or just using post for everything with a dedicated update route might be needed.
    // Let's stick to standard useForm usage, but remember that for file uploads in 'update', we often use post and spoof PUT.

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        description: '',
        detail_url: '',
        image: null,
        _method: 'POST', // Default to POST, will flip to PUT for edits
    });

    const openModal = (program = null) => {
        if (program) {
            setIsEditing(true);
            setData({
                id: program.id,
                name: program.name,
                description: program.description || '',
                detail_url: program.detail_url || '',
                image: null, // Don't preload existing image file object
                _method: 'PUT',
            });
        } else {
            setIsEditing(false);
            reset();
            setData({
                id: '',
                name: '',
                description: '',
                detail_url: '',
                image: null,
                _method: 'POST',
            });
        }
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        const routeName = isEditing ? 'admin.programs.update' : 'admin.programs.store';
        const routeParams = isEditing ? data.id : undefined;

        // Since we are uploading files, we must ALWAYS use POST. 
        // For updates, we use _method: PUT in the data (already handled by openModal logic)

        post(route(routeName, routeParams), {
            forceFormData: true,
            onSuccess: () => {
                closeModal();
                Swal.fire(isEditing ? 'Updated!' : 'Created!', isEditing ? 'Program updated.' : 'Program created.', 'success');
            },
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.programs.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('Deleted!', 'Program deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Program Management"
        >
            <Head title="Programs" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div className="flex justify-end mb-6">
                        <PrimaryButton onClick={() => openModal()}>
                            Add New Program
                        </PrimaryButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program) => (
                            <div key={program.id} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-48 bg-gray-200 w-full relative">
                                    {program.img_url ? (
                                        <img src={`/storage/${program.img_url}`} alt={program.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <span>No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{program.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{program.description}</p>
                                    {program.detail_url && (
                                        <a href={program.detail_url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 text-sm hover:underline mb-4 block">
                                            View Details &rarr;
                                        </a>
                                    )}
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button onClick={() => openModal(program)} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded text-sm hover:bg-indigo-100">Edit</button>
                                        <button onClick={() => handleDelete(program.id)} className="px-3 py-1 bg-red-50 text-red-700 rounded text-sm hover:bg-red-100">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {programs.length === 0 && (
                        <div className="text-center text-gray-500 py-10">No programs found.</div>
                    )}
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {isEditing ? 'Edit Program' : 'Create Program'}
                    </h2>

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                type="text"
                                className="mt-1 block w-full p-2"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="description" value="Description" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="3"
                            ></textarea>
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="detail_url" value="Detail URL" />
                            <TextInput
                                id="detail_url"
                                value={data.detail_url}
                                onChange={(e) => setData('detail_url', e.target.value)}
                                type="url"
                                className="mt-1 block w-full p-2"
                                placeholder="https://example.com"
                            />
                            <InputError message={errors.detail_url} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="image" value="Program Image" />
                            <input
                                id="image"
                                type="file"
                                onChange={(e) => setData('image', e.target.files[0])}
                                className="mt-1 block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-indigo-50 file:text-indigo-700
                                  hover:file:bg-indigo-100
                                "
                                accept="image/*"
                            />
                            <InputError message={errors.image} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal} className="mr-3">
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {isEditing ? 'Update' : 'Create'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
