import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <div className="flex flex-wrap -mb-1">
            {links.map((link, key) => (
                <div key={key} className="mr-1 mb-1">
                    {link.url === null ? (
                        <div
                            className="px-4 py-2 text-sm border rounded text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            className={`px-4 py-2 text-sm border rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                link.active
                                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700'
                            }`}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
