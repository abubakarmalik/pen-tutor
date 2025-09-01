"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Play, Clock, Users, Star, BookOpen, Video, Calendar, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import axios from "axios"

import CourseDetailBg from "@/assets/images/course-details/course-detail-bg.png"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [expandedSections, setExpandedSections] = useState({})

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const fetchCourseDetail = async () => {
    try {
      setLoading(true)

      const response = await axios.get(`${API_BASE}/api/courses/${courseId}/`)
      console.log("Course Detail:", response)

      if (response.status === 200) {
        setCourse(response.data)
      } else {
        throw new Error("Course not found")
      }
    } catch (error) {
      console.error("Error fetching course detail:", error)
      toast.error("Failed to load course details")
      setCourse(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail()
    }
  }, [courseId])

  const handleEnroll = async () => {
    try {
      if (!localStorage.getItem("access_token")) {
        toast.error("Please login to enroll in the course")
        return
      }

      const response = await axios.post(
        `${API_BASE}/api/students/courses/${courseId}/enroll/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )

      console.log("Enrollment Response:", response)

      if (response.status === 201) {
        setIsEnrolled(true)
        toast.success("Successfully enrolled in the course!")
      } else {
        throw new Error("Enrollment failed")
      }
    } catch (error) {
      console.error("Error enrolling in course:", error)
      toast.error("Failed to enroll in course")
    }
  }

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  // ---------- Helpers to adapt new API shape ----------
  const parseDurationToSeconds = (str) => {
    if (!str) return 0
    const parts = String(str).split(":").map((p) => parseInt(p || 0, 10))
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    if (parts.length === 1) return parts[0] * 60
    return 0
  }

  const formatSeconds = (secs) => {
    if (!secs) return "0:00"
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`
    return `${m}:${String(s).padStart(2, "0")}`
  }

  const getDerivedCourse = (c) => {
    if (!c) return {}

    const teacher = c.teacher || {}

    // rating and reviews mapped from teacher
    const rating = teacher.average_rating ?? 0
    const total_reviews = (teacher.feedbacks && teacher.feedbacks.length) || 0

    // learning outcomes fallback to topic titles
    const learningOutcomes = c.topics?.map((t) => t.title) || []

    // duration: sum durations from course.videos (if available)
    const totalSeconds = (c.videos || []).reduce((acc, v) => acc + parseDurationToSeconds(v.duration), 0)
    const durationStr = formatSeconds(totalSeconds)

    const total_sections = (c.topics && c.topics.length) || 0
    // const total_lessons = c.total_videos ??   (c.videos && c.videos.length) || 0
    const total_lessons = c.total_videos ?? ((c.videos && c.videos.length) || 0)

    // rating distribution derived from teacher.feedbacks (if present)
    const feedbacks = teacher.feedbacks || []
    const distCounts = [0, 0, 0, 0, 0]
    feedbacks.forEach((f) => {
      const r = Number(f.rating) || 0
      if (r >= 1 && r <= 5) distCounts[r - 1] += 1
    })
    const distTotal = feedbacks.length || 1
    const rating_distribution = distCounts.map((count, idx) => ({ stars: idx + 1, percentage: Math.round((count / distTotal) * 100) }))

    // sections adapted from topics
    const sections = (c.topics || []).map((topic) => {
      const videoLessons = (topic.videos || []).map((v) => ({
        id: v.id,
        title: v.title,
        type: "video",
        duration: v.duration || "",
      }))

      // placeholder quizzes/assignments based on counts (no detailed objects in topic)
      const quizLessons = Array.from({ length: topic.quiz_count || 0 }).map((_, i) => ({
        id: `q-${topic.id}-${i}`,
        title: `Quiz ${i + 1}`,
        type: "quiz",
        duration: "",
      }))

      const assignmentLessons = Array.from({ length: topic.assignment_count || 0 }).map((_, i) => ({
        id: `a-${topic.id}-${i}`,
        title: `Assignment ${i + 1}`,
        type: "assignment",
        duration: "",
      }))

      const lessons = [...videoLessons, ...quizLessons, ...assignmentLessons]

      const topicSeconds = (topic.videos || []).reduce((acc, v) => acc + parseDurationToSeconds(v.duration), 0)

      return {
        id: topic.id,
        title: topic.title,
        total_lessons: (topic.video_count || 0) + (topic.quiz_count || 0) + (topic.assignment_count || 0),
        total_attachments: 0,
        assignments: Array.from({ length: topic.assignment_count || 0 }),
        lessons,
        duration: formatSeconds(topicSeconds),
      }
    })

    // other_courses fallback to teacher.courses_created
    const other_courses = teacher.courses_created || []

    // reviews fallback to teacher.feedbacks (structure adapted)
    const reviews = (teacher.feedbacks || []).map((f) => ({
      id: f.id,
      studentName: `${f.user?.first_name || ""} ${f.user?.last_name || ""}`.trim() || f.user?.username || "Student",
      rating: f.rating,
      feedback_text: f.feedback_text,
      response_date: f.created_at,
      instructor_response: null,
    }))

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
    }
  }

  const derived = getDerivedCourse(course)

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
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center py-12 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
            <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Hero Section */}
      <div className="text-white relative overflow-hidden py-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${course.thumbnail || CourseDetailBg.src})` }}
      >
        <div className="absolute inset-0 bg-[#313D6A]/80 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">{derived.title}</h1>

              <p className="text-lg text-gray-200 mb-6">{derived.description || course.description}</p>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-[#F5BB07] fill-current" />
                  <span className="font-semibold">{derived.rating}</span>
                  <span className="text-gray-300">Instructor Rating</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-[#F5BB07]">({derived.total_reviews} Reviews)</span>
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">{derived.total_enrollments ?? course.total_enrollments}</span> Students
                </div>
              </div>

              <div className="mb-6">
                <span className="text-gray-300">Language: </span>
                <span className="font-semibold">{course.language || "English"}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold px-6 py-2 text-sm"
                  onClick={handleEnroll}
                  disabled={isEnrolled}
                >
                  {isEnrolled ? "Enrolled" : "Add To Cart"}
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
                  src={course.thumbnail || CourseDetailBg.src || "/placeholder.svg"}
                  alt="Course preview"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg"
                />
                {course.discount_percentage && <div className="absolute top-4 right-4 bg-white text-[#313D6A] px-3 py-1 rounded-full text-sm font-semibold">
                  {course.discount_percentage}% off
                </div>}
                <div className="mt-4 text-right">
                  <div className="text-2xl font-bold">{course.course_type === "free" ? "Free" : course.price}</div>
                  {course.discount_percentage && <div className="text-sm text-gray-300">
                    <span className="text-[#F5BB07]">{course.days_left}</span> Days
                  </div>}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-[#313D6A] text-xl">This Course Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-[#313D6A]" />
                    <span>{course.total_videos} Latest Recorder Lectures</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#313D6A]" />
                    <span>Life Time Access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-[#313D6A]" />
                    <span>Mobile & Web View</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#313D6A]" />
                    <span>{course.assignments?.length ?? 0} Assignments</span>
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <CheckCircle className="h-5 w-5 text-[#313D6A]" />
                    <span>Certificate On Completion</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold"
                  onClick={handleEnroll}
                  disabled={isEnrolled}
                >
                  {isEnrolled ? "Enrolled" : "Add To Cart"}
                </Button>
              </CardContent>
            </Card>

            {/* Things You Will Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#313D6A] text-xl">Things You Will Learn in this Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {derived.learningOutcomes?.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-[#F5BB07] font-bold text-lg">{index + 1}.</span>
                      <span className={index % 2 === 1 ? "text-[#F5BB07]" : "text-gray-700"}>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Details & Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#313D6A] text-xl">Course Details & Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{course.description}</p>

                <p className="text-gray-600 leading-relaxed">{course.requirements || "No specific requirements."}</p>
              </CardContent>
            </Card>

            {/* Course Contents */}
            <Card>
              <CardHeader className="bg-[#313D6A] text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Course Contents</CardTitle>
                    <p className="text-gray-200 text-sm mt-1">
                      {derived.total_sections} Sections, {derived.total_lessons} Lectures, {derived.duration} total length
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#F5BB07] text-[#F5BB07] hover:bg-[#F5BB07] hover:text-black bg-transparent"
                  >
                    Expand All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {derived.sections?.map((section) => (
                    <div key={section.id} className="border-b border-gray-200">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {expandedSections[section.id] ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="font-medium text-left">{section.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {section.total_lessons} Lectures. {section.total_attachments} attachment. {section.assignments.length} assignment. {section.duration}
                        </span>
                      </button>
                      {expandedSections[section.id] && (
                        <div className="px-6 pb-4 bg-gray-50">
                          <div className="space-y-2 ml-7">
                            {section.lessons?.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2">
                                  {lesson.type === "video" && <Play className="h-4 w-4 text-gray-400" />}
                                  {lesson.type === "quiz" && <BookOpen className="h-4 w-4 text-gray-400" />}
                                  {lesson.type === "assignment" && <Calendar className="h-4 w-4 text-gray-400" />}
                                  <span className="text-sm">{lesson.title}</span>
                                </div>
                                <span className="text-xs text-gray-500">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="px-6 py-4 text-center">
                    <Button
                      variant="outline"
                      className="text-[#313D6A] border-[#313D6A] hover:bg-[#313D6A] hover:text-white bg-transparent"
                    >
                      {derived.total_sections - (derived.sections?.length || 0)} More Sections
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#313D6A] text-xl">Student Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-[#313D6A] mb-2">{derived.rating}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-[#F5BB07] fill-current" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">Course Rating</div>
                  </div>

                  <div className="space-y-2">
                    {derived.rating_distribution?.map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating.stars ? "text-[#F5BB07] fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#F5BB07] h-2 rounded-full"
                            style={{ width: `${rating.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{rating.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="mt-8 space-y-6">
                  {derived.reviews?.map((review) => (
                    <div key={review.id} className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gray-200">{(review.studentName || " ").charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{review.studentName}</h4>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-[#F5BB07] fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.feedback_text}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#313D6A]">
                            👍
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#313D6A]">
                            👎
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#313D6A]">
                            Report
                          </Button>
                        </div>

                        {/* Instructor Response */}
                        {review.instructor_response && (
                          <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
                            <div className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-[#313D6A] text-white text-xs">I</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {course.teacher?.first_name} {course.teacher?.last_name}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    Instructor Response
                                  </Badge>
                                  <span className="text-xs text-gray-500">{review.response_date}</span>
                                </div>
                                <p className="text-sm text-gray-600">{review.instructor_response}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* More Courses By Instructor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#313D6A] text-xl">
                  More Courses By{" "}
                  <span className="text-[#F5BB07]">
                    {course.teacher?.first_name} {course.teacher?.last_name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {derived.other_courses?.map((courseItem) => (
                    <div
                      key={courseItem.id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={courseItem.thumbnail || "/placeholder.svg"}
                        alt="Course thumbnail"
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <Badge className="bg-green-100 text-green-800 text-xs mb-2">{courseItem.subject}</Badge>
                        <h3 className="font-semibold text-sm mb-2">{courseItem.title}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 text-[#F5BB07] fill-current" />
                          <span className="text-sm font-medium">{courseItem.rating}</span>
                          <span className="text-xs text-gray-500">({courseItem.total_reviews})</span>
                          <span className="text-xs text-gray-500 ml-auto">{courseItem.total_enrollments} Students</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{courseItem.duration}</span>
                          <span>{courseItem.total_lessons} Lectures</span>
                          <span>{courseItem.level}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {course.teacher?.first_name.charAt(0)}
                                {course.teacher?.last_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">
                              {course.teacher?.first_name} {course.teacher?.last_name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-pink-600">{courseItem.price}</div>
                            <div className="text-xs text-gray-500">{courseItem.discount_price}</div>
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
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-[#313D6A] mb-2">
                      {course.course_type === "free" ? "Free" : course.price}
                    </div>
                    {/* {course.course_type === "paid" && (
                      <p className="text-sm text-gray-600">
                        <span className="text-[#F5BB07]">{course.days_left}</span> Days left at this price
                      </p>
                    )} */}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{derived.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Lectures</span>
                      <span className="font-medium">{derived.total_lessons}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Assignments</span>
                      <span className="font-medium">{course.assignments?.length ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Students</span>
                      <span className="font-medium">{course.total_enrollments}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Language</span>
                      <span className="font-medium">{course.language || "English"}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mb-3 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold"
                    onClick={handleEnroll}
                    disabled={isEnrolled}
                  >
                    {isEnrolled ? "Enrolled" : "Add To Cart"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white bg-transparent"
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>

              {/* Instructor Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[#313D6A] mb-4">Instructor</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={course.teacher?.profile_picture || course.teacher?.profile_picture || "/placeholder.svg"}
                        alt={course.teacher?.first_name}
                      />
                      <AvatarFallback>{course.teacher?.first_name?.charAt(0) || "I"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">
                        {course.teacher?.first_name} {course.teacher?.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">{course.teacher?.bio}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#F5BB07] fill-current" />
                      <span>{course.teacher?.average_rating} Instructor Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{course.teacher?.total_students} Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span>{course.teacher?.total_courses} Courses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
