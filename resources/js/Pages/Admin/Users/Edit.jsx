import React from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, user }) {
    const { data, setData, put, processing, errors } = useForm({
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.status,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={`Edit User: ${user.username}`}
        >
            <Head title="Edit User" />

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

                        <div className="border-t border-gray-100 pt-6 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                            <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change the password.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="new-password"
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
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 mt-6">
                            <Link href={route('admin.users.index')} className="text-gray-600 hover:text-gray-900 text-sm">Cancel</Link>
                            <button
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                disabled={processing}
                            >
                                Update User
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
