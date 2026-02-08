import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links, className = '' }) {
    if (!links || links.length <= 1) return null;

    return (
        <div className={`flex flex-wrap justify-center gap-1 ${className}`}>
            {links.map((link, key) => (
                link.url ? (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm border rounded-md transition-colors duration-200 ${link.active
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={key}
                        className="px-4 py-2 text-sm border rounded-md bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
