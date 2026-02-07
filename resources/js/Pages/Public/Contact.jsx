import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Contact({ contacts }) {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // WhatsApp Redirect
        const phoneNumber = contacts['whatsapp'].replace('0', '62') || '628123456789'; // Fallback
        const text = `Name: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0AMessage: ${formData.message}`;
        window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    };

    return (
        <PublicLayout>
            <Head title="Contact Us - Baitulhikmah" />

            <div className="bg-primary-900 py-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
                <div className="relative z-10 px-4">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Contact Us</h1>
                    <p className="text-xl text-primary-200 bg-primary-800/50 inline-block px-6 py-2 rounded-full backdrop-blur-sm">We'd love to hear from you</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">Get in Touch</h2>
                        <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                            Have questions about our library, programs, or membership? Reach out to us using the contact details below or send us a message directly.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3 text-primary-600 mt-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-lg font-bold text-gray-900">Our Location</h3>
                                    <p className="text-gray-600 mt-1">{contacts['address'] || 'Jalan Setiabudi No. 229, Bandung, Jawa Barat'}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3 text-primary-600 mt-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-lg font-bold text-gray-900">Email Us</h3>
                                    <p className="text-gray-600 mt-1 break-all">{contacts['email'] || 'info@baitulhikmah.com'}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3 text-primary-600 mt-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-lg font-bold text-gray-900">Call / WhatsApp</h3>
                                    <p className="text-gray-600 mt-1">{contacts['phone'] || (contacts['whatsapp'] ? `${contacts['whatsapp']}` : '+62 812 3456 7890')}</p>
                                    <a href={`https://wa.me/${contacts['whatsapp'].replace('0', '62')}`} target="_blank" className="text-secondary-600 hover:text-secondary-700 text-sm font-semibold mt-2 inline-block">Call Us &rarr;</a>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    {/* {contacts['whatsapp'] && (
                                        <a href={`https://wa.me/${contacts['whatsapp'].replace('0', '62')}`} target="_blank" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.82 11.82 0 0 0 12.01 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A11.93 11.93 0 0 0 12.01 24C18.65 24 24 18.64 24 12c0-3.2-1.25-6.21-3.49-8.52zM12.01 22a9.94 9.94 0 0 1-5.07-1.38l-.36-.21-3.67.96.98-3.57-.23-.37A9.94 9.94 0 1 1 22 12c0 5.52-4.47 10-9.99 10zm5.45-7.44c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" /></svg>
                                        </a>
                                    )} */}
                                    {contacts['instagram'] && (
                                        <a href={`https://instagram.com/${contacts['instagram'].replace('@', '')}`} target="_blank" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                        </a>
                                    )}
                                    {contacts['youtube'] && (
                                        <a href={`https://youtube.com/${contacts['youtube']}`} target="_blank" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all transform hover:scale-110">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                        </a>
                                    )}
                                    {contacts['twitter'] && (
                                        <a href={`https://twitter.com/${contacts['twitter'].replace('@', '')}`} target="_blank" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-all transform hover:scale-110">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    // placeholder="Hadiana Nasrullah"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    placeholder="(opsional)"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    // placeholder="e.g., Membership Inquiry"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    placeholder="How can we help you?"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-secondary-600 text-white font-bold rounded-lg hover:bg-secondary-700 transition transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                Send via WhatsApp
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
