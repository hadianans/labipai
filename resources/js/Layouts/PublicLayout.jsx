import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function PublicLayout({ children }) {
    const { auth, flash, contacts } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: flash.success,
                timer: 3000,
                showConfirmButton: false
            });
        }
        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error,
            });
        }
        if (flash?.message) {
            Swal.fire({
                icon: 'info',
                title: 'Info',
                text: flash.message,
            });
        }
    }, [flash]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div className="flex flex-col min-h-screen bg-neutral-bg">
            {/* Navigation */}
            <nav className="fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <img src="/logo-ipai.png" alt="Baitulhikmah" className="h-12 w-auto" />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:ml-4 md:flex md:space-x-4 lg:space-x-8">
                            <NavLink href="/" active={route().current('home')}>Home</NavLink>
                            <NavLink href="/about" active={route().current('about')}>About</NavLink>
                            <NavLink href="/books" active={route().current('books.index')}>Books</NavLink>
                            <NavLink href="/courses" active={route().current('courses.index')}>Courses</NavLink>
                            <NavLink href="/articles" active={route().current('articles.index')}>Articles</NavLink>
                            <NavLink href="/gallery" active={route().current('gallery.index')}>Gallery</NavLink>
                            <NavLink href="/contact" active={route().current('contact')}>Contact</NavLink>
                        </div>

                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {auth.user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                                    >
                                        <img
                                            src={auth.user.img_url || `https://ui-avatars.com/api/?name=${auth.user.username}&background=random`}
                                            alt={auth.user.username}
                                            className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                        />
                                        {/* <span>{auth.user.username}</span> */}
                                        <svg className={`h-4 w-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {userDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            {['0', '1'].includes(auth.user.role) ? (
                                                /* Admin Menu */
                                                <>
                                                    <Link href={route('admin.dashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                </>
                                            ) : (
                                                /* User Menu */
                                                <>
                                                    <Link href={route('dashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                                                    <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                                                    <Link href={route('my-books.index')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Books</Link>
                                                    <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Courses</Link>
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                </>
                                            )}

                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Log Out
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/login" className="bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all transform hover:scale-105">
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-primary-700 hover:text-primary-900 focus:outline-none">
                                <span className="sr-only">Open main menu</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <MobileNavLink href="/" active={route().current('home')}>Home</MobileNavLink>
                            <MobileNavLink href="/about" active={route().current('about')}>About</MobileNavLink>
                            <MobileNavLink href="/books" active={route().current('books.index')}>Books</MobileNavLink>
                            <MobileNavLink href="/courses" active={route().current('courses.index')}>Courses</MobileNavLink>
                            <MobileNavLink href="/articles" active={route().current('articles.index')}>Articles</MobileNavLink>
                            <MobileNavLink href="/gallery" active={route().current('gallery.index')}>Gallery</MobileNavLink>
                            <MobileNavLink href="/contact" active={route().current('contact')}>Contact</MobileNavLink>
                            <div className="pt-4 pb-2 border-t border-gray-100 mt-2">
                                {auth.user ? (
                                    <>
                                        <div className="flex items-center px-3 mb-3">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={auth.user.img_url || `https://ui-avatars.com/api/?name=${auth.user.username}&background=random`}
                                                    alt={auth.user.username}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-base font-medium leading-none text-gray-800">{auth.user.username}</div>
                                                <div className="text-sm font-medium leading-none text-gray-500">{auth.user.email}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {['0', '1'].includes(auth.user.role) ? (
                                                /* Admin Menu */
                                                <>
                                                    <Link href={route('admin.dashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                                                    <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-900 hover:bg-gray-50 rounded-md">Log Out</Link>
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                </>
                                            ) : (
                                                <><Link href={route('dashboard')} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">Dashboard</Link><Link href={route('profile.edit')} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">Profile</Link><Link href={route('my-books.index')} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">My Books</Link><Link href={route('logout')} method="post" as="button" className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-900 hover:bg-gray-50 rounded-md">Log Out</Link></>
                                            )}
                                        </div>

                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="block px-3 py-2 text-base font-medium text-primary-700 hover:text-primary-900 hover:bg-gray-50 rounded-md">
                                            Sign In
                                        </Link>
                                        <Link href="/register" className="block px-3 py-2 text-base font-medium text-accent-600 hover:text-accent-700 hover:bg-gray-50 rounded-md">
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Content */}
            <main className="flex-grow pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-primary-900 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1.5">
                            <h2 className="text-3xl font-serif font-bold text-white mb-6">
                                Baitul<span className="text-accent-400">Hikmah</span>
                            </h2>
                            <p className="text-primary-100 text-sm leading-relaxed mb-6">
                                Sebuah "suaka" modern bagi para pelajar. Memupuk kebijaksanaan, inovasi, dan keunggulan akademis melalui perpustakaan dan program pendidikan yang menemani perjalanan menuntut ilmu.
                            </p>
                            <div className="flex space-x-4">
                                {contacts['whatsapp'] && <SocialLink href={`https://wa.me/${contacts['whatsapp'].replace('0', '62')}`} icon="whatsapp" />}
                                {contacts['instagram'] && <SocialLink href={`https://instagram.com/${contacts['instagram'].replace('@', '')}`} icon="instagram" />}
                                {contacts['youtube'] && <SocialLink href={`https://youtube.com/${contacts['youtube']}`} icon="youtube" />}
                                {/* <SocialLink href="#" icon="facebook" /> */}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-accent-400 mb-6 uppercase tracking-wider">Explore</h3>
                            <ul className="space-y-3">
                                <FooterLink href="/books">Book Catalog</FooterLink>
                                <FooterLink href="/courses">E-Learning</FooterLink>
                                <FooterLink href="/articles">Research & Articles</FooterLink>
                                <FooterLink href="/gallery">Gallery</FooterLink>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-accent-400 mb-6 uppercase tracking-wider">Company</h3>
                            <ul className="space-y-3">
                                <FooterLink href="/about">About Us</FooterLink>
                                <FooterLink href="/contact">Contact Us</FooterLink>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-accent-400 mb-6 uppercase tracking-wider">Contact</h3>
                            <ul className="space-y-4 text-sm text-primary-100">
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 mr-3 text-accent-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {contacts['address'] || 'Jalan Setiabudi No. 229, Bandung, Jawa Barat'}
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 mr-3 text-accent-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {contacts['phone'] || '+62 123 4567 890'}
                                </li>
                                <li className="flex items-center">
                                    <svg className="h-5 w-5 mr-3 text-accent-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {contacts['email'] || 'info@baitulhikmah.com'}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-primary-800 pt-8 mt-12 text-center text-primary-300 text-sm">
                        <p>&copy; {new Date().getFullYear()} Baitulhikmah Library. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const NavLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm md:text-sm lg:text-base transition-all duration-300 ${active
            ? 'border-accent-500 text-primary-900'
            : 'border-transparent text-gray-500 hover:text-primary-700 hover:border-primary-300'
            }`}
    >
        {children}
    </Link>
);

const MobileNavLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${active
            ? 'bg-primary-50 border-primary-500 text-primary-700'
            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            }`}
    >
        {children}
    </Link>
);

const FooterLink = ({ href, children }) => (
    <li>
        <Link href={href} className="text-primary-200 hover:text-white hover:pl-2 transition-all duration-300 flex items-center">
            <span className="w-1 h-1 bg-accent-400 rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
            {children}
        </Link>
    </li>
);

const SocialLink = ({ href, icon }) => {
    // Icons mapping
    const icons = {
        whatsapp: <path d="M20.52 3.48A11.82 11.82 0 0 0 12.01 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.17 1.6 5.98L0 24l6.18-1.62A11.93 11.93 0 0 0 12.01 24C18.65 24 24 18.64 24 12c0-3.2-1.25-6.21-3.49-8.52zM12.01 22a9.94 9.94 0 0 1-5.07-1.38l-.36-.21-3.67.96.98-3.57-.23-.37A9.94 9.94 0 1 1 22 12c0 5.52-4.47 10-9.99 10zm5.45-7.44c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />,
        facebook: <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />,
        twitter: <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />,
        instagram: <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />,
        youtube: <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />,
        default: <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" clipRule="evenodd" />
    };

    return (
        <a href={href} target="_blank" className="text-primary-300 hover:text-white transition-colors bg-primary-800 hover:bg-accent-600 p-2 rounded-full">
            <span className="sr-only">{icon}</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {icons[icon] || icons['default']}
            </svg>
        </a>
    );
};
