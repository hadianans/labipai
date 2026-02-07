import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';

export default function Edit({ auth, announcement }) {
    // Helper to format date for datetime-local
    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().slice(0, 16);
    };

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: announcement.title || '',
        content: announcement.content || '',
        image: null,
        action_url: announcement.action_url || '',
        priority: announcement.priority || '1',
        type: announcement.type || '1',
        status: announcement.status || '0',
        start_date: formatDateTime(announcement.start_date),
        end_date: formatDateTime(announcement.end_date),
    });

    const [imagePreview, setImagePreview] = useState(announcement.img_url ? `/storage/${announcement.img_url}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.announcements.update', announcement.id));
    };

    return (
        <AdminLayout user={auth.user} header="Edit Announcement">
            <Head title="Edit Announcement" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="title" value="Title" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full p-2"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="priority" value="Priority" />
                            <select
                                id="priority"
                                className="mt-1 block w-full p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                            >
                                <option value="0">Low</option>
                                <option value="1">Standard</option>
                                <option value="2">Important</option>
                            </select>
                            <InputError message={errors.priority} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="type" value="Display Type" />
                            <select
                                id="type"
                                className="mt-1 block w-full p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                <option value="0">Pop-up</option>
                                <option value="1">Section Banner</option>
                            </select>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="status" value="Status" />
                            <select
                                id="status"
                                className="mt-1 block w-full p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="0">Draft</option>
                                <option value="1">Published</option>
                            </select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="start_date" value="Start Date" />
                            <TextInput
                                id="start_date"
                                type="datetime-local"
                                className="mt-1 block w-full p-2"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                            />
                            <InputError message={errors.start_date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="end_date" value="End Date" />
                            <TextInput
                                id="end_date"
                                type="datetime-local"
                                className="mt-1 block w-full p-2"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                            />
                            <InputError message={errors.end_date} className="mt-2" />
                        </div>

                        <div className="md:col-span-2">
                            <InputLabel htmlFor="image" value="Image (Optional)" />
                            <input
                                type="file"
                                id="image"
                                className="mt-1 block w-full p-2"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            <InputError message={errors.image} className="mt-2" />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt="Preview" className="h-48 object-cover rounded" />
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <InputLabel htmlFor="action_url" value="Action URL (CTA Link)" />
                            <TextInput
                                id="action_url"
                                type="url"
                                className="mt-1 block w-full p-2"
                                value={data.action_url}
                                onChange={(e) => setData('action_url', e.target.value)}
                                placeholder="https://..."
                            />
                            <InputError message={errors.action_url} className="mt-2" />
                        </div>

                        <div className="md:col-span-2">
                            <InputLabel value="Content" />
                            <div className="mt-1">
                                <ReactQuill
                                    theme="snow"
                                    value={data.content}
                                    onChange={(value) => setData('content', value)}
                                    className="bg-white h-64 mb-12"
                                />
                            </div>
                            <InputError message={errors.content} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Link href={route('admin.announcements.index')} className="mr-4 inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                            Cancel
                        </Link>
                        <PrimaryButton disabled={processing}>
                            Update Announcement
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
