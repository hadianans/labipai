import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth }) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        subject: '',
        message: '',
        is_anonymous: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('feedback.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Feedback</h2>}
        >
            <Head title="Feedback" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg max-w-2xl mx-auto">
                        <div className="p-6 text-gray-900">
                            <header className="mb-6">
                                <h2 className="text-lg font-medium text-gray-900">Submit Feedback</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    We value your feedback. Let us know how we can improve your library experience.
                                </p>
                            </header>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                    <input
                                        id="subject"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        required
                                        placeholder="e.g. Request for a new book"
                                    />
                                    {errors.subject && <div className="text-red-600 mt-1 text-sm">{errors.subject}</div>}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea
                                        id="message"
                                        rows="5"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm p-2"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                        placeholder="Your detailed feedback..."
                                    ></textarea>
                                    {errors.message && <div className="text-red-600 mt-1 text-sm">{errors.message}</div>}
                                </div>

                                <div className="block">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_anonymous"
                                            checked={data.is_anonymous}
                                            onChange={(e) => setData('is_anonymous', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Submit anonymously</span>
                                    </label>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        disabled={processing}
                                    >
                                        Submit Feedback
                                    </button>

                                    {recentlySuccessful && (
                                        <p className="text-sm text-green-600 fade-in">Thank you for your feedback!</p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
