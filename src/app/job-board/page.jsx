'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import HeroBg from '@/assets/images/job-board/home-hero.png';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dummyTutorRequests } from './dummyTutorRequests ';

export default function JobBoard() {
  const router = useRouter();

  // UI state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [activeTab, setActiveTab] = useState('All');
  const [searchSubject, setSearchSubject] = useState('');
  const [searchMode, setSearchMode] = useState('');
  const [searchType, setSearchType] = useState('');

  // pagination
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ['All', 'Home Tuition', 'Online Tuition', 'Other Jobs'];

  // Load dummy data (keep API path for later)
  useEffect(() => {
    setLoading(true);
    // const res = await axios.get(`${API_URL}/api/job-board/jobs/`, { params: { page: currentPage, tab: activeTab !== 'All' ? activeTab : undefined }});
    // setJobs(res.data.results);
    setJobs(dummyTutorRequests);
    setLoading(false);
  }, []);

  // Tab → internal mode mapping
  const tabToMode = (tab) => {
    if (tab === 'Home Tuition') return 'in_person';
    if (tab === 'Online Tuition') return 'online'; // your data uses "online"
    if (tab === 'Other Jobs') return 'other';
    return null; // All
  };

  const getJobTypeBadge = (job) => {
    if (job.teaching_mode === 'in_person') return 'Home Tuition';
    if (job.teaching_mode === 'online' || job.teaching_mode === 'remote')
      return 'Online Tuition';
    return 'Regular Job';
  };

  // Derived list: filter by tab + quick search
  const filteredJobs = useMemo(() => {
    const modeFilter = tabToMode(activeTab);

    return jobs.filter((job) => {
      // Tab filter
      const matchesTab = !modeFilter
        ? true
        : modeFilter === 'other'
        ? !['in_person', 'online'].includes(job.teaching_mode)
        : job.teaching_mode === modeFilter;

      if (!matchesTab) return false;

      // Subject filter (subject_display contains comma-separated list)
      const subjectOk =
        !searchSubject ||
        (job.subject_display || '')
          .toLowerCase()
          .includes(searchSubject.toLowerCase());

      // Mode filter (user may type "home"/"online")
      const modeText =
        job.teaching_mode === 'in_person' ? 'home' : job.teaching_mode;
      const modeOk =
        !searchMode ||
        (modeText || '').toLowerCase().includes(searchMode.toLowerCase());

      // Type filter (user can type "tuition" / "job")
      const badge = getJobTypeBadge(job);
      const typeOk =
        !searchType ||
        (badge || '').toLowerCase().includes(searchType.toLowerCase());

      return subjectOk && modeOk && typeOk;
    });
  }, [jobs, activeTab, searchSubject, searchMode, searchType]);

  // Pagination data derived from filtered jobs
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const currentSlice = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // reset page on search
  };

  const onTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // reset to first page on tab change
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Home Tuition':
        return 'bg-[#F5BB07] text-black hover:bg-[#F5BB07]/80';
      case 'Online Tuition':
        return 'bg-[#313D6A] text-white hover:bg-[#313D6A]/80';
      case 'Regular Job':
        return 'bg-green-600 text-white hover:bg-green-600/80';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCE0]">
      <div className="relative overflow-hidden bg-[#FFFCE0]">
        {/* Header Section */}
        <div
          className="relative overflow-hidden "
          style={{ backgroundColor: '#FFFCE0' }}
        >
          {/* Decorative circles */}
          <div className="absolute top-7 -left-10 w-32 h-32 rounded-full border-[16px] border-[#F5BB07]/60" />
          <div className="absolute top-20 right-0 w-40 h-40 rounded-full border-[16px] border-[#F5BB07]/60" />

          <div className="mx-auto py-8">
            <h1
              className="text-4xl md:text-5xl font-bold text-center mb-12"
              style={{ color: '#313D6A' }}
            >
              Job Board
            </h1>

            <div
              className="relative grid md:grid-cols-2 gap-8 py-8 w-full"
              style={{
                backgroundImage: `url(${HeroBg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Background overlay */}
              <div className="absolute z-0 inset-0 bg-[#313D6A]/85" />

              {/* Left: two CTA blocks */}
              <div className="space-y-6 z-10 flex flex-col justify-center px-4">
                <div className="text-center">
                  <div className="inline-block px-6 py-3 text-[#313D6A] bg-white font-semibold rounded-t-md">
                    For Student & Parents
                  </div>
                  <div className="flex w-full max-w-sm mx-auto text-lg justify-center bg-[#F5BB07] text-[#313D6A] font-semibold py-3 rounded-none rounded-b-xl">
                    Post Online/Home Tuition Job
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-block px-6 py-3 rounded-none rounded-t-md text-[#313D6A] bg-white font-semibold">
                    For Institutes/Organizations
                  </div>
                  <div className="flex w-full max-w-sm mx-auto text-lg justify-center bg-[#F5BB07] text-[#313D6A] font-semibold py-3 rounded-none rounded-b-xl">
                    Post Teaching/Other Jobs
                  </div>
                </div>
              </div>

              {/* Right: Quick Search */}
              <div className="p-8 z-10 rounded-lg flex items-center justify-center">
                <div className="w-full max-w-xl">
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">
                    QUICK SEARCH!
                    <div className="w-16 h-1 mx-auto mt-2" />
                  </h2>

                  <div className="space-y-4 flex flex-col items-center">
                    <Input
                      placeholder="Enter Any Subject"
                      value={searchSubject}
                      onChange={(e) => setSearchSubject(e.target.value)}
                      className="bg-white rounded-sm w-full h-12"
                    />
                    <Input
                      placeholder="Enter Study Mode (home / online)"
                      value={searchMode}
                      onChange={(e) => setSearchMode(e.target.value)}
                      className="bg-white rounded-sm w-full h-12"
                    />
                    <Input
                      placeholder="Tuition or Other Jobs"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="bg-white rounded-sm w-full h-12"
                    />
                    <Button
                      onClick={handleSearch}
                      className="py-3 font-semibold rounded-sm w-1/2 h-12 bg-[#F5BB07] hover:bg-[#F5BB07]/80"
                    >
                      Search Job
                    </Button>
                  </div>
                </div>
              </div>

              {/* Center divider (md+) */}
              <span className="hidden md:block absolute h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px bg-white z-20">
                <span className="absolute top-0 -right-1 w-2 h-2 bg-white rotate-45" />
                <span className="absolute bottom-0 -right-1 w-2 h-2 bg-white rotate-45" />
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="border-b-2 max-w-7xl mx-auto px-3 sm:px-0"
          style={{ borderColor: '#F5BB07' }}
        >
          <div className="container mx-auto px-4">
            <div className="flex space-x-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabClick(tab)}
                  className={`py-4 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#F5BB07] text-[#313D6A]'
                      : 'border-transparent text-gray-600 hover:text-[#313D6A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="container max-w-7xl mx-auto px-3 sm:px-0 pt-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl" style={{ color: '#313D6A' }}>
                Loading jobs...
              </div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentSlice.map((job) => (
                  <Card
                    key={job.id}
                    className="bg-white shadow-lg hover:shadow-xl transition-shadow h-full"
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Title + Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex-1">
                          {job?.title}
                        </h3>
                        <Button
                          className={`${getBadgeColor(
                            getJobTypeBadge(job),
                          )} rounded-sm`}
                        >
                          {getJobTypeBadge(job)}
                        </Button>
                      </div>

                      {/* Meta */}
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>Tuition ID: {job.id}</span>
                        <span>Posted {job.time_ago}</span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm text-[#313D6A]">
                        <div className="grid grid-cols-2">
                          <span className="font-semibold">Class</span>
                          <span>
                            {job?.course?.title?.includes('Standard')
                              ? job.course.title.replace('Standard ', '') + 'th'
                              : job?.course?.title}
                          </span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="font-semibold">Subject(s)</span>
                          <span>{job?.subject_display}</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="font-semibold">Days To Study</span>
                          <span>Friday, Saturday, & Sunday</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="font-semibold">Time to Study</span>
                          <span>3:00 PM To 6:00 PM</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="font-semibold">Tutor (Gender)</span>
                          <span>Female</span>
                        </div>
                        <div className="grid grid-cols-2">
                          <span className="font-semibold">Budget</span>
                          <span>{job?.budget_amount}</span>
                        </div>
                      </div>

                      {/* Actions pinned bottom */}
                      <div className="mt-auto flex gap-3 pt-6">
                        <Button
                          className="flex-1 font-semibold py-2 rounded-md"
                          style={{
                            backgroundColor:
                              getJobTypeBadge(job) === 'Home Tuition'
                                ? '#F5BB07'
                                : '#313D6A',
                            color:
                              getJobTypeBadge(job) === 'Home Tuition'
                                ? '#000'
                                : '#fff',
                          }}
                          onClick={() =>
                            router.push(`/job-board/job-details/${job.id}`)
                          }
                        >
                          View Details
                        </Button>
                        <Button
                          className="flex-1 font-semibold py-2 rounded-md"
                          style={{
                            backgroundColor:
                              getJobTypeBadge(job) === 'Home Tuition'
                                ? '#F5BB07'
                                : '#313D6A',
                            color:
                              getJobTypeBadge(job) === 'Home Tuition'
                                ? '#000'
                                : '#fff',
                          }}
                          onClick={() =>
                            router.push(`/job-board/apply?job_id=${job.id}`)
                          }
                        >
                          Apply Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {/* Pagination – circular arrows with center label */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 mt-4 mb-4">
                  {/* Prev */}
                  <button
                    aria-label="Previous page"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`
                    inline-flex items-center justify-center h-10 w-10 rounded-full
                    transition
                    ${
                      currentPage === 1
                        ? 'bg-[#F5BB07]/40 text-black/40 cursor-not-allowed'
                        : 'bg-[#F5BB07]/70 hover:bg-[#F5BB07]/90 text-black shadow-md'
                    }
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5BB07] p-3
                `}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  {/* Label */}
                  <span className="text-lg md:text-xl font-semibold text-[#313D6A]">
                    Page {currentPage} of {totalPages}
                  </span>

                  {/* Next */}
                  <button
                    aria-label="Next page"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`
                        inline-flex items-center justify-center h-10 w-10 rounded-full
                        transition
                        ${
                          currentPage === totalPages
                            ? 'bg-[#F5BB07]/40 text-black/40 cursor-not-allowed'
                            : 'bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black shadow-md'
                        }
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5BB07] p-3
                    `}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-xl" style={{ color: '#313D6A' }}>
                No Jobs Posted yet.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
