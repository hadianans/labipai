import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
// Assuming there is a generic Modal component, otherwise I might need to build one or use a library. 
// If Modal doesn't exist, I'll rely on a simple fixed overlay or create one.
// Checking imports in other files might confirm Modal existence. 
// Helper component for Modal
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, administrators, filters = {} }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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

    // ... useForm hook remains same ...
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        id: '',
        name: '',
        email: '',
        position: '',
        year: new Date().getFullYear(),
        phone: '',
        description: '',
        is_active: true,
        is_chief: false,
        image: null,
        _method: 'POST',
    });

    // Search & Tab Logic
    const handleSearch = (query) => {
        setSearch(query);
        router.get(
            route('admin.administrators.index'),
            { search: query, tab: activeTab },
            { preserveState: true, replace: true }
        );
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(
            route('admin.administrators.index'),
            { search, tab: tab },
            { preserveState: true, replace: true }
        );
    };

    const openModal = (admin = null) => {
        // ... implementation remains ...
        if (admin) {
            setIsEditing(true);
            setData({
                id: admin.id,
                name: admin.name,
                email: admin.email,
                position: admin.position || '',
                year: admin.year,
                phone: admin.phone || '',
                description: admin.description || '',
                is_active: Boolean(admin.is_active),
                is_chief: Boolean(admin.is_chief),
                image: null,
                _method: 'PUT',
            });
        } else {
            setIsEditing(false);
            reset();
            setData({
                id: '',
                name: '',
                email: '',
                position: '',
                year: new Date().getFullYear(),
                phone: '',
                description: '',
                is_active: true,
                is_chief: false,
                image: null,
                _method: 'POST',
            })
        }
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        // ... implementation remains ...
        e.preventDefault();
        const routeName = isEditing ? 'admin.administrators.update' : 'admin.administrators.store';
        const routeParams = isEditing ? data.id : {};

        post(route(routeName, routeParams), {
            forceFormData: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                Swal.fire({
                    icon: 'success',
                    title: isEditing ? 'Updated!' : 'Created!',
                    text: `Administrator has been ${isEditing ? 'updated' : 'created'} successfully.`,
                });
            },
        });
    };

    const deleteAdmin = (id) => {
        // ... implementation remains ...
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
                router.delete(route('admin.administrators.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            'Deleted!',
                            'Administrator has been deleted.',
                            'success'
                        )
                    }
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Administrators"
        >
            <Head title="Administrators" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg xl:mx-8">
                <div className="p-6 text-gray-900">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        {/* Tabs */}
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleTabChange('active')}
                                className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${activeTab === 'active'
                                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Active Members
                            </button>
                            <button
                                onClick={() => handleTabChange('inactive')}
                                className={`px-4 py-2 rounded-t-lg font-medium border-b-2 ${activeTab === 'inactive'
                                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Inactive Members
                            </button>
                        </div>

                        {/* Search & Add */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <TextInput
                                type="text"
                                placeholder="Search administrator..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full md:w-64 p-2"
                            />
                            <PrimaryButton onClick={() => openModal()}>
                                Add New Administrator
                            </PrimaryButton>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="p-2 sm:px-4 sm:py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Info</th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                    <th scope="col" className="hidden lg:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th scope="col" className="hidden sm:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="hidden sm:table-cell px-4 py-2 text-right text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {administrators.map((admin) => (
                                    <React.Fragment key={admin.id}>
                                        <tr className={expandedRows.includes(admin.id) ? 'bg-gray-50' : ''}>
                                            <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <button
                                                        onClick={() => toggleRow(admin.id)}
                                                        className="lg:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    >
                                                        {expandedRows.includes(admin.id) ? (
                                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                        ) : (
                                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                        )}
                                                    </button>
                                                    <div className="flex items-center">
                                                        {admin.img_url ? (
                                                            <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover mr-2 sm:mr-3" src={`/storage/${admin.img_url}`} alt="" />
                                                        ) : (
                                                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center mr-2 sm:mr-3 text-gray-500">
                                                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[clamp(100px,45vw,360px)] sm:max-w-[clamp(150px,20vw,300px)]">{admin.name}</div>
                                                            <div className="text-[10px] sm:text-xs text-gray-500">{admin.year}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-500 truncate max-w-[clamp(100px,45vw,360px)] sm:max-w-[clamp(150px,20vw,300px)]">
                                                {admin.position || '-'}
                                            </td>
                                            <td className="hidden lg:table-cell px-4 py-2 whitespace-nowrap">
                                                <div className="text-xs sm:text-sm text-gray-900">{admin.email}</div>
                                                <div className="text-[10px] sm:text-xs text-gray-500">{admin.phone}</div>
                                            </td>
                                            <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap">
                                                <div className="flex flex-col space-y-1">
                                                    <span className={`px-2 inline-flex text-[10px] sm:text-xs leading-5 font-semibold rounded-full w-fit ${admin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {admin.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                    {admin.is_chief ? (
                                                        <span className="px-2 inline-flex text-[10px] sm:text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 w-fit">
                                                            Chief
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-[10px] sm:text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 w-fit">
                                                            Staff
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                                <button onClick={() => openModal(admin)} className="text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-4">Edit</button>
                                                <button onClick={() => deleteAdmin(admin.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                        {expandedRows.includes(admin.id) && (
                                            <tr className="bg-gray-50 lg:hidden">
                                                <td colSpan="5" className="px-3 py-3 sm:px-6 sm:py-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="sm:hidden">
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                            <div className="flex gap-4">
                                                                <button onClick={() => openModal(admin)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit</button>
                                                                <button onClick={() => deleteAdmin(admin.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                                            </div>
                                                        </div>
                                                        <div className="sm:hidden">
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                                            <div className="flex flex-col space-y-1">
                                                                <span className={`px-2 inline-flex text-[10px] text-xs leading-5 font-semibold rounded-full w-fit ${admin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {admin.is_active ? 'Active' : 'Inactive'}
                                                                </span>
                                                                {admin.is_chief ? (
                                                                    <span className="px-2 inline-flex text-[10px] text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 w-fit">
                                                                        Chief
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 inline-flex text-[10px] text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 w-fit">
                                                                        Staff
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="md:hidden">
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Position</span>
                                                            <span className="text-sm text-gray-900">{admin.position || '-'}</span>
                                                        </div>
                                                        <div className="lg:hidden">
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Contact</span>
                                                            <div className="text-sm text-gray-900">{admin.email}</div>
                                                            <div className="text-sm text-gray-500">{admin.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                                {administrators.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No administrators found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {isEditing ? 'Edit Administrator' : 'Create Administrator'}
                    </h2>
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <InputLabel htmlFor="image" value="Profile Photo" />
                            <input
                                id="image"
                                type="file"
                                className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                                onChange={(e) => setData('image', e.target.files[0])}
                                accept="image/*"
                            />
                            <InputError message={errors.image} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div>
                                <InputLabel htmlFor="position" value="Position" />
                                <TextInput
                                    id="position"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full p-2"
                                    required
                                />
                                <InputError message={errors.position} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    type="email"
                                    className="mt-1 block w-full p-2"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="year" value="Year" />
                                <TextInput
                                    id="year"
                                    value={data.year}
                                    onChange={(e) => setData('year', e.target.value)}
                                    type="number"
                                    className="mt-1 block w-full p-2"
                                    required
                                />
                                <InputError message={errors.year} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="phone" value="Phone" />
                                <TextInput
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full p-2"
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>
                        </div>

                        <div className="mt-4 flex gap-6">
                            <div className="flex items-center">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="is_chief"
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    checked={data.is_chief}
                                    onChange={(e) => setData('is_chief', e.target.checked)}
                                />
                                <label htmlFor="is_chief" className="ml-2 block text-sm text-gray-900">Pimpinan</label>
                            </div>
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="description" value="Description" />
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="mt-1 block w-full p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                rows="3"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={() => setIsModalOpen(false)} className="mr-3">Cancel</SecondaryButton>
                            <PrimaryButton disabled={processing}>{isEditing ? 'Update' : 'Create'}</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
