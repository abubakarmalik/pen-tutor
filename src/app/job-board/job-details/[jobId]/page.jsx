'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  BookOpen,
  MapPin,
  CheckCircle,
  DollarSign,
  GraduationCap,
  Calendar,
  Briefcase,
  Award,
  TrendingUp,
  Star,
  ChevronRight,
  Bookmark,
  Share2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dummyTutorRequests } from '../../dummyTutorRequests ';
export default function JobDetailPage() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [jobId, setJobId] = useState(1);

  const router = useRouter();

  useEffect(() => {
    // Get job ID from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl =
      urlParams.get('id') || window.location.pathname.split('/').pop();
    const parsedId = parseInt(idFromUrl);

    if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 12) {
      setJobId(parsedId);
    }

    // Simulate loading
    setTimeout(() => {
      // Find the job by ID from the array
      const selectedJob = dummyTutorRequests.find((j) => j.id === jobId);
      setJob(selectedJob || dummyTutorRequests[0]);
      setLoading(false);
    }, 1000);
  }, [jobId]);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleApply = (id) => {
    router.push(`/job-board/apply?job_id=${id}`);
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    showToastMessage(
      isSaved ? 'Job removed from saved' : 'Job saved successfully',
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: job.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToastMessage('Link copied to clipboard');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTeachingModeIcon = (mode) => {
    return mode === 'online' ? '💻' : '🏫';
  };

  const formatBudget = (amount, type) => {
    // Handle budget display
    if (type === 'per_month') {
      return `PKR ${amount}/month`;
    }

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

    switch (type) {
      case 'hourly':
        return `${formattedAmount}/hour`;
      case 'fixed':
        return `${formattedAmount} (Fixed)`;
      case 'negotiable':
        return `${formattedAmount} (Negotiable)`;
      default:
        return formattedAmount;
    }
  };

  const formatDuration = (value, unit) => {
    return `${value} ${unit}${value > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse max-w-7xl mx-auto space-y-6">
            <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="h-8 bg-gray-200 rounded mb-4 w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-6 w-5/6"></div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-white rounded-2xl shadow-sm"></div>
                <div className="h-64 bg-white rounded-2xl shadow-sm"></div>
              </div>
              <div className="h-96 bg-white rounded-2xl shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="text-center py-16 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Job not found
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                The job you're looking for doesn't exist or has been removed.
              </p>
              <button className="bg-[#313D6A] hover:bg-[#313D6A]/90 text-white px-8 py-3 rounded-lg text-base font-medium transition-colors">
                Browse All Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-top">
          <p className="text-gray-900 font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#313D6A] via-[#3d4a75] to-[#4A5A8A]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#F5BB07] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-6">
            <Link
              href="/job-board"
              className="hover:text-white cursor-pointer transition-colors"
            >
              Jobs
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Job Details</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3">
              {/* Status and Mode Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className={`${getStatusColor(
                    job.status,
                  )} border px-4 py-1.5 text-sm font-medium rounded-full`}
                >
                  {job.status?.replace('_', ' ').toUpperCase()}
                </span>
                <span className="bg-white/10 text-white border border-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm rounded-full">
                  <span className="mr-2">
                    {getTeachingModeIcon(job.teaching_mode)}
                  </span>
                  {job.teaching_mode?.replace('_', ' ')}
                </span>
                <span className="bg-[#F5BB07]/20 text-[#F5BB07] border border-[#F5BB07]/30 px-4 py-1.5 text-sm font-medium backdrop-blur-sm rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {job.applications_count} Applicants
                </span>
              </div>

              {/* Title and Description */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                {job.title}
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed">
                {job.description}
              </p>

              {/* Key Info Pills */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-3 flex items-center gap-2.5 border border-white/20">
                  <DollarSign className="h-5 w-5 text-[#F5BB07]" />
                  <span className="font-semibold text-white text-base">
                    {formatBudget(job.budget_amount, job.budget_type)}
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-3 flex items-center gap-2.5 border border-white/20">
                  <Clock className="h-5 w-5 text-gray-300" />
                  <span className="text-white text-base">
                    {formatDuration(job.duration_value, job.duration_unit)}
                  </span>
                </div>
                {job.location && (
                  <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-3 flex items-center gap-2.5 border border-white/20">
                    <MapPin className="h-5 w-5 text-gray-300" />
                    <span className="text-white text-base">{job.location}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold px-8 py-4 text-base rounded-lg shadow-lg shadow-[#F5BB07]/20 transition-all hover:shadow-xl hover:shadow-[#F5BB07]/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  onClick={() => handleApply(job.id)}
                  disabled={hasApplied || !job.can_apply}
                >
                  Apply Now
                </button>
                <button
                  className="border-2 border-white text-white hover:bg-white hover:text-[#313D6A] px-8 py-4 text-base rounded-lg bg-transparent transition-all hover:scale-105 flex items-center justify-center gap-2"
                  onClick={handleSaveJob}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}
                  />
                  {isSaved ? 'Saved' : 'Save Job'}
                </button>
                <button
                  className="border-2 border-white text-white hover:bg-white hover:text-[#313D6A] px-8 py-4 text-base rounded-lg bg-transparent transition-all hover:scale-105 flex items-center justify-center gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Course Card - Right Side */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-center h-48 bg-gradient-to-br from-white/20 to-white/5 rounded-xl mb-6 border border-white/10">
                  <div className="text-center">
                    <div className="bg-white/20 rounded-full p-5 inline-flex mb-4 backdrop-blur-sm">
                      <GraduationCap className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {job.course?.title}
                    </h3>
                    <p className="text-base text-gray-200">
                      {job.subject_display}
                    </p>
                  </div>
                </div>
                {job.deadline && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          Application Deadline
                        </span>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Job Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Requirements Card */}
            <div className="border-0 shadow duration-300 rounded-2xl overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] text-white p-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  Job Requirements
                </h2>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="bg-[#313D6A] p-2.5 rounded-lg flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Subject
                      </p>
                      <p className="font-semibold text-gray-900">
                        {job.subject_display}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="bg-[#313D6A] p-2.5 rounded-lg flex-shrink-0">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Duration
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatDuration(job.duration_value, job.duration_unit)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="bg-[#F5BB07] p-2.5 rounded-lg flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-black" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Budget
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatBudget(job.budget_amount, job.budget_type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="bg-[#313D6A] p-2.5 rounded-lg flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Teaching Mode
                      </p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {job.teaching_mode?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  {job.location && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors sm:col-span-2">
                      <div className="bg-[#313D6A] p-2.5 rounded-lg flex-shrink-0">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                          Location
                        </p>
                        <p className="font-semibold text-gray-900">
                          {job.location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    className="w-full bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold py-4 text-base rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    onClick={() => handleApply(job.id)}
                    disabled={hasApplied || !job.can_apply}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Applied Successfully
                      </>
                    ) : job.can_apply ? (
                      'Apply for this Position'
                    ) : (
                      'Cannot Apply'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Job Description Card */}
            <div className="border-0 shadow duration-300 rounded-2xl overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] text-white p-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Job Description
                </h2>
              </div>
              <div className="p-6 sm:p-8 space-y-6">
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {job.description}
                  </p>
                </div>

                {job.additional_notes && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h4 className="font-semibold text-[#313D6A] mb-3 flex items-center gap-2 text-lg">
                      <Award className="w-5 h-5" />
                      Additional Notes
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {job.additional_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Student Information Card */}
            <div className="border-0 shadow duration-300 rounded-2xl overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] text-white p-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Posted By
                </h2>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#313D6A] to-[#4A5A8A] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 ring-4 ring-gray-100">
                    {job.student?.full_name?.charAt(0) ||
                      job.student?.username?.charAt(0) ||
                      'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-gray-900 mb-1 truncate">
                      {job.student?.full_name || job.student?.username}
                    </h3>
                    <p className="text-gray-600 mb-2 truncate">
                      @{job.student?.username}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Posted on{' '}
                        {new Date(job.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Teacher Card */}
            {job.selected_teacher && (
              <div className="border-0 shadow duration-300 rounded-2xl overflow-hidden border-l-4 border-l-green-500 bg-white">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="w-6 h-6" />
                    Selected Teacher
                  </h2>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 ring-4 ring-green-100">
                      {job.selected_teacher?.full_name?.charAt(0) ||
                        job.selected_teacher?.username?.charAt(0) ||
                        'T'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-gray-900 mb-1 truncate">
                        {job.selected_teacher?.full_name ||
                          job.selected_teacher?.username}
                      </h3>
                      <p className="text-gray-600 mb-2 truncate">
                        @{job.selected_teacher?.username}
                      </p>
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Selected Teacher
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Job Overview Card */}
              <div className="border-0 shadow rounded-2xl overflow-hidden bg-white">
                <div className="bg-gradient-to-br from-[#313D6A] to-[#4A5A8A] p-8 text-white">
                  <div className="text-center mb-6">
                    <p className="text-sm font-medium mb-2 text-gray-200">
                      Budget Range
                    </p>
                    <div className="text-4xl font-bold mb-2">
                      {formatBudget(job.budget_amount, job.budget_type)}
                    </div>
                    <p className="text-sm text-gray-300">
                      {job.budget_type === 'hourly'
                        ? 'Per Hour'
                        : job.budget_type === 'fixed'
                        ? 'Fixed Price'
                        : 'Negotiable'}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Duration</span>
                    <span className="font-semibold text-gray-900">
                      {formatDuration(job.duration_value, job.duration_unit)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Applications
                    </span>
                    <span className="bg-[#313D6A] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {job.applications_count}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Teaching Mode
                    </span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {job.teaching_mode?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span
                      className={`${getStatusColor(
                        job.status,
                      )} text-xs capitalize px-3 py-1 rounded-full`}
                    >
                      {job.status?.replace('_', ' ')}
                    </span>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-600 font-medium">
                        Deadline
                      </span>
                      <span className="font-semibold text-gray-900">
                        {new Date(job.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <button
                    className="w-full bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold py-4 text-base rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    onClick={() => handleApply(job.id)}
                    disabled={hasApplied || !job.can_apply}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Applied
                      </>
                    ) : job.can_apply ? (
                      'Apply Now'
                    ) : (
                      'Cannot Apply'
                    )}
                  </button>

                  <button
                    className="w-full border-2 border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white py-4 text-base rounded-lg bg-transparent transition-all flex items-center justify-center gap-2"
                    onClick={handleSaveJob}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}
                    />
                    {isSaved ? 'Saved' : 'Save Job'}
                  </button>
                </div>
              </div>

              {/* Course Information */}
              <div className="border-0 shadow rounded-2xl overflow-hidden bg-white">
                <div className="p-6">
                  <h3 className="font-semibold text-[#313D6A] mb-4 text-lg">
                    Course Information
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {job.course?.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {job.subject_display}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <span className="text-sm text-gray-600">
                        Course Type:{' '}
                      </span>
                      <span className="font-medium text-gray-900">
                        {job.course?.course_type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="border-0 shadow rounded-2xl overflow-hidden bg-white">
                <div className="p-6">
                  <h3 className="font-semibold text-[#313D6A] mb-4 text-lg">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600 font-medium">
                        Posted
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600 font-medium">
                        Last Updated
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {new Date(job.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600 font-medium">
                        Job ID
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        #{job.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
