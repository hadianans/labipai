import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function About({ vision, administrators, programs }) {
    const [selectedRole, setSelectedRole] = React.useState(null);

    const openModal = (role) => {
        setSelectedRole(role);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedRole(null);
        document.body.style.overflow = 'unset';
    };

    return (
        <PublicLayout>
            <Head title="About Us - Baitulhikmah" />

            {/* Hero Section */}
            <div className="bg-primary-900 py-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900/90"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <span className="inline-block py-1 px-3 rounded-full bg-secondary-500/20 text-secondary-300 text-sm font-semibold tracking-wider mb-4 border border-secondary-500/30">EST. 2007</span>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm">Our Story & Vision</h1>
                    <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">Building a legacy of knowledge and virtue through modern Islamic education.</p>
                </div>
            </div>

            <div className="bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                    {/* Our Story Section */}
                    <div className="mb-24 flex flex-col md:flex-row items-center gap-16">
                        <div className="w-full md:w-1/2 relative group">
                            <div className="absolute -inset-4 bg-primary-100 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6"></div>

                            {/* Ideally fetch another gallery image or static placeholder */}
                            <img src="/storage/gallery/about2.jpg" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }} className="relative rounded-2xl shadow-xl w-full object-cover transform transition-transform group-hover:scale-[1.02]" alt="About" />
                            <div className="hidden text-lg">Baitulhikmah</div>
                            {/* <img
                                src="https://placehold.co/600x400?text=Our+Story"
                                alt="Our Story"
                                className="relative rounded-2xl shadow-xl w-full object-cover transform transition-transform group-hover:scale-[1.02]"
                            /> */}
                        </div>
                        <div className="w-full md:w-1/2">
                            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8 relative inline-block">
                                <span className="relative z-10">Cerita Kami</span>
                                <span className="absolute bottom-1 left-0 w-full h-3 bg-secondary-200/50 -z-10 transform -rotate-2"></span>
                            </h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed font-light">
                                <p className="mb-6 first-letter:text-5xl first-letter:font-serif first-letter:text-primary-800 first-letter:mr-2 first-letter:float-left">
                                    Baitulhikmah di bawah naungan program studi Ilmu Pendidikan Agama Islam UPI, didirikan dengan satu tujuan tunggal: untuk menjembatani kesenjangan antara warisan Islam klasik dan kebutuhan pendidikan modern. Berawal dari kelompok baca kecil, kami telah berkembang menjadi pusat pembelajaran, penelitian, dan pengembangan komunitas yang komprehensif.
                                </p>
                                <p>
                                    Selama bertahun-tahun, kami telah mengumpulkan para cendekiawan, mahasiswa, dan profesional yang berdedikasi terhadap ilmu. Perjalanan kami adalah pertumbuhan yang berkelanjutan, didorong oleh semangat jihad di jalan-Nya dan menginspirasi generasi mendatang.
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Visi Misi - Modern Futuristic Style */}
                    <div className="mb-24 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 shadow-2xl skew-y-3 transform -z-10 rounded-3xl opacity-90"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10 overflow-hidden rounded-3xl border border-white/10 backdrop-blur-sm">
                            {/* Vision */}
                            <div className="p-12 md:border-r border-white/10 bg-black/20 hover:bg-black/30 transition duration-500 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </div>
                                <h2 className="text-3xl font-sans font-bold text-white mb-6 tracking-wide">Our Vision {vision?.year ? `(${vision.year})` : ''}</h2>
                                <p className="text-gray-100 leading-relaxed text-lg font-normal drop-shadow-md">
                                    {vision?.vision_point || "Vision not set"}
                                </p>
                            </div>

                            {/* Mission */}
                            <div className="p-12 bg-black/20 hover:bg-black/30 transition duration-500 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl mb-6 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                </div>
                                <h2 className="text-3xl font-sans font-bold text-white mb-6 tracking-wide">Our Mission</h2>
                                <ul className="space-y-4 text-gray-100">
                                    {vision?.missions?.length > 0 ? (
                                        vision.missions.map((mission, idx) => (
                                            <li key={idx} className="flex items-start group/item">
                                                <span className="w-1.5 h-1.5 bg-secondary-500 rounded-full mt-2.5 mr-3 group-hover/item:scale-150 transition-transform"></span>
                                                <span className="group-hover/item:text-white transition-colors font-medium drop-shadow-sm">{mission.mission_point}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-400 italic">No mission points listed.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="py-16 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
                                <p className="mt-4 text-xl text-gray-600">Dedicated individuals working towards our shared vision.</p>
                            </div>

                            {/* Chiefs / Leaders */}
                            <div className="flex flex-wrap justify-center gap-8 mb-12">
                                {administrators.filter(admin => admin.is_chief).map((admin) => (
                                    <div key={admin.id} className="w-full sm:w-64 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                                        <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200">
                                            {admin.img_url ? (
                                                <img src={`/storage/${admin.img_url}`} alt={admin.name} className="w-full h-64 object-cover object-center" />
                                            ) : (
                                                <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-400">
                                                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 text-center">
                                            <h3 className="text-xl font-bold text-gray-900">{admin.name}</h3>
                                            <p className="text-indigo-600 font-medium mb-2">{admin.position}</p>
                                            <p className="text-sm text-gray-500">{admin.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Other Members (Show More) */}
                            {administrators.filter(admin => !admin.is_chief).length > 0 && (
                                <div className="text-center">
                                    <details className="group">
                                        <summary className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 cursor-pointer transition-colors duration-200 list-none">
                                            <span>Show Other Members</span>
                                            <svg className="ml-2 h-5 w-5 transform group-open:rotate-180 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </summary>
                                        <div className="mt-8 flex flex-wrap justify-center gap-6">
                                            {administrators.filter(admin => !admin.is_chief).map((admin) => (
                                                <div key={admin.id} className="w-full sm:w-64 bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition-shadow">
                                                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden mb-4">
                                                        {admin.img_url ? (
                                                            <img src={`/storage/${admin.img_url}`} alt={admin.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-gray-900">{admin.name}</h3>
                                                    <p className="text-sm text-indigo-600 mb-1">{admin.position}</p>
                                                    <p className="text-xs text-gray-500">{admin.email}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Programs Section */}
                    {programs && programs.length > 0 && (
                        <div className="w-full mx-auto px-4 sm:px-6 mb-8" id="programs">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Programs</h2>
                                <div className="w-24 h-1 bg-secondary-500 mx-auto rounded-full"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {programs.map(program => (
                                    <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100">
                                        <div className="h-48 bg-gray-200 w-full relative overflow-hidden group">
                                            {program.img_url ? (
                                                <img src={`/storage/${program.img_url}`} alt={program.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full bg-primary-50 text-primary-200">
                                                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" /></svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                        </div>
                                        <div className="p-8 flex-grow flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">{program.name}</h3>
                                            <p className="text-gray-600 mb-6 line-clamp-3 font-light leading-relaxed flex-grow">{program.description}</p>
                                            {program.detail_url && (
                                                <a href={program.detail_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-auto text-secondary-600 font-semibold hover:text-secondary-800 transition-colors">
                                                    Learn More &rarr;
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal - Removed as we're not using the complex role structure anymore */}
            {/* If you want to keep it for something else, keep it. But currently unused. */}

        </PublicLayout>
    );
}
