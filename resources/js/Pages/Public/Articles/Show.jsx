import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ article, relatedArticles }) {
    return (
        <PublicLayout>
            <Head title={article.title} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="flex mb-8 text-sm font-medium text-gray-500">
                    <Link href="/" className="hover:text-indigo-600">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href={route('public.articles.index')} className="hover:text-indigo-600">Articles</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate">{article.title}</span>
                </nav>

                <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    {/* Cover Image */}
                    {article.img_url && (
                        <div className="h-64 sm:h-96 w-full overflow-hidden">
                            <img
                                src={`/storage/${article.img_url}`}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8 sm:p-12">
                        {/* Meta */}
                        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-6">
                            {article.categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    href={route('public.articles.index', { category: cat.name })}
                                    className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full hover:bg-indigo-100 transition"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {new Date(article.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className='flex items-center'>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                {article.author}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                            {article.title}
                        </h1>

                        {/* Content */}
                        <div
                            className="prose prose-lg prose-indigo max-w-none prose-img:rounded-xl prose-a:text-indigo-600 hover:prose-a:text-indigo-500"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </div>
                </article>
            </div>

            {/* Related Articles */}
            {relatedArticles && relatedArticles.length > 0 && (
                <div className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedArticles.map((item) => (
                                <Link key={item.id} href={route('public.articles.show', item.slug)} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
                                    <div className="h-48 overflow-hidden bg-gray-200">
                                        {item.img_url ? (
                                            <img
                                                src={`/storage/${item.img_url}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{item.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
