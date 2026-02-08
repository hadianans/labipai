import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';

export default function Index({ articles, categories }) {
    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const currentCategory = queryParams.get('category');
    const search = queryParams.get('search');

    return (
        <PublicLayout>
            <Head title="Articles" />

            {/* Hero Section */}
            <div className="bg-indigo-900 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Articles & Insights
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-200">
                        Stay updated with our latest news, educational resources, and announcements.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar (Categories & Search) */}
                    <div className="lg:w-1/4 space-y-8">
                        {/* Search */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Search</h3>
                            <form action={route('public.articles.index')} method="GET">
                                <div className="flex">
                                    <input
                                        type="text"
                                        name="search"
                                        defaultValue={search}
                                        placeholder="Search articles..."
                                        className="w-full rounded-l-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </button>
                                </div>
                                {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
                            </form>
                        </div>

                        {/* Categories */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href={route('public.articles.index')}
                                        className={`block px-3 py-2 rounded-md transition ${!currentCategory ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        All Categories
                                    </Link>
                                </li>
                                {categories.map(category => (
                                    <li key={category.id}>
                                        <Link
                                            href={route('public.articles.index', { category: category.name })}
                                            className={`block px-3 py-2 rounded-md transition ${currentCategory === category.name ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Article Grid */}
                    <div className="lg:w-3/4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {articles.data.map((article) => (
                                <Link key={article.id} href={route('public.articles.show', article.slug)} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                                    <div className="relative h-48 overflow-hidden">
                                        {article.img_url ? (
                                            <img
                                                src={`/storage/${article.img_url}`}
                                                alt={article.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            {article.categories.map(cat => (
                                                <span key={cat.id} className="inline-block bg-white/90 backdrop-blur-sm text-indigo-800 text-xs font-bold px-2 py-1 rounded-full mr-2 shadow-sm">
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="text-sm text-gray-500 mb-2 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {new Date(article.created_at).toLocaleDateString()}
                                            <span className="mx-2">•</span>
                                            <span className='flex items-center'>
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                {article.author}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-3">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                                            {article.excerpt}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-100 text-indigo-600 font-medium group-hover:translate-x-1 transition-transform flex items-center">
                                            Read Article
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12">
                            <Pagination links={articles.links} />
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
