'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Users,
  Play,
  Search,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import OurCoursesImage from '@/assets/images/our-courses/our-courses-hero.png';
import Image from 'next/image';
import { dummyCourses } from './dummyCourses';

export default function CoursesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(0);
  const coursesPerPage = 9;

  // Get unique subjects and levels from courses
  const subjects = useMemo(() => {
    const uniqueSubjects = [...new Set(dummyCourses.map((c) => c.subject))];
    return uniqueSubjects.sort();
  }, []);

  const levels = useMemo(() => {
    const uniqueLevels = [...new Set(dummyCourses.map((c) => c.level))];
    return uniqueLevels.sort();
  }, []);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = [...dummyCourses];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.subject.toLowerCase().includes(query) ||
          `${course.teacher.first_name} ${course.teacher.last_name}`
            .toLowerCase()
            .includes(query),
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((course) => course.course_type === filterType);
    }

    // Apply level filter
    if (filterLevel !== 'all') {
      filtered = filtered.filter((course) => course.level === filterLevel);
    }

    // Apply subject filter
    if (filterSubject !== 'all') {
      filtered = filtered.filter((course) => course.subject === filterSubject);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (
            (b.teacher.average_rating || 0) - (a.teacher.average_rating || 0)
          );
        case 'students':
          return b.total_enrollments - a.total_enrollments;
        case 'price':
          if (a.course_type === 'free' && b.course_type !== 'free') return -1;
          if (a.course_type !== 'free' && b.course_type === 'free') return 1;
          const priceA = parseFloat(a.price?.replace('$', '') || '0');
          const priceB = parseFloat(b.price?.replace('$', '') || '0');
          return priceA - priceB;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, filterType, filterLevel, filterSubject, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedCourses.length / coursesPerPage,
  );
  const paginatedCourses = useMemo(() => {
    const startIndex = currentPage * coursesPerPage;
    return filteredAndSortedCourses.slice(
      startIndex,
      startIndex + coursesPerPage,
    );
  }, [filteredAndSortedCourses, currentPage]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, filterType, filterLevel, filterSubject, sortBy]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCourseClick = (courseId) => {
    router.push(`/courses/details/${courseId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Calculate duration from videos
  const calculateDuration = (course) => {
    if (!course.topics || course.topics.length === 0) return '0h 0m';

    let totalSeconds = 0;
    course.topics.forEach((topic) => {
      if (topic.videos) {
        topic.videos.forEach((video) => {
          const parts = video.duration.split(':').map((p) => parseInt(p || 0));
          if (parts.length === 3) {
            totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
          }
        });
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Calculate total lectures
  const calculateLectures = (course) => {
    if (!course.topics || course.topics.length === 0)
      return course.total_videos || 0;

    return course.topics.reduce((acc, topic) => {
      return acc + (topic.video_count || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#313D6A]/5 via-[#F5BB07]/5 to-[#313D6A]/5 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#F5BB07]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#313D6A]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Section */}
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md mb-4">
                <TrendingUp className="w-4 h-4 text-[#F5BB07]" />
                <span className="text-sm font-medium text-[#313D6A]">
                  {filteredAndSortedCourses.length} Courses Available
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#313D6A] leading-tight">
                Discover Your
                <span className="block text-[#F5BB07]">Perfect Course</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                Explore our comprehensive collection of courses taught by
                industry experts. Start learning today!
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto lg:mx-0">
                <div className="bg-white rounded-2xl md:rounded-full px-4 md:px-6 py-4 md:py-5 shadow-xl border border-[#F5BB07]/20">
                  <form
                    onSubmit={handleSearch}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Search courses, instructors, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-3 text-base border-0 bg-gray-50 rounded-full focus:ring-2 focus:ring-[#F5BB07]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="rounded-full px-8 py-3 text-base font-semibold bg-gradient-to-r from-[#313D6A] to-[#1e2847] hover:from-[#1e2847] hover:to-[#313D6A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Search className="w-5 h-5 sm:mr-2" />
                      <span className="hidden sm:inline">Search</span>
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Section (Image) */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#F5BB07]/20 rounded-full blur-3xl" />
                <Image
                  src={OurCoursesImage}
                  width={600}
                  height={600}
                  alt="Person learning online"
                  className="relative max-w-xs sm:max-w-md lg:max-w-lg w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <div className="top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[160px] bg-white border-gray-300 hover:border-[#F5BB07] focus:ring-[#F5BB07]">
                  <Filter className="h-4 w-4 mr-2 text-[#313D6A]" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="free">Free Courses</SelectItem>
                  <SelectItem value="paid">Paid Courses</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-full sm:w-[160px] bg-white border-gray-300 hover:border-[#F5BB07] focus:ring-[#F5BB07]">
                  <BookOpen className="h-4 w-4 mr-2 text-[#313D6A]" />
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-300 hover:border-[#F5BB07] focus:ring-[#F5BB07]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[160px] bg-white border-gray-300 hover:border-[#F5BB07] focus:ring-[#F5BB07]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="students">Most Popular</SelectItem>
                  <SelectItem value="price">Price (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode & Results */}
            <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
              <span className="text-sm font-medium text-gray-600">
                Showing {paginatedCourses.length} of{' '}
                {filteredAndSortedCourses.length} courses
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg ${
                    viewMode === 'grid'
                      ? 'bg-[#313D6A] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg ${
                    viewMode === 'list'
                      ? 'bg-[#313D6A] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {paginatedCourses.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterLevel('all');
                  setFilterSubject('all');
                }}
                className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] font-semibold"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {paginatedCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="cursor-pointer hover:shadow transition-all duration-300 group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#F5BB07]/50"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3">
                        <Badge className="text-xs px-3 py-1 rounded-full text-white font-semibold shadow-lg backdrop-blur-sm bg-[#313D6A]/90">
                          {course.subject}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge
                          className="text-xs px-3 py-1 rounded-full font-semibold shadow-lg backdrop-blur-sm"
                          style={{
                            backgroundColor:
                              course.course_type === 'free'
                                ? '#4CAF50'
                                : '#F5BB07',
                            color:
                              course.course_type === 'free'
                                ? 'white'
                                : '#313D6A',
                          }}
                        >
                          {course.course_type === 'free'
                            ? 'FREE'
                            : course.price}
                        </Badge>
                      </div>

                      {/* Level Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className="text-xs px-3 py-1 rounded-full bg-white/90 text-[#313D6A] font-medium shadow-md">
                          {course.level}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg mb-3 line-clamp-2 text-[#313D6A] group-hover:text-[#F5BB07] transition-colors min-h-[3.5rem]">
                        {course.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 fill-[#F5BB07] text-[#F5BB07]" />
                          <span className="font-semibold text-[#313D6A]">
                            {course.teacher.average_rating}
                          </span>
                          <span className="text-gray-400">
                            ({course.teacher.feedbacks?.length || 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-[#313D6A]" />
                          <span className="font-medium">
                            {course.total_enrollments.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4 text-[#313D6A]" />
                          <span>{calculateDuration(course)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Play className="h-4 w-4 text-[#313D6A]" />
                          <span>{calculateLectures(course)} Lectures</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <img
                            src={course.teacher.profile_picture}
                            alt={course.teacher.first_name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                              Instructor
                            </span>
                            <span className="text-sm font-semibold text-[#313D6A] leading-tight">
                              {course.teacher.first_name}{' '}
                              {course.teacher.last_name}
                            </span>
                          </div>
                        </div>
                        {course.discount_percentage && (
                          <div className="text-right">
                            <div className="text-xs text-gray-400 line-through">
                              {course.discount_price}
                            </div>
                            <div className="text-sm font-bold text-[#4CAF50]">
                              {course.discount_percentage}% OFF
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6 mt-12">
                  <div className="flex justify-center items-center gap-4">
                    <Button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <span className="text-[#313D6A] font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </span>

                    <Button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages - 1}
                      className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Pagination Info */}
                  <div className="text-center text-sm text-gray-600">
                    Showing {currentPage * coursesPerPage + 1} -{' '}
                    {Math.min(
                      (currentPage + 1) * coursesPerPage,
                      filteredAndSortedCourses.length,
                    )}{' '}
                    of {filteredAndSortedCourses.length} courses
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
