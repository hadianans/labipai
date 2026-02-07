import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, visions }) {
    const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
    const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
    const [editingVision, setEditingVision] = useState(false);
    const [editingMission, setEditingMission] = useState(false);
    const [currentVisionId, setCurrentVisionId] = useState(null);

    // Vision Form
    const { data: visionData, setData: setVisionData, post: postVision, put: putVision, processing: visionProcessing, errors: visionErrors, reset: resetVision, clearErrors: clearVisionErrors } = useForm({
        id: '',
        vision_point: '',
        year: new Date().getFullYear(),
        is_active: true,
    });

    // Mission Form
    const { data: missionData, setData: setMissionData, post: postMission, put: putMission, processing: missionProcessing, errors: missionErrors, reset: resetMission, clearErrors: clearMissionErrors } = useForm({
        id: '',
        vision_id: '',
        mission_point: '',
    });

    // Vision Handlers
    const openVisionModal = (vision = null) => {
        if (vision) {
            setEditingVision(true);
            setVisionData({
                id: vision.id,
                vision_point: vision.vision_point,
                year: vision.year,
                is_active: Boolean(vision.is_active),
            });
        } else {
            setEditingVision(false);
            resetVision();
            setVisionData({
                id: '',
                vision_point: '',
                year: new Date().getFullYear(),
                is_active: true,
            });
        }
        clearVisionErrors();
        setIsVisionModalOpen(true);
    };

    const submitVision = (e) => {
        e.preventDefault();
        if (editingVision) {
            putVision(route('admin.visions.update', visionData.id), {
                onSuccess: () => {
                    setIsVisionModalOpen(false);
                    Swal.fire('Updated!', 'Vision has been updated.', 'success');
                },
            });
        } else {
            postVision(route('admin.visions.store'), {
                onSuccess: () => {
                    setIsVisionModalOpen(false);
                    Swal.fire('Created!', 'Vision has been created.', 'success');
                },
            });
        }
    };

    const deleteVision = (id) => {
        Swal.fire({
            title: 'Delete Vision?',
            text: "All associated missions will also be deleted without warning (cascade)!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.visions.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('Deleted!', 'Vision deleted.', 'success'),
                });
            }
        });
    };

    // Mission Handlers
    const openMissionModal = (visionId, mission = null) => {
        setCurrentVisionId(visionId);
        if (mission) {
            setEditingMission(true);
            setMissionData({
                id: mission.id,
                vision_id: visionId,
                mission_point: mission.mission_point,
            });
        } else {
            setEditingMission(false);
            resetMission();
            setMissionData({
                vision_id: visionId,
                mission_point: '',
            });
        }
        clearMissionErrors();
        setIsMissionModalOpen(true);
    };

    const submitMission = (e) => {
        e.preventDefault();
        if (editingMission) {
            putMission(route('admin.missions.update', missionData.id), {
                onSuccess: () => {
                    setIsMissionModalOpen(false);
                    Swal.fire('Updated!', 'Mission updated.', 'success');
                },
            });
        } else {
            postMission(route('admin.visions.missions.store', currentVisionId), {
                onSuccess: () => {
                    setIsMissionModalOpen(false);
                    Swal.fire('Added!', 'Mission added.', 'success');
                },
            });
        }
    };

    const deleteMission = (id) => {
        Swal.fire({
            title: 'Delete Mission?',
            text: "This cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.missions.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('Deleted!', 'Mission deleted.', 'success'),
                });
            }
        });
    };

    return (
        <AdminLayout
            user={auth.user}
            header="Vision & Mission"
        >
            <Head title="Vision & Mission" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Organization Strategy</h2>
                            <p className="text-gray-600 text-sm">Manage visions and missions statements.</p>
                        </div>
                        <PrimaryButton onClick={() => openVisionModal()} className="w-full sm:w-auto justify-center">
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                New Vision
                            </span>
                        </PrimaryButton>
                    </div>

                    <div className="space-y-8">
                        {visions.map((vision) => (
                            <div key={vision.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                                {/* Vision Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                                Vision {vision.year}
                                            </span>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded ${vision.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                                {vision.is_active ? 'Active' : 'Allocated'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-serif text-gray-800 leading-snug">
                                            "{vision.vision_point}"
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 md:self-start">
                                        <button
                                            onClick={() => openVisionModal(vision)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                            title="Edit Vision"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => deleteVision(vision.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete Vision"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Missions Section */}
                                <div className="px-6 py-5 bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            Associated Missions
                                        </h4>
                                        <button
                                            onClick={() => openMissionModal(vision.id)}
                                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Add Mission
                                        </button>
                                    </div>

                                    {vision.missions && vision.missions.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {vision.missions.map((mission) => (
                                                <div key={mission.id} className="group flex items-start justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all">
                                                    <div className="flex gap-3">
                                                        <div className="mt-1 h-2 w-2 rounded-full bg-indigo-400 shrink-0"></div>
                                                        <span className="text-gray-700 text-sm leading-relaxed">{mission.mission_point}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                                                        <button
                                                            onClick={() => openMissionModal(vision.id, mission)}
                                                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => deleteMission(mission.id)}
                                                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-500 italic">No missions defined for this vision yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {visions.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No Strategy Defined</h3>
                                <p className="text-gray-500 mb-6">Create your first Vision to get started.</p>
                                <PrimaryButton onClick={() => openVisionModal()}>
                                    Create Vision
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Vision Modal */}
            <Modal show={isVisionModalOpen} onClose={() => setIsVisionModalOpen(false)}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingVision ? 'Edit Vision' : 'Create New Vision'}
                        </h2>
                        <button onClick={() => setIsVisionModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={submitVision}>
                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="vision_point" value="Vision Statement" />
                                <textarea
                                    id="vision_point"
                                    value={visionData.vision_point}
                                    onChange={(e) => setVisionData('vision_point', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm min-h-[100px]"
                                    placeholder="Enter your organization's vision statement..."
                                    required
                                />
                                <InputError message={visionErrors.vision_point} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="year" value="Strategy Year" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <TextInput
                                            id="year"
                                            value={visionData.year}
                                            onChange={(e) => setVisionData('year', e.target.value)}
                                            type="number"
                                            className="block w-full pl-10"
                                            required
                                        />
                                    </div>
                                    <InputError message={visionErrors.year} className="mt-2" />
                                </div>

                                <div className="flex items-end pb-2">
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input
                                                id="is_active"
                                                type="checkbox"
                                                className="sr-only"
                                                checked={visionData.is_active}
                                                onChange={(e) => setVisionData('is_active', e.target.checked)}
                                            />
                                            <div className={`block w-12 h-7 rounded-full transition-colors ${visionData.is_active ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${visionData.is_active ? 'transform translate-x-5' : ''}`}></div>
                                        </div>
                                        <span className="ml-3 font-medium text-gray-700">{visionData.is_active ? 'Active' : 'Inactive'}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <SecondaryButton type="button" onClick={() => setIsVisionModalOpen(false)}>Cancel</SecondaryButton>
                            <PrimaryButton disabled={visionProcessing}>{editingVision ? 'Update Vision' : 'Create Vision'}</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Mission Modal */}
            <Modal show={isMissionModalOpen} onClose={() => setIsMissionModalOpen(false)}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingMission ? 'Edit Mission' : 'Add New Mission'}
                        </h2>
                        <button onClick={() => setIsMissionModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={submitMission}>
                        <div>
                            <InputLabel htmlFor="mission_point" value="Mission Statement" />
                            <textarea
                                id="mission_point"
                                value={missionData.mission_point}
                                onChange={(e) => setMissionData('mission_point', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm min-h-[120px]"
                                placeholder="Enter a specific mission point that supports the vision..."
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">Be specific and actionable.</p>
                            <InputError message={missionErrors.mission_point} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <SecondaryButton type="button" onClick={() => setIsMissionModalOpen(false)}>Cancel</SecondaryButton>
                            <PrimaryButton disabled={missionProcessing}>{editingMission ? 'Update Mission' : 'Add Mission'}</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
