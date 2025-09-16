import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#7966F1] via-purple-400 to-indigo-500 !py-8">
            <div className="max-w-5xl !mx-auto !px-4 sm:!px-6 lg:!px-8">
                <div className="!mb-12 text-center">
                    <button
                        onClick={handleBackClick}
                        className="!mb-8 !px-6 !py-3 bg-white text-[#7966F1] rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                    >
                        ← Back to Dashboard
                    </button>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl !p-8 !mb-8 border border-white/20">
                        <h1 className="text-5xl font-extrabold text-white !mb-4 tracking-tight">
                            Privacy Policy
                        </h1>
                        <div className="flex items-center justify-center !gap-3 text-white/90">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <p className="text-lg font-medium">Last updated: {new Date().toLocaleDateString()}</p>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl !p-10 space-y-16 border border-gray-200">
                    <section className="bg-gradient-to-r from-[#7966F1]/5 to-purple-100 !p-8 rounded-2xl border-l-4 border-[#7966F1] !mb-8">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-[#7966F1] rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-[#7966F1]">Introduction</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            Welcome to <span className="font-semibold text-[#7966F1]">CrackIT-X</span>. This Privacy Policy explains how we collect,
                            use, disclose, and safeguard your information when you use our exam administration platform.
                            Please read this privacy policy carefully. If you do not agree with the terms of this
                            privacy policy, please do not access the application.
                        </p>
                    </section>

                    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 !p-8 rounded-2xl border-l-4 border-blue-500 !mb-8">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-blue-500 rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-blue-600">Information We Collect</h2>
                        </div>
                        <div className="grid md:grid-cols-3 !gap-6">
                            <div className="bg-white !p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center !gap-2 !mb-4">
                                    <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-full"></div>
                                    <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                                </div>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start !gap-2">
                                        <span className="text-pink-400 !mt-1">•</span>
                                        <span>Name and contact information (email address, phone number)</span>
                                    </li>
                                    <li className="flex items-start !gap-2">
                                        <span className="text-pink-400 !mt-1">•</span>
                                        <span>Student ID and enrollment details</span>
                                    </li>
                                    <li className="flex items-start !gap-2">
                                        <span className="text-pink-400 !mt-1">•</span>
                                        <span>Authentication credentials (username, encrypted passwords)</span>
                                    </li>
                                    <li className="flex items-start !gap-2">
                                        <span className="text-pink-400 !mt-1">•</span>
                                        <span>Profile information and preferences</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white !p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center !gap-2 !mb-4">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                                    <h3 className="text-xl font-bold text-gray-800">Exam-Related Information</h3>
                                </div>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start !gap-2">
                                        <span className="text-green-400 !mt-1">•</span>
                                        <span>Exam responses and submissions</span>
                                    </li>
                                    <li className="flex items-start !gap-2">
                                        <span className="text-green-400 !mt-1">•</span>
                                        <span>Test scores and performance analytics</span>
                                    </li>
                                    <li className="flex items-start !gap-2">
                                        <span className="text-green-400 !mt-1">•</span>
                                        <span>Exam attempt history and timestamps</span>
                                    </li>
                                    <li className="flex items-start !gap-2">
                                        <span className="text-green-400 !mt-1">•</span>
                                        <span>Session logs and activity tracking</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white !p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center !gap-2 !mb-4">
                                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
                                    <h3 className="text-xl font-bold text-gray-800">Technical Information</h3>
                                </div>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start !gap-2">
                                        <span className="text-purple-400 !mt-1">•</span>
                                        <span>IP address and device information</span>
                                    </li>
                                    <li className="flex items-start !gap-2">
                                        <span className="text-purple-400 !mt-1">•</span>
                                        <span>Browser type and version</span>
                                    </li>
                                    <li className="flex items-start !gap-2">
                                        <span className="text-purple-400 !mt-1">•</span>
                                        <span>Operating system information</span>
                                    </li>
                                    <li className="flex items-start !gap-2">
                                        <span className="text-purple-400 !mt-1">•</span>
                                        <span>Usage patterns and system logs</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-emerald-50 to-green-50 !p-8 rounded-2xl border-l-4 border-emerald-500 !mb-8">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-emerald-500 rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-emerald-600">How We Use Your Information</h2>
                        </div>
                        <div className="grid md:grid-cols-2 !gap-4">
                            <div className="flex items-start !gap-3 bg-white !p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full !mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">To provide and maintain our exam management services</span>
                            </div>
                            <div className="flex items-start !gap-3 bg-white !p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full !mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">To authenticate users and prevent unauthorized access</span>
                            </div>
                            <div className="flex items-start !gap-3 bg-white !p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full !mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">To conduct online examinations and assessments</span>
                            </div>
                            <div className="flex items-start !gap-3 bg-white !p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full !mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">To generate performance reports and analytics</span>
                            </div>
                            <div className="flex items-start !gap-3 bg-white !p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full !mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">To communicate important updates and notifications</span>
                            </div>
                            <div className="flex items-start !gap-3 bg-white !p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full !mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">To improve our platform's functionality and user experience</span>
                            </div>
                            <div className="flex items-start !gap-3 bg-white !p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full !mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">To ensure compliance with educational standards and regulations</span>
                            </div>
                            <div className="flex items-start !gap-3 bg-white !p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full !mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 leading-relaxed">To provide technical support and customer service</span>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-orange-50 to-amber-50 !p-8 rounded-2xl border-l-4 border-orange-500 !mb-8">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-orange-500 rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-orange-600">Information Sharing and Disclosure</h2>
                        </div>
                        <div className="bg-white !p-6 rounded-xl shadow-md border border-orange-100">
                            <p className="text-gray-700 leading-relaxed text-lg !mb-6 font-medium">
                                We do <span className="text-orange-600 font-bold">not sell, trade, or rent</span> your personal information to third parties.
                                We may share your information only in the following circumstances:
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 !gap-4">
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 !p-4 rounded-lg border border-orange-200">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full !mb-2"></div>
                                    <span className="text-gray-700 text-sm">With educational institutions for academic record purposes</span>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 !p-4 rounded-lg border border-orange-200">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full !mb-2"></div>
                                    <span className="text-gray-700 text-sm">With authorized administrators and instructors for exam management</span>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 !p-4 rounded-lg border border-orange-200">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full !mb-2"></div>
                                    <span className="text-gray-700 text-sm">When required by law or legal process</span>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 !p-4 rounded-lg border border-orange-200">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full !mb-2"></div>
                                    <span className="text-gray-700 text-sm">To protect our rights, property, or safety</span>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 !p-4 rounded-lg border border-orange-200 md:col-span-2 lg:col-span-1">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full !mb-2"></div>
                                    <span className="text-gray-700 text-sm">With service providers who assist in platform operations (under strict confidentiality agreements)</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-red-50 to-pink-50 !p-8 rounded-2xl border-l-4 border-red-500 !mb-8">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-red-500 rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-red-600">Data Security</h2>
                        </div>
                        <div className="bg-white !p-6 rounded-xl shadow-md border border-red-100">
                            <p className="text-gray-700 leading-relaxed text-lg !mb-6 font-medium">
                                We implement appropriate technical and organizational security measures to protect
                                your personal information against unauthorized access, alteration, disclosure, or destruction:
                            </p>
                            <div className="grid md:grid-cols-2 !gap-4">
                                <div className="flex items-center !gap-3 bg-gradient-to-r from-red-50 to-pink-50 !p-4 rounded-lg border border-red-200">
                                    <div className="bg-red-400 rounded-full !p-2 flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">Encryption of sensitive data in transit and at rest</span>
                                </div>
                                <div className="flex items-center !gap-3 bg-gradient-to-r from-red-50 to-pink-50 !p-4 rounded-lg border border-red-200">
                                    <div className="bg-red-400 rounded-full !p-2 flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">Secure authentication and access control systems</span>
                                </div>
                                <div className="flex items-center !gap-3 bg-gradient-to-r from-red-50 to-pink-50 !p-4 rounded-lg border border-red-200">
                                    <div className="bg-red-400 rounded-full !p-2 flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">Regular security audits and vulnerability assessments</span>
                                </div>
                                <div className="flex items-center !gap-3 bg-gradient-to-r from-red-50 to-pink-50 !p-4 rounded-lg border border-red-200">
                                    <div className="bg-red-400 rounded-full !p-2 flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">Limited access to personal information on a need-to-know basis</span>
                                </div>
                                <div className="flex items-center !gap-3 bg-gradient-to-r from-red-50 to-pink-50 !p-4 rounded-lg border border-red-200 md:col-span-2">
                                    <div className="bg-red-400 rounded-full !p-2 flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">Secure backup and disaster recovery procedures</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-teal-50 to-cyan-50 !p-8 rounded-2xl border-l-4 border-teal-500 !mb-8">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-teal-500 rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-teal-600">Data Retention</h2>
                        </div>
                        <div className="bg-white !p-6 rounded-xl shadow-md border border-teal-100">
                            <p className="text-gray-700 leading-relaxed text-lg">
                                We retain your personal information for as long as necessary to fulfill the purposes
                                outlined in this privacy policy, unless a longer retention period is required or
                                permitted by law. <span className="font-semibold text-teal-600">Exam records and academic data</span> may be retained according to
                                institutional policies and regulatory requirements.
                            </p>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-violet-50 to-purple-50 !p-8 rounded-2xl border-l-4 border-violet-500 !mb-8">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-violet-500 rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-violet-600">Your Rights</h2>
                        </div>
                        <div className="bg-white !p-6 rounded-xl shadow-md border border-violet-100">
                            <p className="text-gray-700 leading-relaxed text-lg !mb-6 font-medium">
                                Depending on your location and applicable laws, you may have the following rights:
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 !gap-4">
                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 !p-4 rounded-lg border border-violet-200 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center !gap-2 !mb-2">
                                        <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                                        <span className="text-violet-700 font-semibold text-sm">RESTRICTION</span>
                                    </div>
                                    <span className="text-gray-700 text-sm">Restriction of processing in certain circumstances</span>
                                </div>
                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 !p-4 rounded-lg border border-violet-200 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center !gap-2 !mb-2">
                                        <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                                        <span className="text-violet-700 font-semibold text-sm">PORTABILITY</span>
                                    </div>
                                    <span className="text-gray-700 text-sm">Data portability where technically feasible</span>
                                </div>
                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 !p-4 rounded-lg border border-violet-200 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center !gap-2 !mb-2">
                                        <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                                        <span className="text-violet-700 font-semibold text-sm">OBJECTION</span>
                                    </div>
                                    <span className="text-gray-700 text-sm">Objection to processing based on legitimate interests</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-yellow-50 to-orange-50 !p-8 rounded-2xl border-l-4 border-yellow-500 !mb-8">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-yellow-500 rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m3 0H4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zM7 8h10m-5 4h5m-5 4h5"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-yellow-600">Cookies and Tracking Technologies</h2>
                        </div>
                        <div className="bg-white !p-6 rounded-xl shadow-md border border-yellow-100">
                            <p className="text-gray-700 leading-relaxed text-lg">
                                We use <span className="font-semibold text-yellow-600">cookies and similar tracking technologies</span> to enhance your experience,
                                maintain sessions, and analyze platform usage. You can control cookie settings
                                through your browser preferences, though this may affect platform functionality.
                            </p>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-indigo-50 to-blue-50 !p-8 rounded-2xl border-l-4 border-indigo-500 !mb-8">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-indigo-500 rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-indigo-600">Updates to This Policy</h2>
                        </div>
                        <div className="bg-white !p-6 rounded-xl shadow-md border border-indigo-100">
                            <p className="text-gray-700 leading-relaxed text-lg">
                                We may update this Privacy Policy from time to time. We will notify you of any
                                material changes by posting the new Privacy Policy on this page and updating
                                the <span className="font-semibold text-indigo-600">"Last updated"</span> date. Your continued use of the platform after such modifications
                                constitutes acceptance of the updated policy.
                            </p>
                        </div>
                    </section>

                    <section className="bg-gradient-to-r from-gray-50 to-slate-50 !p-8 rounded-2xl border-l-4 border-gray-500">
                        <div className="flex items-center !gap-3 !mb-6">
                            <div className="bg-gray-500 rounded-full !p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-600">Contact Us</h2>
                        </div>
                        <div className="bg-white !p-8 rounded-xl shadow-md border border-gray-100">
                            <p className="text-gray-700 leading-relaxed text-lg !mb-6 font-medium">
                                If you have any questions about this Privacy Policy or our data practices,
                                please contact us:
                            </p>
                            <div className="grid md:grid-cols-3 !gap-6">
                                <div className="bg-gradient-to-br from-gray-50 to-slate-50 !p-6 rounded-lg border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
                                    <div className="bg-gray-400 rounded-full !p-3 !mx-auto !mb-4 w-fit">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 !mb-2">Email</h3>
                                    <p className="text-gray-600">contentive8@gmail.com</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-slate-50 !p-6 rounded-lg border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
                                    <div className="bg-gray-400 rounded-full !p-3 !mx-auto !mb-4 w-fit">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 !mb-2">Phone</h3>
                                    <p className="text-gray-600">8657677901 / 9321050143</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-slate-50 !p-6 rounded-lg border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
                                    <div className="bg-gray-400 rounded-full !p-3 !mx-auto !mb-4 w-fit">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 !mb-2">Address</h3>
                                    <p className="text-gray-600">Sai Darshan Building, B/106, SV Rd, RNP Park, Bhayandar East, Mira Bhayandar, Maharashtra 401105</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="!mt-12 text-center">
                    <button
                        onClick={handleBackClick}
                        className="!px-8 !py-4 bg-gradient-to-r from-[#7966F1] to-purple-600 text-white rounded-xl hover:from-[#6855E0] hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105 text-lg"
                    >
                        🏠 Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;