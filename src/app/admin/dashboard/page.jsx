"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, CreditCard, TrendingUp, UserCheck, GraduationCap, Shield, Eye } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/admin-portal/overview", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setData(response.data.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-44">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#313D6A" }}></div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Users",
      value: data?.user_statistics?.total_users || 0,
      icon: Users,
      color: "#313D6A",
      bgGradient: "from-blue-50 to-indigo-100",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Total Courses",
      value: data?.course_statistics?.total_courses || 0,
      icon: BookOpen,
      color: "#F5BB07",
      bgGradient: "from-yellow-50 to-amber-100",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Total Revenue",
      value: `$${data?.payment_statistics?.total_revenue || 0}`,
      icon: CreditCard,
      color: "#10B981",
      bgGradient: "from-green-50 to-emerald-100",
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "Active Courses",
      value: data?.course_statistics?.active_courses || 0,
      icon: TrendingUp,
      color: "#8B5CF6",
      bgGradient: "from-purple-50 to-violet-100",
      change: "+5%",
      changeType: "positive",
    },
  ]

  const userRoleStats = [
    {
      label: "Students",
      value: data?.user_statistics?.total_students || 0,
      icon: GraduationCap,
      color: "#313D6A",
      percentage: (
        ((data?.user_statistics?.total_students || 0) / (data?.user_statistics?.total_users || 1)) *
        100
      ).toFixed(1),
    },
    {
      label: "Teachers",
      value: data?.user_statistics?.total_teachers || 0,
      icon: UserCheck,
      color: "#F5BB07",
      percentage: (
        ((data?.user_statistics?.total_teachers || 0) / (data?.user_statistics?.total_users || 1)) *
        100
      ).toFixed(1),
    },
    {
      label: "Admins",
      value: data?.user_statistics?.total_admins || 0,
      icon: Shield,
      color: "#10B981",
      percentage: (
        ((data?.user_statistics?.total_admins || 0) / (data?.user_statistics?.total_users || 1)) *
        100
      ).toFixed(1),
    },
    {
      label: "Sub Admins",
      value: data?.user_statistics?.total_subadmins || 0,
      icon: Shield,
      color: "#8B5CF6",
      percentage: (
        ((data?.user_statistics?.total_subadmins || 0) / (data?.user_statistics?.total_users || 1)) *
        100
      ).toFixed(1),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${stat.bgGradient} border-0`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 sm:p-3 rounded-xl shadow-lg" style={{ backgroundColor: stat.color }}>
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${stat.changeType === "positive" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                        }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#313D6A" }} />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {userRoleStats.map((role, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg" style={{ backgroundColor: `${role.color}20` }}>
                      <role.icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: role.color }} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-500">{role.percentage}%</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{role.value}</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{role.label}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: role.color,
                          width: `${role.percentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Users Table (desktop) */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#313D6A" }} />
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recent_activity?.recent_users?.slice(0, 5).map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {user.first_name?.[0] || user.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-sm sm:text-base text-gray-900 truncate">{user.first_name} {user.last_name}</p>
                              <p className="text-xs sm:text-sm text-gray-500">{user.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className="px-3 py-1 text-xs sm:text-xs font-medium rounded-full text-white"
                            style={{
                              backgroundColor:
                                user.role === "admin"
                                  ? "#313D6A"
                                  : user.role === "teacher"
                                    ? "#F5BB07"
                                    : user.role === "student"
                                      ? "#10B981"
                                      : "#8B5CF6",
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${user.is_verified ? "bg-green-500" : "bg-red-500"}`}
                            ></div>
                            <span className="text-xs sm:text-sm text-gray-600">{user.is_verified ? "Verified" : "Pending"}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile recent users cards */}
              <div className="md:hidden space-y-3">
                {data?.recent_activity?.recent_users?.slice(0, 5).map((user) => (
                  <div key={user.id} className="bg-white rounded-lg shadow-sm p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.first_name?.[0] || user.username[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.username}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-medium" style={{ color: user.role === "admin" ? "#313D6A" : user.role === "teacher" ? "#F5BB07" : user.role === "student" ? "#10B981" : "#8B5CF6" }}>{user.role}</span>
                      <div className={`w-2 h-2 rounded-full ${user.is_verified ? "bg-green-500" : "bg-red-500"}`}></div>
                    </div>
                  </div>
                ))}

                {(!data?.recent_activity?.recent_users || data.recent_activity.recent_users.length === 0) && (
                  <div className="text-center text-sm text-gray-500">No recent users</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Courses Table */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#F5BB07" }} />
                Recent Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Course</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Enrollments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recent_activity?.recent_courses?.slice(0, 5).map((course) => (
                      <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2">
                          <Link href={`/courses/details/${course.id}`} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              {course.thumbnail ? (
                                <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm sm:text-base text-gray-900 line-clamp-1">{course.title}</p>
                              <p className="text-xs sm:text-sm text-gray-500">By {course.teacher.first_name} {course.teacher.last_name}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-3 py-1 text-xs font-medium rounded-full text-white" style={{ backgroundColor: course.course_type === "free" ? "#10B981" : "#F5BB07" }}>{course.course_type}</span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{course.total_enrollments}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile recent courses cards */}
              <div className="md:hidden space-y-3">
                {data?.recent_activity?.recent_courses?.slice(0, 5).map((course) => (
                  <Link href={`/courses/details/${course.id}`} key={course.id} className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      {course.thumbnail ? (
                        <img src={course.thumbnail || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{course.title}</p>
                      <p className="text-xs text-gray-500">By {course.teacher.first_name} {course.teacher.last_name}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm font-medium">{course.total_enrollments}</p>
                    </div>
                  </Link>
                ))}

                {(!data?.recent_activity?.recent_courses || data.recent_activity.recent_courses.length === 0) && (
                  <div className="text-center text-sm text-gray-500">No recent courses</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
