import React from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '2', // Default User
        status: '0', // Default Inactive
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Add New User"
        >
            <Head title="Add User" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg max-w-2xl mx-auto">
                <div className="p-6 text-gray-900">
                    <form onSubmit={submit} className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                            />
                            {errors.username && <div className="text-red-600 mt-1 text-sm">{errors.username}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <div className="text-red-600 mt-1 text-sm">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && <div className="text-red-600 mt-1 text-sm">{errors.phone}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                            >
                                <option value="2">User</option>
                                <option value="1">Admin</option>
                                <option value="0">Super Admin</option>
                            </select>
                            {errors.role && <div className="text-red-600 mt-1 text-sm">{errors.role}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="0">Inactive</option>
                                <option value="1">Active</option>
                            </select>
                            {errors.status && <div className="text-red-600 mt-1 text-sm">{errors.status}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <div className="text-red-600 mt-1 text-sm">{errors.password}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <Link href={route('admin.users.index')} className="text-gray-600 hover:text-gray-900 text-sm">Cancel</Link>
                            <button
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                disabled={processing}
                            >
                                Create User
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
