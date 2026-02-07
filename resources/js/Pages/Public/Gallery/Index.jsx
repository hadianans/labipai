import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ gallery, tags }) {
    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const currentTag = queryParams.get('tag');
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <PublicLayout>
            <Head title="Gallery" />

            {/* Hero Section */}
            <div className="bg-indigo-900 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Our Gallery
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-200">
                        Capturing moments from our events, programs, and daily life at Baitulhikmah.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filter Tags */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    <Link
                        href={route('public.gallery.index')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${!currentTag ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                    >
                        All Photos
                    </Link>
                    {tags.map(tag => (
                        <Link
                            key={tag.id}
                            href={route('public.gallery.index', { tag: tag.name })}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${currentTag === tag.name ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {gallery.data.map((item) => (
                        <div
                            key={item.id}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-xl transition-all duration-300"
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="aspect-w-4 aspect-h-3"> {/* Use standard aspect ratio or just img */}
                                <img
                                    src={`/storage/${item.img_url}`}
                                    alt={item.alt_text || item.title}
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                                {item.description && <p className="text-gray-200 text-sm mt-1">{item.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                {gallery.data.length === 0 && (
                    <div className="text-center py-24 text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        No images found in this category.
                    </div>
                )}
                {/* Pagination */}
                <div className="mt-12">
                    {gallery.links && (
                        <div className="flex justify-center space-x-2">
                            {gallery.links.map((link, key) => (
                                link.url ? (
                                    <Link
                                        key={key}
                                        href={link.url}
                                        className={`px-4 py-2 border rounded-md transition ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={key}
                                        className="px-4 py-2 border rounded-md bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            <Modal show={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="5xl">
                {selectedImage && (
                    <div className="relative bg-black rounded-lg overflow-hidden">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2 backdrop-blur-sm"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <img
                            src={`/storage/${selectedImage.img_url}`}
                            alt={selectedImage.title}
                            className="w-full max-h-[85vh] object-contain mx-auto"
                        />
                        <div className="p-6 bg-white">
                            <h3 className="text-xl font-bold text-gray-900">{selectedImage.title}</h3>
                            {selectedImage.description && <p className="text-gray-600 mt-2">{selectedImage.description}</p>}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {selectedImage.tags.map(tag => (
                                    <span key={tag.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{tag.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </PublicLayout>
    );
}
