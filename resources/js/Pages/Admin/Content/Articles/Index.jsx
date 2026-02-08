import React from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { debounce } from 'lodash';

export default function Index({ auth, articles, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const handleSearch = debounce((query) => {
        router.get(
            route('admin.articles.index'),
            { search: query },
            { preserveState: true, replace: true }
        );
    }, 300);

    // Article Delete Logic
    const handleDelete = (article) => {
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
                router.delete(route('admin.articles.destroy', article.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Article has been deleted.', 'success'),
                });
            }
        });
    };

    // Category Management Logic
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data: catData, setData: setCatData, post: postCat, put: putCat, delete: destroyCat, processing: catProcessing, errors: catErrors, reset: resetCat, clearErrors: clearCatErrors } = useForm({
        name: '',
    });

    const openCategoryModal = (category = null) => {
        clearCatErrors();
        if (category) {
            setEditingCategory(category);
            setCatData('name', category.name);
        } else {
            setEditingCategory(null);
            resetCat();
        }
        setIsCategoryModalOpen(true);
    };

    const closeCategoryModal = () => {
        setIsCategoryModalOpen(false);
        resetCat();
    };

    const submitCategory = (e) => {
        e.preventDefault();
        if (editingCategory) {
            putCat(route('admin.categories.update', editingCategory.id), {
                onSuccess: () => {
                    closeCategoryModal();
                    Swal.fire('Updated!', 'Category has been updated.', 'success');
                },
            });
        } else {
            postCat(route('admin.categories.store'), {
                onSuccess: () => {
                    closeCategoryModal();
                    Swal.fire('Created!', 'Category has been created.', 'success');
                },
            });
        }
    };

    const handleDeleteCategory = (category) => {
        Swal.fire({
            title: 'Delete Category?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                destroyCat(route('admin.categories.destroy', category.id), {
                    onSuccess: () => Swal.fire('Deleted!', 'Category has been deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Articles"
        >
            <Head title="Articles" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 xl:mx-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-lg font-medium text-gray-900">All Articles</h3>

                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <TextInput
                            type="text"
                            placeholder="Search articles..."
                            defaultValue={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full md:w-64 p-2"
                        />
                        <div className="flex space-x-3 justify-center">
                            <SecondaryButton onClick={() => openCategoryModal()}>
                                Manage Categories
                            </SecondaryButton>
                            <Link
                                href={route('admin.articles.create')}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 whitespace-nowrap"
                            >
                                Create New Article
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {articles.map((article) => (
                                <React.Fragment key={article.id}>
                                    <tr className={expandedRows.includes(article.id) ? 'bg-gray-50' : ''}>
                                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <button
                                                    onClick={() => toggleRow(article.id)}
                                                    className="lg:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    {expandedRows.includes(article.id) ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                    )}
                                                </button>
                                                <div className="flex items-center">
                                                    {article.img_url ? (
                                                        <img className="hidden sm:flex h-10 w-10 rounded object-cover mr-3" src={`/storage/${article.img_url}`} alt="" />
                                                    ) : (
                                                        <div className="hidden sm:flex h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3 text-gray-400">
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                                        </div>
                                                    )}
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[clamp(160px,60vw,400px)] sm:max-w-[clamp(160px,40vw,400px)]">{article.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.author}</td>
                                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === '1' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {article.status === '1' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {article.categories.map(cat => cat.name).join(', ')}
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={route('admin.articles.edit', article.id)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(article)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRows.includes(article.id) && (
                                        <tr className="bg-gray-50 lg:hidden">
                                            <td colSpan="5" className="px-6 py-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="sm:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                        <div className="flex gap-4">
                                                            <Link
                                                                href={route('admin.articles.edit', article.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                                                            >
                                                                Edit Article
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(article)}
                                                                className="text-red-600 hover:text-red-900 font-medium text-sm"
                                                            >
                                                                Delete Article
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="sm:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Author</span>
                                                        <span className="text-sm text-gray-900">{article.author}</span>
                                                    </div>
                                                    <div className="md:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === '1' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {article.status === '1' ? 'Published' : 'Draft'}
                                                        </span>
                                                    </div>
                                                    <div className="lg:hidden">
                                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Categories</span>
                                                        <span className="text-sm text-gray-900">{article.categories.map(cat => cat.name).join(', ')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {articles.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No articles found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Manager Modal */}
            <Modal show={isCategoryModalOpen} onClose={closeCategoryModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Categories</h2>

                    {/* Create/Edit Form */}
                    <form onSubmit={submitCategory} className="mb-6 flex gap-2">
                        <div className="flex-1">
                            <InputLabel htmlFor="cat_name" value={editingCategory ? "Edit Category Name" : "New Category Name"} className="sr-only" />
                            <TextInput
                                id="cat_name"
                                type="text"
                                className="block w-full p-2"
                                placeholder="Category Name"
                                value={catData.name}
                                onChange={(e) => setCatData('name', e.target.value)}
                                required
                            />
                            <InputError message={catErrors.name} className="mt-2" />
                        </div>
                        <PrimaryButton disabled={catProcessing}>
                            {editingCategory ? 'Update' : 'Add'}
                        </PrimaryButton>
                        {editingCategory && (
                            <SecondaryButton onClick={() => { setEditingCategory(null); resetCat(); }}>
                                Cancel
                            </SecondaryButton>
                        )}
                    </form>

                    {/* Category List */}
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
                                                onClick={() => openCategoryModal(category)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category)}
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

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeCategoryModal}>Close</SecondaryButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
