import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/Admin/AdminLayout'; // Use AdminLayout
import { Head, useForm, router } from '@inertiajs/react'; // Added router
import { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';

export default function Index({ auth, galleryItems, tags, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = debounce((query) => {
        router.get(
            route('admin.gallery.index'),
            { search: query },
            { preserveState: true, replace: true }
        );
    }, 300);

    // Gallery Item Logic
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        image: null,
        is_hero: false,
        tags: [],
    });

    const openModal = (item = null) => {
        clearErrors();
        if (item) {
            setEditingItem(item);
            setData({
                title: item.title,
                description: item.description || '',
                image: null,
                is_hero: Boolean(item.is_hero),
                tags: item.tags.map(t => t.id), // assuming tags relation loaded
            });
            setImagePreview(item.img_url ? `/storage/${item.img_url}` : null);
        } else {
            setEditingItem(null);
            reset();
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleTagChange = (tagId) => {
        const currentTags = [...data.tags];
        if (currentTags.includes(tagId)) {
            setData('tags', currentTags.filter(id => id !== tagId));
        } else {
            setData('tags', [...currentTags, tagId]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                closeModal();
                Swal.fire(editingItem ? 'Updated!' : 'Created!', `Gallery item has been ${editingItem ? 'updated' : 'created'}.`, 'success');
            },
        };

        if (editingItem) {
            // Use post with _method: put for file upload in standard Laravel/Inertia update
            // But since Inertia v0.x router.post supports generic, data conversion is automatic usually.
            // Actually usually needs FormData wrapper if using manual axios, but Inertia useForm handles it.
            // **HOWEVER**, PUT requests with FormData (files) in Laravel often issues. Better to verify method spoofing.
            // Inertia's `put` helper may not send files correctly if they are FormData.
            // Standard practice for file uploads in updates: use POST with `_method: 'PUT'`.
            data._method = 'PUT';
            post(route('admin.gallery.update', editingItem.id), options);
        } else {
            post(route('admin.gallery.store'), options);
        }
    };

    const handleDelete = (item) => {
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
                destroy(route('admin.gallery.destroy', item.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Gallery item has been deleted.', 'success'),
                });
            }
        });
    };

    // Tag Management Logic
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const { data: tagData, setData: setTagData, post: postTag, put: putTag, delete: destroyTag, processing: tagProcessing, errors: tagErrors, reset: resetTag, clearErrors: clearTagErrors } = useForm({
        name: '',
    });

    const openTagModal = (tag = null) => {
        clearTagErrors();
        if (tag) {
            setEditingTag(tag);
            setTagData('name', tag.name);
        } else {
            setEditingTag(null);
            resetTag();
        }
        setIsTagModalOpen(true);
    };

    const closeTagModal = () => {
        setIsTagModalOpen(false);
        resetTag();
    };

    const submitTag = (e) => {
        e.preventDefault();
        if (editingTag) {
            putTag(route('admin.tags.update', editingTag.id), {
                onSuccess: () => {
                    closeTagModal();
                    Swal.fire('Updated!', 'Tag has been updated.', 'success');
                },
            });
        } else {
            postTag(route('admin.tags.store'), {
                onSuccess: () => {
                    closeTagModal();
                    Swal.fire('Created!', 'Tag has been created.', 'success');
                },
            });
        }
    };

    const handleDeleteTag = (tag) => {
        Swal.fire({
            title: 'Delete Tag?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroyTag(route('admin.tags.destroy', tag.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Tag has been deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Gallery"
        >
            <Head title="Gallery" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h3 className="text-lg font-medium text-gray-900">Gallery Items</h3>

                            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                <TextInput
                                    type="text"
                                    placeholder="Search gallery..."
                                    defaultValue={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full md:w-64 p-2"
                                />
                                <div className="flex space-x-3">
                                    <SecondaryButton onClick={() => openTagModal()}>
                                        Manage Tags
                                    </SecondaryButton>
                                    <PrimaryButton onClick={() => openModal()}>Add New Item</PrimaryButton>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {galleryItems.map((item) => (
                                <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative h-48">
                                        {item.img_url ? (
                                            <img src={`/storage/${item.img_url}`} alt={item.alt_text || item.title} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{item.title}</h4>
                                                {item.is_hero === 1 && (
                                                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full mt-1">
                                                        Hero Slider
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {item.tags.map(tag => (
                                                <span key={tag.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{tag.name}</span>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-2">
                                            <button onClick={() => openModal(item)} className="text-sm text-indigo-600 hover:text-indigo-900">Edit</button>
                                            <button onClick={() => handleDelete(item)} className="text-sm text-red-600 hover:text-red-900">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {galleryItems.length === 0 && (
                            <p className="text-center text-gray-500 py-10">No gallery items found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Gallery Item Modal */}
            <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
                    </h2>
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {/* Input Title */}
                            <div className="relative">
                                <TextInput
                                    id="title"
                                    type="text"
                                    placeholder="Title" // Menggunakan placeholder untuk hemat ruang
                                    className="block w-full p-2 text-sm border-gray-300 focus:ring-indigo-500 rounded-md"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-1 text-xs" />
                            </div>

                            {/* Input Description */}
                            <div className="relative">
                                <TextInput
                                    id="description"
                                    type="text"
                                    placeholder="Description (Optional)"
                                    className="block w-full p-2 text-sm border-gray-300 focus:ring-indigo-500 rounded-md"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                <InputError message={errors.description} className="mt-1 text-xs" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <InputLabel htmlFor="image" value="Gambar Hero" className="mb-2" />

                            <div className="w-full max-w-[260px]">
                                <div className="relative group overflow-hidden rounded-lg border-2 border-gray-200 aspect-video bg-gray-50">

                                    {/* INPUT FILE (Tetap di sini agar selalu bisa diakses) */}
                                    <input
                                        type="file"
                                        id="image"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />

                                    {!imagePreview ? (
                                        /* STATE: KOSONG (Dropzone) */
                                        <label
                                            htmlFor="image"
                                            className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-indigo-50 transition-colors group/label"
                                        >
                                            <div className="p-2 bg-white rounded-full shadow-sm mb-2 group-hover/label:scale-110 transition-transform">
                                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="C12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <p className="text-[13px] text-gray-700 font-medium">Pilih Gambar</p>
                                        </label>
                                    ) : (
                                        /* STATE: ADA GAMBAR (Preview + Overlay Tombol) */
                                        <div className="relative w-full h-full">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />

                                            {/* OVERLAY: Tombol ini muncul saat hover di atas gambar */}
                                            <label
                                                htmlFor="image"
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
                                            >
                                                <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-md text-xs font-bold shadow-lg">
                                                    Ganti Gambar
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <InputError message={errors.image} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    checked={data.is_hero}
                                    onChange={(e) => setData('is_hero', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Show in Home Hero Slider</span>
                            </label>
                        </div>
                        <div className="mt-4">
                            <InputLabel value="Tags" />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <label key={tag.id} className="inline-flex items-center bg-gray-50 px-3 py-1 rounded border cursor-pointer hover:bg-gray-100">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 mr-2"
                                            checked={data.tags.includes(tag.id)}
                                            onChange={() => handleTagChange(tag.id)}
                                        />
                                        <span className="text-sm text-gray-700">{tag.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal} className="mr-3">Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                {editingItem ? 'Update' : 'Create'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Tag Manager Modal */}
            <Modal show={isTagModalOpen} onClose={closeTagModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Tags</h2>

                    {/* Create/Edit Form */}
                    <form onSubmit={submitTag} className="mb-6 flex gap-2">
                        <div className="flex-1">
                            <InputLabel htmlFor="tag_name" value={editingTag ? "Edit Tag Name" : "New Tag Name"} className="sr-only" />
                            <TextInput
                                id="tag_name"
                                type="text"
                                className="block w-full"
                                placeholder="Tag Name"
                                value={tagData.name}
                                onChange={(e) => setTagData('name', e.target.value)}
                                required
                            />
                            <InputError message={tagErrors.name} className="mt-2" />
                        </div>
                        <PrimaryButton disabled={tagProcessing}>
                            {editingTag ? 'Update' : 'Add'}
                        </PrimaryButton>
                        {editingTag && (
                            <SecondaryButton onClick={() => { setEditingTag(null); resetTag(); }}>
                                Cancel
                            </SecondaryButton>
                        )}
                    </form>

                    {/* Tag List */}
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
                                                onClick={() => openTagModal(tag)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTag(tag)}
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

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeTagModal}>Close</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
