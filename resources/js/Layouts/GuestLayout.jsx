import React from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Visual & Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary-900 border-r border-primary-800 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>

                {/* Branding Top */}
                <div className="relative z-10 flex items-center gap-3">
                    <img src="/storage/logo.png" alt="Baitulhikmah" className="h-10 w-auto brightness-0 invert" />
                    <span className="text-2xl font-serif font-bold tracking-tight">Baitul<span className="text-accent-400">Hikmah</span></span>
                </div>

                {/* Middle Content - Hero Text */}
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">
                        {title || "Welcome to Baitulhikmah"}
                    </h2>
                    <p className="text-primary-200 text-lg leading-relaxed">
                        {subtitle || "A modern sanctuary for knowledge seekers. Join our community to access a wealth of resources and educational programs."}
                    </p>
                </div>

                {/* Footer / Quote */}
                <div className="relative z-10">
                    <blockquote className="border-l-4 border-accent-500 pl-4 italic text-primary-200">
                        "Acquire knowledge, and learn tranquility and dignity."
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-gray-50">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Branding */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-block">
                            <img src="/storage/logo.png" alt="Baitulhikmah" className="h-16 w-auto mx-auto mb-2" />
                        </Link>
                        <h2 className="text-3xl font-serif font-bold text-gray-900">Baitul<span className="text-primary-600">Hikmah</span></h2>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
