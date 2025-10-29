'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Video,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { dummyCourses } from '../../dummyCourses';

import CourseDetailBg from '@/assets/images/course-details/course-detail-bg.png';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);

      // Use dummy data for now
      const foundCourse = dummyCourses.find((c) => c.id === parseInt(courseId));

      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        throw new Error('Course not found');
      }
    } catch (error) {
      console.error('Error fetching course detail:', error);
      toast.error('Failed to load course details');
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      if (!localStorage.getItem('access_token')) {
        toast.error('Please login to enroll in the course');
        return;
      }

      const response = await axios.post(
        `${API_BASE}/api/students/courses/${courseId}/enroll/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );

      console.log('Enrollment Response:', response);

      if (response.status === 201) {
        setIsEnrolled(true);
        toast.success('Successfully enrolled in the course!');
      } else {
        throw new Error('Enrollment failed');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // ---------- Helpers to adapt new API shape ----------
  const parseDurationToSeconds = (str) => {
    if (!str) return 0;
    const parts = String(str)
      .split(':')
      .map((p) => parseInt(p || 0, 10));
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0] * 60;
    return 0;
  };

  const formatSeconds = (secs) => {
    if (!secs) return '0m';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const getDerivedCourse = (c) => {
    if (!c) return {};

    const teacher = c.teacher || {};
    const rating = teacher.average_rating ?? 0;
    const total_reviews = (teacher.feedbacks && teacher.feedbacks.length) || 0;

    // Calculate total duration from all topics
    let totalSeconds = 0;
    (c.topics || []).forEach((topic) => {
      (topic.videos || []).forEach((v) => {
        totalSeconds += parseDurationToSeconds(v.duration);
      });
    });
    const durationStr = formatSeconds(totalSeconds);

    const total_sections = (c.topics && c.topics.length) || 0;

    // Calculate total lessons from topics
    let total_lessons = 0;
    (c.topics || []).forEach((topic) => {
      total_lessons +=
        (topic.video_count || 0) +
        (topic.quiz_count || 0) +
        (topic.assignment_count || 0);
    });

    // Learning outcomes from topics
    const learningOutcomes =
      c.topics?.map(
        (t, idx) =>
          `Master ${t.title.toLowerCase()} with ${
            t.video_count
          } comprehensive video lessons`,
      ) || [];

    // Rating distribution from feedbacks
    const feedbacks = teacher.feedbacks || [];
    const distCounts = [0, 0, 0, 0, 0];
    feedbacks.forEach((f) => {
      const r = Number(f.rating) || 0;
      if (r >= 1 && r <= 5) distCounts[r - 1] += 1;
    });
    const distTotal = feedbacks.length || 1;
    const rating_distribution = distCounts.map((count, idx) => ({
      stars: 5 - idx, // Reverse order for display
      percentage: Math.round((count / distTotal) * 100),
    }));

    // Sections from topics
    const sections = (c.topics || []).map((topic) => {
      const videoLessons = (topic.videos || []).map((v) => ({
        id: v.id,
        title: v.title,
        type: 'video',
        duration: v.duration || '0:00',
      }));

      const quizLessons = Array.from({ length: topic.quiz_count || 0 }).map(
        (_, i) => ({
          id: `quiz-${topic.id}-${i}`,
          title: `Quiz ${i + 1}`,
          type: 'quiz',
          duration: '10m',
        }),
      );

      const assignmentLessons = Array.from({
        length: topic.assignment_count || 0,
      }).map((_, i) => ({
        id: `assign-${topic.id}-${i}`,
        title: `Assignment ${i + 1}`,
        type: 'assignment',
        duration: '',
      }));

      const lessons = [...videoLessons, ...quizLessons, ...assignmentLessons];

      const topicSeconds = (topic.videos || []).reduce(
        (acc, v) => acc + parseDurationToSeconds(v.duration),
        0,
      );

      return {
        id: topic.id,
        title: topic.title,
        total_lessons: lessons.length,
        total_attachments: 0,
        assignments: assignmentLessons,
        lessons,
        duration: formatSeconds(topicSeconds),
      };
    });

    const other_courses = teacher.courses_created || [];

    const reviews = (teacher.feedbacks || []).map((f) => ({
      id: f.id,
      studentName:
        `${f.user?.first_name || ''} ${f.user?.last_name || ''}`.trim() ||
        f.user?.username ||
        'Anonymous',
      rating: f.rating,
      feedback_text: f.feedback_text,
      response_date: new Date(f.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      instructor_response: null,
    }));

    return {
      ...c,
      rating,
      total_reviews,
      learningOutcomes,
      duration: durationStr,
      total_sections,
      total_lessons,
      rating_distribution,
      sections,
      other_courses,
      reviews,
    };
  };

  const derived = getDerivedCourse(course);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="animate-pulse max-w-7xl mx-auto">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-12 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Course not found
            </h2>
            <p className="text-gray-600 mb-4">
              The course you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push('/courses')}>
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Hero Section */}
      <div
        className="text-white relative overflow-hidden py-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${course.thumbnail || CourseDetailBg.src})`,
        }}
      >
        <div className="absolute inset-0 bg-[#313D6A]/80 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                {derived.title}
              </h1>

              <p className="text-lg text-gray-200 mb-6">
                {derived.description || course.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-[#F5BB07] fill-current" />
                  <span className="font-semibold">
                    {derived.rating?.toFixed(1)}
                  </span>
                  <span className="text-gray-200">Instructor Rating</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-[#F5BB07]">
                    ({derived.total_reviews}{' '}
                    {derived.total_reviews === 1 ? 'Review' : 'Reviews'})
                  </span>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">
                    {(
                      derived.total_enrollments ?? course.total_enrollments
                    )?.toLocaleString()}
                  </span>{' '}
                  Students Enrolled
                </div>
              </div>

              <div className="mb-6">
                <span className="text-gray-300">Created by: </span>
                <span className="font-semibold">
                  {course.teacher?.first_name} {course.teacher?.last_name}
                </span>
                <span className="text-gray-300 ml-4">Language: </span>
                <span className="font-semibold">
                  {course.language || 'English'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold px-6 py-2 text-sm"
                  onClick={handleEnroll}
                  disabled={isEnrolled}
                >
                  {isEnrolled ? 'Enrolled' : 'Add To Cart'}
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#313D6A] px-6 py-2 text-sm bg-transparent"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <img
                  src={
                    course.thumbnail || CourseDetailBg.src || '/placeholder.svg'
                  }
                  alt="Course preview"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg"
                />
                {course.discount_percentage && (
                  <div className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-lg text-base font-bold shadow-lg">
                    {course.discount_percentage}% OFF
                  </div>
                )}
                <div className="mt-4 text-right">
                  <div className="flex items-baseline justify-end gap-2">
                    <div className="text-3xl font-bold">
                      {course.course_type === 'free' ? 'Free' : course.price}
                    </div>
                    {course.discount_price && course.course_type !== 'free' && (
                      <div className="text-lg text-gray-300 line-through">
                        {course.discount_price}
                      </div>
                    )}
                  </div>
                  {course.discount_percentage && course.days_left && (
                    <div className="text-sm text-gray-200 mt-2">
                      <span className="bg-red-500 px-2 py-1 rounded text-white font-semibold">
                        {course.days_left}{' '}
                        {course.days_left === 1 ? 'Day' : 'Days'} Left
                      </span>{' '}
                      at this price!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* This Course Includes */}
            <Card className="shadow border-t-4 border-t-[#F5BB07]">
              <CardHeader className="bg-gradient-to-r from-[#313D6A] to-[#4a5a94] text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  This Course Includes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-[#313D6A] p-2 rounded-lg">
                      <Video className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#313D6A]">
                        {course.total_videos}
                      </div>
                      <div className="text-sm text-gray-600">
                        Video Lectures
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-[#313D6A] p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#313D6A]">
                        {derived.duration}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Duration
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-[#313D6A] p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#313D6A]">
                        Lifetime
                      </div>
                      <div className="text-sm text-gray-600">Access</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-[#313D6A] p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#313D6A]">
                        {course.assignments?.length ?? 0}
                      </div>
                      <div className="text-sm text-gray-600">Assignments</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors sm:col-span-2">
                    <div className="bg-[#313D6A] p-2 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#313D6A]">
                        Certificate of Completion
                      </div>
                      <div className="text-sm text-gray-600">
                        Downloadable certificate upon finishing
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button
                    className="flex-1 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold py-3 text-base shadow-md hover:shadow-lg transition-all"
                    onClick={handleEnroll}
                    disabled={isEnrolled}
                  >
                    {isEnrolled ? '✓ Enrolled' : 'Add To Cart'}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white font-semibold py-3 text-base transition-all"
                  >
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Things You Will Learn */}
            <Card className="shadow border-t-4 border-t-[#F5BB07]">
              <CardHeader className="bg-gradient-to-r from-[#313D6A] to-[#4a5a94] text-white">
                <CardTitle className="text-2xl">
                  What You'll Learn in This Course
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {derived.learningOutcomes?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="bg-[#F5BB07] text-black font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Details & Requirements */}
            <Card className="shadow border-t-4 border-t-[#F5BB07]">
              <CardHeader className="bg-gradient-to-r from-[#313D6A] to-[#4a5a94] text-white">
                <CardTitle className="text-2xl">
                  Course Details & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#313D6A] mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-[#313D6A] mb-3">
                    Requirements
                  </h3>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#F5BB07] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 leading-relaxed">
                      {course.requirements ||
                        'No specific requirements needed to get started.'}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-[#313D6A] mb-3">
                    Course Level
                  </h3>
                  <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
                    {course.level || 'All Levels'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Course Contents */}
            <Card className="shadow border-t-4 border-t-[#F5BB07]">
              <CardHeader className="bg-gradient-to-r from-[#313D6A] to-[#4a5a94] text-white rounded-t-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Course Curriculum
                    </CardTitle>
                    <p className="text-gray-200 text-sm">
                      {derived.total_sections} Sections •{' '}
                      {derived.total_lessons} Lectures • {derived.duration}{' '}
                      total
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-white text-white hover:bg-white hover:text-[#313D6A] bg-transparent font-semibold"
                    onClick={() => {
                      const allExpanded =
                        Object.keys(expandedSections).length ===
                        derived.sections?.length;
                      if (allExpanded) {
                        setExpandedSections({});
                      } else {
                        const newExpanded = {};
                        derived.sections?.forEach(
                          (s) => (newExpanded[s.id] = true),
                        );
                        setExpandedSections(newExpanded);
                      }
                    }}
                  >
                    {Object.keys(expandedSections).length ===
                    derived.sections?.length
                      ? 'Collapse All'
                      : 'Expand All'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {derived.sections?.map((section, idx) => (
                    <div key={section.id} className="border-b border-gray-200">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="bg-[#313D6A] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold group-hover:bg-[#F5BB07] group-hover:text-black transition-colors">
                            {idx + 1}
                          </div>
                          <div className="text-left">
                            <span className="font-semibold text-[#313D6A] block">
                              {section.title}
                            </span>
                            <span className="text-sm text-gray-500">
                              {section.total_lessons} Lectures •{' '}
                              {section.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {section.assignments.length > 0 && (
                            <Badge className="bg-[#F5BB07] text-black">
                              {section.assignments.length} Assignment
                              {section.assignments.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {expandedSections[section.id] ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      {expandedSections[section.id] && (
                        <div className="px-6 pb-4 bg-gray-50">
                          <div className="space-y-1 ml-14">
                            {section.lessons?.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0 hover:bg-white px-3 rounded transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded ${
                                      lesson.type === 'video'
                                        ? 'bg-blue-100'
                                        : lesson.type === 'quiz'
                                        ? 'bg-purple-100'
                                        : 'bg-orange-100'
                                    }`}
                                  >
                                    {lesson.type === 'video' && (
                                      <Play className="h-4 w-4 text-blue-600" />
                                    )}
                                    {lesson.type === 'quiz' && (
                                      <BookOpen className="h-4 w-4 text-purple-600" />
                                    )}
                                    {lesson.type === 'assignment' && (
                                      <Calendar className="h-4 w-4 text-orange-600" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-700 block">
                                      {lesson.title}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">
                                      {lesson.type}
                                    </span>
                                  </div>
                                </div>
                                {lesson.duration && (
                                  <span className="text-sm text-gray-500 font-medium">
                                    {lesson.duration}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Feedback */}
            <Card className="shadow border-t-4 border-t-[#F5BB07]">
              <CardHeader className="bg-gradient-to-r from-[#313D6A] to-[#4a5a94] text-white">
                <CardTitle className="text-2xl">Student Feedback</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
                  <div className="text-center bg-gradient-to-br from-[#313D6A] to-[#4a5a94] text-white p-6 rounded-xl">
                    <div className="text-6xl font-bold mb-2">
                      {derived.rating?.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${
                            i < Math.round(derived.rating)
                              ? 'text-[#F5BB07] fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm">
                      Course Rating ({derived.total_reviews}{' '}
                      {derived.total_reviews === 1 ? 'Review' : 'Reviews'})
                    </div>
                  </div>

                  <div className="space-y-3">
                    {derived.rating_distribution?.map((rating) => (
                      <div
                        key={rating.stars}
                        className="flex items-center gap-3"
                      >
                        <div className="flex items-center gap-1 w-24">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.stars
                                  ? 'text-[#F5BB07] fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-[#F5BB07] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${rating.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-12 text-right">
                          {rating.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#313D6A] mb-4">
                    Recent Reviews
                  </h3>
                  {derived.reviews?.map((review) => (
                    <div
                      key={review.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Avatar className="h-12 w-12 border-2 border-[#313D6A]">
                        <AvatarFallback className="bg-[#313D6A] text-white font-semibold">
                          {(review.studentName || ' ').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-semibold text-[#313D6A]">
                            {review.studentName}
                          </h4>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-[#F5BB07] fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {review.response_date}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                          {review.feedback_text}
                        </p>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-[#313D6A] hover:bg-gray-200 text-xs"
                          >
                            👍 Helpful
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-600 hover:bg-gray-200 text-xs"
                          >
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* More Courses By Instructor */}
            <Card className="shadow border-t-4 border-t-[#F5BB07]">
              <CardHeader className="bg-gradient-to-r from-[#313D6A] to-[#4a5a94] text-white">
                <CardTitle className="text-2xl">
                  More Courses By{' '}
                  <span className="text-[#F5BB07]">
                    {course.teacher?.first_name} {course.teacher?.last_name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {derived.other_courses?.map((courseItem) => (
                    <div
                      key={courseItem.id}
                      className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#F5BB07] transition-all cursor-pointer group"
                    >
                      <div className="relative">
                        <img
                          src={courseItem.thumbnail || '/placeholder.svg'}
                          alt="Course thumbnail"
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 left-3 bg-[#313D6A] text-white border-none">
                          {courseItem.subject}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base mb-3 text-[#313D6A] line-clamp-2 group-hover:text-[#F5BB07] transition-colors">
                          {courseItem.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-[#F5BB07] fill-current" />
                            <span className="text-sm font-semibold">
                              {courseItem.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({courseItem.total_reviews?.toLocaleString()})
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {courseItem.total_enrollments?.toLocaleString()}{' '}
                            students
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {courseItem.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            {courseItem.total_lessons} lectures
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {courseItem.level}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-gray-300">
                              <AvatarImage
                                src={course.teacher?.profile_picture}
                              />
                              <AvatarFallback className="text-xs bg-[#313D6A] text-white">
                                {course.teacher?.first_name?.charAt(0)}
                                {course.teacher?.last_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">
                              {course.teacher?.first_name}{' '}
                              {course.teacher?.last_name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-bold text-[#313D6A]">
                              {courseItem.price}
                            </div>
                            {courseItem.discount_price && (
                              <div className="text-xs text-gray-400 line-through">
                                {courseItem.discount_price}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Course Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Course Overview Card */}
              <Card className="shadow border-t-4 border-t-[#F5BB07]">
                <CardContent className="p-6">
                  <div className="text-center mb-6 pb-6 border-b">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <div className="text-4xl font-bold text-[#313D6A]">
                        {course.course_type === 'free' ? 'Free' : course.price}
                      </div>
                      {course.discount_price &&
                        course.course_type !== 'free' && (
                          <div className="text-xl text-gray-400 line-through">
                            {course.discount_price}
                          </div>
                        )}
                    </div>
                    {course.discount_percentage && course.days_left && (
                      <Badge className="bg-red-500 text-white text-sm">
                        {course.discount_percentage}% OFF • {course.days_left}{' '}
                        {course.days_left === 1 ? 'Day' : 'Days'} Left!
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Duration</span>
                      </div>
                      <span className="font-semibold text-[#313D6A]">
                        {derived.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Video className="h-4 w-4" />
                        <span>Lectures</span>
                      </div>
                      <span className="font-semibold text-[#313D6A]">
                        {derived.total_lessons}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Assignments</span>
                      </div>
                      <span className="font-semibold text-[#313D6A]">
                        {course.assignments?.length ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>Students</span>
                      </div>
                      <span className="font-semibold text-[#313D6A]">
                        {course.total_enrollments?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        <span>Language</span>
                      </div>
                      <span className="font-semibold text-[#313D6A]">
                        {course.language || 'English'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-bold py-3 text-base shadow-lg hover:shadow-xl transition-all"
                      onClick={handleEnroll}
                      disabled={isEnrolled}
                    >
                      {isEnrolled ? '✓ Already Enrolled' : 'Add To Cart'}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-2 border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white font-semibold py-3 text-base transition-all"
                    >
                      Buy Now
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t text-center text-xs text-gray-500">
                    30-Day Money-Back Guarantee
                  </div>
                </CardContent>
              </Card>

              {/* Instructor Card */}
              <Card className="shadow border-t-4 border-t-[#F5BB07]">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-[#313D6A] mb-4">
                    About The Instructor
                  </h3>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <Avatar className="h-16 w-16 border-2 border-[#313D6A]">
                      <AvatarImage
                        src={
                          course.teacher?.profile_picture || '/placeholder.svg'
                        }
                        alt={course.teacher?.first_name}
                      />
                      <AvatarFallback className="bg-[#313D6A] text-white font-bold text-lg">
                        {course.teacher?.first_name?.charAt(0) || 'I'}
                        {course.teacher?.last_name?.charAt(0) || 'N'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#313D6A]">
                        {course.teacher?.first_name} {course.teacher?.last_name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        @{course.teacher?.username}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {course.teacher?.bio}
                  </p>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-[#F5BB07] fill-current" />
                        <span className="text-sm text-gray-600">Rating</span>
                      </div>
                      <span className="font-semibold text-[#313D6A]">
                        {course.teacher?.average_rating?.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Students</span>
                      </div>
                      <span className="font-semibold text-[#313D6A]">
                        {course.teacher?.total_students?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Courses</span>
                      </div>
                      <span className="font-semibold text-[#313D6A]">
                        {course.teacher?.total_courses}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
