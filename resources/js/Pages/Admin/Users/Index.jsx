import React from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/Components/Pagination';

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
                router.delete(route('admin.users.destroy', id), {
                    onSuccess: () => {
                        Swal.fire(
                            'Deleted!',
                            'User has been deleted.',
                            'success'
                        )
                    }
                });
            }
        })
    };

    const handleApprove = (id) => {
        Swal.fire({
            title: 'Approve User?',
            text: "This user will be granted active status.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981', // green-500
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Approve!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('admin.users.approve', id), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            'Approved!',
                            'User has been approved successfully.',
                            'success'
                        )
                    }
                });
            }
        });
    }

    const handleStatusChange = (id, newStatus) => {
        Swal.fire({
            title: 'Change Status?',
            text: `Are you sure you want to change this user's status to ${newStatus === '1' ? 'Active' : 'Inactive'}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(route('admin.users.update-status', id), { status: newStatus }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            'Updated!',
                            'User status has been updated.',
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
            header="User Management"
        >
            <Head title="Users" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg xl:mx-8">
                <div className="p-4 sm:p-6 text-gray-900">

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

                    {/* Tabs for Status Filtering */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {/* <Link
                                href={route('admin.users.index')}
                                className={`${!filters.status ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                All Users
                            </Link> */}
                            <Link
                                href={route('admin.users.index', { status: '1' })}
                                className={`${filters.status === '1' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Active Users
                            </Link>
                            <Link
                                href={route('admin.users.index', { status: 'unapproved' })}
                                className={`${filters.status === 'unapproved' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Unapproved Users
                            </Link>
                            <Link
                                href={route('admin.users.index', { status: '0' })}
                                className={`${filters.status === '0' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Inactive Users
                            </Link>
                        </nav>
                    </div>

                    <div className="overflow-x-auto rounded-md">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="p-2 sm:px-4 sm:py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="hidden lg:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th scope="col" className="hidden md:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="hidden lg:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="hidden xl:table-cell px-4 py-2 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Joined Date
                                    </th>
                                    <th scope="col" className="table-cell p-2 sm:px-4 sm:py-2 text-right text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <React.Fragment key={user.id}>
                                            <tr className={expandedRows.includes(user.id) ? 'bg-gray-50' : ''}>
                                                <td className="p-2 sm:px-4 sm:py-2 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        {/* Expand Button (Visible on small screens) */}
                                                        <button
                                                            onClick={() => toggleRow(user.id)}
                                                            className="xl:hidden flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        >
                                                            {expandedRows.includes(user.id) ? (
                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                            ) : (
                                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                            )}
                                                        </button>

                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                                                                <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover" src={user.img_url || `https://ui-avatars.com/api/?name=${user.username}&background=random`} alt="" />
                                                            </div>
                                                            <div className="ml-2 sm:ml-4">
                                                                <div className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 truncate max-w-[clamp(100px,35vw,200px)] sm:max-w-xs" title={user.username}>{user.username}</div>
                                                                <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[clamp(100px,35vw,200px)] sm:max-w-xs" title={user.email}>{user.email}</div>
                                                                <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[clamp(100px,35vw,200px)] sm:max-w-xs" title={user.id}>{user.id}</div>
                                                                {/* <div className="text-xs text-gray-400">{user.phone || '-'}</div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden lg:table-cell px-4 py-2 whitespace-nowrap">
                                                    <div className="text-xs sm:text-sm font-medium text-blue-900 truncate max-w-[clamp(100px,35vw,200px)] sm:max-w-xs" title={user.phone}><a href={`https://wa.me/${user.phone}`} target="_blank" rel="noopener noreferrer">{user.phone}</a></div>
                                                </td>
                                                <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${user.role === '0' ? 'bg-purple-100 text-purple-800' :
                                                            user.role === '1' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                        {user.role === '0' ? 'Super Admin' : user.role === '1' ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="hidden lg:table-cell px-4 py-2 whitespace-nowrap">
                                                    {filters.status === 'unapproved' ? (
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            Pending Review
                                                        </span>
                                                    ) : (
                                                        <select
                                                            value={user.status}
                                                            onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                                            className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:ring-0
                                                        ${user.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                        >
                                                            <option value="1" className="bg-white text-gray-900">Active</option>
                                                            <option value="0" className="bg-white text-gray-900">Inactive</option>
                                                        </select>
                                                    )}
                                                </td>
                                                <td className="hidden xl:table-cell px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="table-cell flex p-2 sm:px-4 sm:py-2 whitespace-nowrap text-right text-sm font-medium">
                                                    {filters.status === 'unapproved' ? (
                                                        <div className="flex gap-2 justify-end items-center">
                                                            <button
                                                                onClick={() => handleApprove(user.id)}
                                                                className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded-full hover:bg-green-100 transition"
                                                                title="Approve User"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(user.id)}
                                                                className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-full hover:bg-red-100 transition"
                                                                title="Reject/Delete User"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Link href={route('admin.users.edit', user.id)} className="text-indigo-600 hover:text-indigo-900 mr-1 sm:mr-4">Edit</Link>
                                                            <div className="hidden sm:inline-block">
                                                                {user.id !== auth.user.id && (
                                                                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* Child Row for Hidden Columns */}
                                            {expandedRows.includes(user.id) && (
                                                <tr className="bg-gray-50 xl:hidden">
                                                    <td colSpan="5" className="px-3 py-3 sm:px-6 sm:py-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {/* Actions (Hidden on SM) */}
                                                            {user.id !== auth.user.id && (
                                                                <div className="sm:hidden">
                                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Actions</span>
                                                                    <div className="flex gap-4">
                                                                        {filters.status === 'unapproved' ? (
                                                                            <div className="flex gap-4">
                                                                                <button
                                                                                    onClick={() => handleApprove(user.id)}
                                                                                    className="text-green-600 hover:text-green-900 font-medium text-sm flex items-center"
                                                                                >
                                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                                                    Approve
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDelete(user.id)}
                                                                                    className="text-red-600 hover:text-red-900 font-medium text-sm flex items-center"
                                                                                >
                                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                                    Reject
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button>
                                                                        )}
                                                                        {/* <Link href={route('admin.users.edit', user.id)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit</Link> */}
                                                                        {/* {user.id !== auth.user.id && ( */}
                                                                        {/* <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 font-medium text-sm">Delete</button> */}
                                                                        {/* )} */}
                                                                    </div>
                                                                </div>
                                                            )}

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
                                                                {filters.status === 'unapproved' ? (
                                                                    <span className="text-sm font-medium text-yellow-600">Pending Review</span>
                                                                ) : (
                                                                    <select
                                                                        value={user.status}
                                                                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                                                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer focus:ring-0
                                                                    ${user.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                                    >
                                                                        <option value="1" className="bg-white text-gray-900">Active</option>
                                                                        <option value="0" className="bg-white text-gray-900">Inactive</option>
                                                                    </select>
                                                                )}
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

                                                            <div className="md:hidden">
                                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Phone</span>
                                                                <span className="text-sm text-blue-900"><a href={`https://wa.me/${user.phone}`} target="_blank" rel="noopener noreferrer">{user.phone || '-'}</a></span>
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
                    <div className="mt-4">
                        <Pagination links={users.links} />
                    </div>
                </div>
            </div>
        </AdminLayout >
    );
}
