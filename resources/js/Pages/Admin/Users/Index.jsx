import React from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ auth, users, filters }) {
    const { url } = usePage();

    // Debounce search function could be added here, but simple form submit is fine for now
    const [search, setSearch] = React.useState(filters.search || '');
    const [expandedRows, setExpandedRows] = React.useState([]);

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search, role: filters.role, status: filters.status }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('admin.users.destroy', id), {
                onSuccess: () => {
                    // Toast or generic success handling is usually global or per page
                }
            });
        }
    };

    return (
        <AdminLayout
            user={auth.user}
            header="User Management"
        >
            <Head title="Users" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                            <input
                                type="text"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full p-2"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                                Search
                            </button>
                        </form>

                        <Link
                            href={route('admin.users.create')}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Add New User
                        </Link>
                    </div>

                    <div className="overflow-x-auto ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined Date
                                    </th>
                                    <th scope="col" className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <React.Fragment key={user.id}>
                                            <tr className={expandedRows.includes(user.id) ? 'bg-gray-50' : ''}>
                                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        {/* Expand Button (Visible on small screens) */}
                                                        <button
                                                            onClick={() => toggleRow(user.id)}
                                                            className="xl:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        >
                                                            {expandedRows.includes(user.id) ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                            )}
                                                        </button>

                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded-full object-cover" src={user.img_url || `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                                <div className="text-xs text-gray-400 sm:hidden">{user.phone || '-'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${user.role === '0' ? 'bg-purple-100 text-purple-800' :
                                                            user.role === '1' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                        {user.role === '0' ? 'Super Admin' : user.role === '1' ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={user.status}
                                                        onChange={(e) => {
                                                            if (confirm('Are you sure you want to change the status of this user?')) {
                                                                router.patch(route('admin.users.update-status', user.id), { status: e.target.value }, { preserveScroll: true });
                                                            } else {
                                                                e.target.value = user.status;
                                                            }
                                                        }}
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:ring-0
                                                        ${user.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                    >
                                                        <option value="1" className="bg-white text-gray-900">Active</option>
                                                        <option value="0" className="bg-white text-gray-900">Inactive</option>
                                                    </select>
                                                </td>
                                                <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link href={route('admin.users.edit', user.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                                    {user.id !== auth.user.id && (
                                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* Child Row for Hidden Columns */}
                                            {expandedRows.includes(user.id) && (
                                                <tr className="bg-gray-50 xl:hidden">
                                                    <td colSpan="5" className="px-4 py-4 sm:px-6">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {/* Actions (Hidden on SM) */}
                                                            <div className="sm:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                                <div className="flex gap-4">
                                                                    <Link href={route('admin.users.edit', user.id)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit User</Link>
                                                                    {user.id !== auth.user.id && (
                                                                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete User</button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Role (Hidden on MD) */}
                                                            <div className="md:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Role</span>
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                ${user.role === '0' ? 'bg-purple-100 text-purple-800' :
                                                                        user.role === '1' ? 'bg-blue-100 text-blue-800' :
                                                                            'bg-gray-100 text-gray-800'}`}>
                                                                    {user.role === '0' ? 'Super Admin' : user.role === '1' ? 'Admin' : 'User'}
                                                                </span>
                                                            </div>

                                                            {/* Status (Hidden on LG) */}
                                                            <div className="lg:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                                                                <select
                                                                    value={user.status}
                                                                    onChange={(e) => {
                                                                        if (confirm('Are you sure you want to change the status of this user?')) {
                                                                            router.patch(route('admin.users.update-status', user.id), { status: e.target.value }, { preserveScroll: true });
                                                                        } else {
                                                                            e.target.value = user.status;
                                                                        }
                                                                    }}
                                                                    className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:ring-0
                                                                    ${user.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                                >
                                                                    <option value="1" className="bg-white text-gray-900">Active</option>
                                                                    <option value="0" className="bg-white text-gray-900">Inactive</option>
                                                                </select>
                                                            </div>

                                                            {/* Joined Date (Hidden on XL) */}
                                                            <div className="xl:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Joined Date</span>
                                                                <span className="text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
                                                            </div>

                                                            {/* Extra info that might be nice to see on mobile */}
                                                            <div className="md:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Phone</span>
                                                                <span className="text-sm text-gray-900">{user.phone || '-'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="mt-4 flex flex-wrap gap-1 justify-center">
                            {users.links.map((link, key) => (
                                link.url ? (
                                    <Link
                                        key={key}
                                        href={link.url}
                                        className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={key}
                                        className="px-3 py-1 border rounded text-sm text-gray-400 bg-gray-50"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
