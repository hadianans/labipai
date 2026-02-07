import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState, useRef, useMemo } from 'react';
import axios from 'axios';
import BlotFormatter from 'quill-blot-formatter';
import './Create.css';

const Quill = ReactQuill.Quill;
// Register BlotFormatter
Quill.register('modules/blotFormatter', BlotFormatter);

export default function Edit({ auth, article, categories }) {
    const quillRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(article.img_url ? `/storage/${article.img_url}` : null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: article.title,
        excerpt: article.excerpt || '',
        content: article.content || '',
        status: article.status,
        image: null,
        categories: article.categories.map(c => c.id),
    });

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('image', file);

            try {
                // Ensure correct route
                const res = await axios.post(route('admin.articles.uploadImage'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const url = res.data.url;
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                const index = (range && range.index) ? range.index : quill.getLength();
                quill.insertEmbed(index, 'image', url);
            } catch (error) {
                console.error('Image upload failed', error);
                alert('Image upload failed');
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
        blotFormatter: {}
    }), []);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.articles.update', article.id));
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Edit Article"
        >
            <Head title={`Edit: ${article.title}`} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            {/* Main Content Area */}
                            <div>
                                <InputLabel htmlFor="title" value="Title" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    className="mt-1 block w-full text-lg font-bold p-2"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="content" value="Content" />
                                <div className="mt-1 h-96 pb-12">
                                    <ReactQuill
                                        ref={quillRef}
                                        theme="snow"
                                        value={data.content}
                                        onChange={(value) => setData('content', value)}
                                        modules={modules}
                                        className="h-full"
                                    />
                                </div>
                                <InputError message={errors.content} className="mt-2" />
                            </div>

                            <div className="mt-8">
                                <InputLabel htmlFor="excerpt" value="Excerpt" />
                                <textarea
                                    id="excerpt"
                                    className="mt-1 block w-full p-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows="3"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                ></textarea>
                                <InputError message={errors.excerpt} className="mt-2" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Sidebar Options */}
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-700 mb-4">Publishing</h3>
                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="0">Draft</option>
                                        <option value="1">Published</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-700 mb-4">Categories</h3>
                                <div className="h-40 overflow-y-auto border rounded p-2 bg-white">
                                    {categories.map((category) => (
                                        <div key={category.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`category-${category.id}`}
                                                value={category.id}
                                                checked={data.categories.includes(category.id)}
                                                onChange={(e) => {
                                                    const id = parseInt(e.target.value);
                                                    if (e.target.checked) {
                                                        setData('categories', [...data.categories, id]);
                                                    } else {
                                                        setData('categories', data.categories.filter(c => c !== id));
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                                                {category.name}
                                            </label>
                                        </div>
                                    ))}
                                    {categories.length === 0 && <p className="text-gray-500 text-sm">No categories found.</p>}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="font-semibold text-gray-700 mb-4">Cover Image</h3>
                                <input
                                    type="file"
                                    onChange={handleCoverImageChange}
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                <InputError message={errors.image} className="mt-2" />
                                {imagePreview && (
                                    <div className="mt-4">
                                        <img src={imagePreview} alt="Cover Preview" className="w-full h-auto rounded shadow" />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <PrimaryButton disabled={processing} className="w-full justify-center py-3">
                                    Update Article
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
