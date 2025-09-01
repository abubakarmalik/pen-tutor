"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Eye, Users, Video, BookOpen, Star, Calendar, MapPin, GraduationCap, Clock, Award } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"

export default function Courses() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get("/api/admin-portal/teachers-courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setTeachers(response.data.data.teachers)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const allCourses = teachers.flatMap((teacher) =>
    teacher.courses.course_list.map((course) => ({
      ...course,
      teacherInfo: {
        username: teacher.username,
        email: teacher.email,
        bio: teacher.bio,
        is_verified: teacher.is_verified,
      },
    })),
  )

  const filteredCourses = allCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${course.teacher.first_name} ${course.teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalCourses = teachers.reduce((sum, teacher) => sum + teacher.courses.total_courses, 0)
  const activeCourses = teachers.reduce((sum, teacher) => sum + teacher.courses.active_courses, 0)
  const paidCourses = teachers.reduce((sum, teacher) => sum + teacher.courses.paid_courses, 0)
  const totalEnrollments = allCourses.reduce((sum, course) => sum + course.total_enrollments, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#313D6A" }}></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">Courses Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and monitor all courses across the platform</p>
        </div>

        <div className="relative w-full sm:w-96 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
          <Input
            placeholder="Search courses, teachers, or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 w-full h-10 sm:h-12 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-400 rounded-xl shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl md:text-3xl font-bold" style={{ color: "#313D6A" }}>
                  {totalCourses}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Courses</p>
              </div>
              <div className="p-2 sm:p-3 rounded-full" style={{ backgroundColor: "#313D6A" }}>
                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{activeCourses}</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Active Courses</p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-green-100">
                <Award className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: "#F5BB07" }}>
                  {paidCourses}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Paid Courses</p>
              </div>
              <div className="p-2 sm:p-3 rounded-full" style={{ backgroundColor: "#F5BB07" }}>
                <Star className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{totalEnrollments}</p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Enrollments</p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-purple-100">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden pt-0 shadow-xl border-0 bg-white">
            <CardHeader className="text-white p-4 sm:p-6 bg-primary/85">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <Link href={`/our-tutors/tutor/${teacher.id}`} className="relative flex-shrink-0">
                  <img
                    src={
                      teacher.courses.course_list[0]?.teacher?.profile_picture ||
                      "/placeholder.svg?height=80&width=80&query=teacher+avatar"
                    }
                    alt={teacher.username}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  {teacher.is_verified && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <CardTitle className="text-lg sm:text-2xl text-white font-bold truncate">{teacher.username}</CardTitle>
                    {teacher.is_verified && (
                      <Badge className="bg-green-500 text-white border-0 px-2 py-0.5 text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100 mb-1 truncate">{teacher.email}</p>
                  <p className="text-xs sm:text-sm text-blue-200 line-clamp-2">{teacher.bio}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{teacher.courses.total_courses}</p>
                  <p className="text-xs sm:text-sm text-blue-200">Courses Created</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-4 sm:px-8 py-4 sm:py-6">
              {teacher.courses.course_list.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" style={{ color: "#313D6A" }} />
                      Courses Overview
                    </h3>

                    {/* Table for md+ screens */}
                    <div className="hidden md:block overflow-x-auto bg-white rounded-xl border border-gray-200">
                      <table className="w-full min-w-[800px]">
                        <thead>
                          <tr style={{ backgroundColor: "#313D6A" }}>
                            <th className="text-left py-3 px-4 text-white font-semibold text-sm">Course Details</th>
                            <th className="text-left py-3 px-4 text-white font-semibold text-sm">Type & Price</th>
                            <th className="text-left py-3 px-4 text-white font-semibold text-sm">Engagement</th>
                            <th className="text-left py-3 px-4 text-white font-semibold text-sm">Status</th>
                            <th className="text-left py-3 px-4 text-white font-semibold text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teacher.courses.course_list.map((course, index) => (
                            <tr
                              key={course.id}
                              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-start gap-3">
                                  <img
                                    src={course.thumbnail || "/placeholder.svg?height=60&width=80&query=course+thumbnail"}
                                    alt={course.title}
                                    className="w-24 h-16 rounded-lg object-cover shadow-sm"
                                  />
                                  <div className="min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">{course.title}</h4>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(course.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="space-y-2">
                                  <Badge
                                    className="text-white border-0 px-3 py-1 text-xs"
                                    style={{
                                      backgroundColor: course.course_type === "free" ? "#10B981" : "#F5BB07",
                                    }}
                                  >
                                    {course.course_type.toUpperCase()}
                                  </Badge>
                                  <p className="text-lg sm:text-2xl font-bold" style={{ color: "#313D6A" }}>
                                    {course.course_type === "free" ? "Free" : "$" + course.price}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">{course.total_enrollments}</span>
                                    <span className="text-gray-500">students</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Video className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">{course.total_videos}</span>
                                    <span className="text-gray-500">videos</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <Badge
                                  variant={course.is_active ? "default" : "secondary"}
                                  className={`px-3 py-1 ${course.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                                >
                                  {course.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="py-4 px-4">
                                <Link
                                  href={`/courses/details/${course.id}`}
                                  className="hover:bg-primary/10 rounded-lg hover:text-primary flex items-center gap-2 transition-colors text-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Stacked cards for small screens */}
                    <div className="block md:hidden space-y-3">
                      {teacher.courses.course_list.map((course) => (
                        <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={course.thumbnail || "/placeholder.svg?height=60&width=80&query=course+thumbnail"}
                              alt={course.title}
                              className="w-20 h-14 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm truncate">{course.title}</h4>
                                <div className="text-right">
                                  <p className="text-base font-bold" style={{ color: "#313D6A" }}>
                                    {course.course_type === "free" ? "Free" : "$" + course.price}
                                  </p>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{course.description}</p>

                              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                  <Users className="h-3 w-3" />
                                  <span>{course.total_enrollments}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Video className="h-3 w-3" />
                                  <span>{course.total_videos}</span>
                                </div>
                                <Link href={`/courses/details/${course.id}`} className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>View</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-1">No Courses Available</h3>
                  <p className="text-sm text-gray-500">This teacher hasn't created any courses yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {teachers.length === 0 && (
        <Card className="shadow-xl border-0 bg-white">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
            <p className="text-sm text-gray-500">No teachers or courses found in the system.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
