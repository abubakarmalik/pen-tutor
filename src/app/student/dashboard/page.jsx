"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Bell,
  User,
  Trash2,
  Eye,
  Search,
  Home,
  Calendar,
  BookMarked,
  Users,
  LogOut,
  Flag as Flask,
  Book,
  Play,
  CheckCircle,
  Clock,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  BookOpen,
} from "lucide-react"
import axios from "axios"

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [studentData, setStudentData] = useState(null)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [notifications, setNotifications] = useState([])
  const [notificationStats, setNotificationStats] = useState({ unread_count: 0, total_count: 0 })
  const [loading, setLoading] = useState(true)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const router = useRouter()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const mockStudentData = {
    student_name: "MaryamAli",
    student_email: "maryam.ali@example.com",
    profile_picture: null,
    created_at: "2021-07-05T00:00:00Z",
    statistics: {
      total_enrollments: 4,
      completed_courses: 2,
      in_progress_courses: 2,
      total_spent: 450,
    },
  }

  const mockEnrolledCourses = [
    {
      enrollment_id: 1,
      course: {
        id: 1,
        title: "Chemistry",
        description: "O Level Chemistry Course",
        price: 150,
        teacher: {
          id: 2156,
          first_name: "John",
          last_name: "Smith",
          profile_picture: null,
          expertise_areas: ["Chemistry", "Physics"],
        },
        total_videos: 25,
        total_enrollments: 45,
        reviews: [{ rating: 4.5 }],
        course_type: "paid",
      },
      progress_percentage: 65,
      completed_items: 16,
      total_items: 25,
      is_completed: false,
      payment_status: "paid",
      enrolled_at: "2024-01-15T00:00:00Z",
    },
    {
      enrollment_id: 2,
      course: {
        id: 2,
        title: "Physics",
        description: "O Level Physics Course",
        price: 175,
        teacher: {
          id: 2194,
          first_name: "Sarah",
          last_name: "Johnson",
          profile_picture: null,
          expertise_areas: ["Physics", "Mathematics"],
        },
        total_videos: 30,
        total_enrollments: 38,
        reviews: [{ rating: 4.8 }],
        course_type: "paid",
      },
      progress_percentage: 40,
      completed_items: 12,
      total_items: 30,
      is_completed: false,
      payment_status: "paid",
      enrolled_at: "2024-02-01T00:00:00Z",
    },
  ]

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/student/dashboard", icon: <Home className="h-4 w-4" /> },
    { id: "profile", label: "Profile", href: "/student/profile", icon: <User className="h-4 w-4" /> },
    { id: "courses", label: "Courses", href: "/courses", icon: <BookOpen className="h-4 w-4" /> },
    // { id: "payment", label: "Payment", href: "/student/payments", icon: <DollarSign className="h-4 w-4" /> },
    { id: "schedule", label: "Class Schedule", href: "#", icon: <Calendar className="h-4 w-4" /> },
    { id: "courses", label: "Courses & Material", href: "/courses", icon: <BookMarked className="h-4 w-4" /> },
    { id: "post_job", label: "Post Tuition Job", href: "#", icon: <Users className="h-4 w-4" /> },
    // { id: "post_job", label: "Post Tuition Job", href: "/job-board/post-job", icon: <Users className="h-4 w-4" /> },
    { id: "find_tutor", label: "Find Tutor", href: "/our-tutors", icon: <Search className="h-4 w-4" /> },
  ]

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      console.log("Student Data Response:", response)
      if (response.status === 200) {
        setStudentData(response.data.data)
        console.log("Student Data in cond:", studentData)
      }
      console.log("Student Data out cond:", studentData)
    } catch (error) {
      console.error("Error fetching student data:", error)
    }
  }

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/students/courses/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      if (response.status === 200) {
        console.log("Enrolled Courses Response:", response)
        setEnrolledCourses(response.data.data.courses)
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    setNotificationsLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notifications/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setNotifications(response.data.results || response.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setNotificationsLoading(false)
    }
  }

  const fetchNotificationStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notifications/stats/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setNotificationStats(response.data)
    } catch (error) {
      console.error("Error fetching notification stats:", error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/notifications/mark-as-read/`, { notification_id: notificationId })
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
      )
      fetchNotificationStats()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/notifications/mark-all-as-read/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))
      fetchNotificationStats()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/${notificationId}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
      fetchNotificationStats()
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const deleteAllRead = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/delete-all-read/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setNotifications((prev) => prev.filter((notif) => !notif.is_read))
      fetchNotificationStats()
    } catch (error) {
      console.error("Error deleting read notifications:", error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="text-green-500 h-5 w-5" />
      case "warning":
        return <AlertCircle className="text-yellow-500 h-5 w-5" />
      case "video_upload":
        return <Play className="h-4 w-4" />
      case "quiz":
        return <CheckCircle className="h-4 w-4" />
      case "meeting":
        return <Clock className="h-4 w-4" />
      default:
        return <Info className="text-blue-500 h-5 w-5" />
    }
  }

  useEffect(() => {
    fetchStudentData()
    fetchEnrolledCourses()
    fetchNotificationStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#313D6A] mx-auto mb-4"></div>
          <p className="text-[#313D6A]">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white max-w-full overflow-x-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-[#313D6A]/20 backdrop-blur-xs z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white text-white transform transition-transform duration-300 ease-in-out z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        style={{ position: "fixed", overflowY: "auto", maxHeight: "100vh" }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10 mb-4"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="bg-[#313D6A] w-full shadow-2xl rounded-lg p-4 mb-6 border border-white/20">
              <div className="flex items-center space-x-3">
                <Avatar className="h-16 w-16 border-2 border-white/20">
                  <AvatarImage
                    src={`${API_BASE_URL}${studentData?.profile_picture}` || "/placeholder.svg"}
                    alt={studentData?.student_name}
                  />
                  <AvatarFallback className="bg-white text-[#313D6A] text-lg font-bold">
                    {studentData?.student_name?.charAt(0) || "M"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white text-lg">{studentData?.student_name || ""}</h3>
                  <p className="text-white/80 text-sm font-medium">student</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full px-6 pb-6 overflow-y-auto">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start text-[#313D6A] hover:bg-[#313D6A]/10 hover:text-[#313D6A] transition-colors data-[active=true]:bg-[#313D6A]/20 data-[active=true]:text-[#313D6A] rounded-lg py-3"
                  data-active={item.id === "dashboard"}
                  onClick={() => router.push(item.href)}
                >
                  {item.icon}
                  <span className="ml-3 font-medium">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
          <div className="p-6 border-t border-white/20 flex-shrink-0">
            <Button
              variant="ghost"
              className="w-full justify-start text-white bg-red-600/80 hover:bg-red-500 transition-colors rounded-lg py-3"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>

        </div>
      </div>

      <div className="lg:ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between max-w-full">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden border-[#313D6A] text-[#313D6A] bg-transparent flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-[#313D6A] truncate">Welcome To Student Dashboard</h1>
                <p className="text-sm text-gray-600 truncate">
                  Member Since{" "}
                  {studentData?.created_at
                    ? new Date(studentData.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                    : "5 July 2021"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative border-[#313D6A] text-[#313D6A] bg-transparent"
                    onClick={fetchNotifications}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                    {notificationStats.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-[#313D6A]">Notifications</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="all" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unread">Unread</TabsTrigger>
                      <TabsTrigger value="recent">Recent</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4">
                      {notifications?.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center">No notifications</p>
                      ) : (
                        notifications?.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 rounded-lg border mb-2 ${!n.is_read ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                              }`}
                          >
                            <div className="flex items-start space-x-3">
                              {getNotificationIcon(n.notification_type)}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#313D6A]">{n.title}</p>
                                <p className="text-xs text-gray-600">{n.message}</p>
                                <span className="text-xs text-gray-400">{n.time_since_created}</span>
                              </div>
                              {!n.is_read && (
                                <Button size="sm" variant="ghost" onClick={() => markAsRead(n.id)}>
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => deleteNotification(n.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                      <div className="flex justify-between pt-4 border-t">
                        <Button variant="link" onClick={markAllAsRead}>
                          Mark all as read
                        </Button>
                        <Button variant="link" onClick={deleteAllRead}>
                          Clear read
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="unread" className="mt-4">
                      {notifications?.filter((n) => !n.is_read).length === 0 ? (
                        <p className="text-sm text-gray-500 text-center">No unread notifications</p>
                      ) : (
                        notifications
                          ?.filter((n) => !n.is_read)
                          .map((n) => (
                            <div key={n.id} className="p-3 rounded-lg border bg-yellow-50 border-yellow-200 mb-2">
                              <div className="flex items-start space-x-3">
                                {getNotificationIcon(n.notification_type)}
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-[#313D6A]">{n.title}</p>
                                  <p className="text-xs text-gray-600">{n.message}</p>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => markAsRead(n.id)}>
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                      )}
                    </TabsContent>

                    <TabsContent value="recent" className="mt-4">
                      {notifications?.slice(0, 5).map((n) => (
                        <div key={n.id} className="p-3 rounded-lg border bg-gray-50 border-gray-200 mb-2">
                          <div className="flex items-start space-x-3">
                            {getNotificationIcon(n.notification_type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#313D6A]">{n.title}</p>
                              <p className="text-xs text-gray-600">{n.message}</p>
                              <span className="text-xs text-gray-400">{n.time_since_created}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-full">
            <div className="xl:col-span-3 space-y-6 min-w-0">
              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="bg-[#313D6A] text-white rounded-t-lg">
                  <CardTitle className="text-white text-lg font-bold">Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-[#313D6A] text-white text-sm font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-left border-r border-white/20 whitespace-nowrap">Student ID</th>
                          <th className="px-4 py-3 text-left border-r border-white/20 whitespace-nowrap">
                            Class/Level
                          </th>
                          <th className="px-4 py-3 text-left border-r border-white/20 whitespace-nowrap">Subject</th>
                          <th className="px-4 py-3 text-left border-r border-white/20 whitespace-nowrap">Date/Day</th>
                          <th className="px-4 py-3 text-left border-r border-white/20 whitespace-nowrap">Timings</th>
                          <th className="px-4 py-3 text-left border-r border-white/20 whitespace-nowrap">Mode</th>
                          <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrolledCourses?.slice(0, 2).map((enrollment, index) => (
                          <tr
                            key={enrollment.enrollment_id}
                            className={index % 2 === 0 ? "bg-[#313D6A]/5" : "bg-white"}
                          >
                            <td className="px-4 py-3 text-sm border-r border-gray-200 whitespace-nowrap">
                              <div className="font-medium text-[#313D6A]">ST{enrollment.course.teacher.id}</div>
                              <div className="text-xs text-gray-500">Muhammad Ahmad</div>
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium whitespace-nowrap">
                              O Level 1
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium whitespace-nowrap">
                              {enrollment.course.title}
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-gray-700 whitespace-nowrap">
                              Mon/Wed/Fri
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-gray-700 whitespace-nowrap">
                              7:00 PM GMT +5
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium whitespace-nowrap">
                              Online
                            </td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                              <Badge className="bg-[#F5BB07] text-[#313D6A] font-medium">Active</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#313D6A]">My Scheduled Classes</h2>

                <Card className="border-[#313D6A]/20 shadow-lg">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="text-[#313D6A] font-bold">My Scheduled Home Tuitions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="bg-[#F5BB07] text-[#313D6A] text-sm font-bold">
                          <tr>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20 whitespace-nowrap">
                              Student ID
                            </th>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20 whitespace-nowrap">
                              Class/Level
                            </th>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20 whitespace-nowrap">
                              Subject
                            </th>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20 whitespace-nowrap">
                              Days & Timing
                            </th>
                            <th className="px-4 py-3 text-left whitespace-nowrap">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrolledCourses?.slice(0, 2).map((enrollment, index) => (
                            <tr key={enrollment.enrolled_at} className="bg-[#F5BB07]/10">
                              <td className="px-4 py-3 text-sm border-r border-gray-200 whitespace-nowrap">
                                <div className="font-medium text-[#313D6A]">ST{enrollment.course.teacher.id}</div>
                                <div className="text-xs text-gray-600">Muhammad Ahmad</div>
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium whitespace-nowrap">
                                O Level 1
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium whitespace-nowrap">
                                {enrollment.course.title}
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-gray-700">
                                Monday 17:00 PM-18:00 PM, Tuesday 17:00 PM-18:00 PM
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">Street No 6, DHA Phase 5, Lahore</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#313D6A]/20 shadow-lg">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="text-[#313D6A] font-bold">My Scheduled Online Tuitions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-cyan-400 text-white text-sm font-bold">
                          <tr>
                            <th className="px-4 py-3 text-left border-r border-white/20">Tutor ID</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Class/Level</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Subject</th>
                            <th className="px-4 py-3 text-left">Days & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrolledCourses?.slice(0, 2).map((enrollment, index) => (
                            <tr key={enrollment.enrollment_id} className="bg-cyan-50">
                              <td className="px-4 py-3 text-sm border-r border-gray-200">
                                <div className="font-medium text-[#313D6A]">PT{enrollment.course.teacher.id}</div>
                                <div className="text-xs text-gray-600">
                                  {enrollment.course.teacher.first_name} {enrollment.course.teacher.last_name}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                O Level 1
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {enrollment.course.title}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                Monday 17:00 PM-18:00 PM, Tuesday 17:00 PM-18:00 PM
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#313D6A]/20 shadow-lg">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="text-[#313D6A] font-bold">My Scheduled Online Group Sessions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-pink-500 text-white text-sm font-bold">
                          <tr>
                            <th className="px-4 py-3 text-left border-r border-white/20 whitespace-nowrap">
                              Student ID
                            </th>
                            <th className="px-4 py-3 text-left border-r border-white/20 whitespace-nowrap">
                              Class/Level
                            </th>
                            <th className="px-4 py-3 text-left border-r border-white/20 whitespace-nowrap">Subject</th>
                            <th className="px-4 py-3 text-left whitespace-nowrap">Days & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrolledCourses?.length > 0 ? (
                            enrolledCourses?.slice(0, 2).map((enrollment, index) => (
                              <tr key={enrollment.enrollment_id} className="bg-pink-50">
                                <td className="px-4 py-3 text-sm border-r border-gray-200 whitespace-nowrap">
                                  <div className="font-medium text-[#313D6A]">ST{enrollment.course.teacher.id}</div>
                                  <div className="text-xs text-gray-600">Muhammad Ahmad</div>
                                </td>
                                <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium whitespace-nowrap">
                                  O Level 1
                                </td>
                                <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium whitespace-nowrap">
                                  {enrollment.course.title}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                  Monday 17:00 PM-18:00 PM, Tuesday 17:00 PM-18:00 PM
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-6">
                                No scheduled online group sessions found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#313D6A]">My Video Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-[#F5BB07] text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                          <Flask className="h-8 w-8" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg">O Level Chemistry</h3>
                    </CardContent>
                  </Card>
                  <Card className="bg-cyan-400 text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                          <Flask className="h-8 w-8" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg">O Level Physics</h3>
                    </CardContent>
                  </Card>
                  <Card className="bg-pink-500 text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                          <Flask className="h-8 w-8" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg">O Level Computer</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#313D6A]">My Online Resources</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-[#F5BB07] text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                          <Book className="h-8 w-8" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg">Key Book</h3>
                    </CardContent>
                  </Card>
                  <Card className="bg-cyan-400 text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                          <Book className="h-8 w-8" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg">Past Papers</h3>
                    </CardContent>
                  </Card>
                  <Card className="bg-pink-500 text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                          <Book className="h-8 w-8" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg">Important Notes</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="space-y-6 min-w-0">
              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/10 to-[#313D6A]/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Recent Jobs</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#F5BB07]">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "O/A Levels Tutors Required",
                    "O/A Levels Tutors Required",
                    "O/A Levels Tutors Required",
                    "O/A Levels Tutors Required",
                  ].map((job, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-lg hover:bg-[#313D6A]/10 transition-colors cursor-pointer"
                    >
                      - {job}
                    </div>
                  ))}
                  <Button variant="link" className="text-[#F5BB07] text-sm p-0 h-auto font-medium">
                    View All Jobs
                  </Button>
                </CardContent>
              </Card>

              {/* <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/10 to-[#313D6A]/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Promotions</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#F5BB07]">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Special Discount 50%", "Free Trial Week", "Premium Upgrade", "Bonus Materials"].map(
                    (promo, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-lg hover:bg-[#313D6A]/10 transition-colors cursor-pointer"
                      >
                        - {promo}
                      </div>
                    ),
                  )}
                  <Button variant="link" className="text-[#F5BB07] text-sm p-0 h-auto font-medium">
                    View All Promotions
                  </Button>
                </CardContent>
              </Card> */}

              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/10 to-[#313D6A]/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Notice Board</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#F5BB07]">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Important Exam Updates", "Holiday Schedule", "New Course Launch", "System Maintenance"].map(
                    (notice, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-lg hover:bg-[#313D6A]/10 transition-colors cursor-pointer"
                      >
                        - {notice}
                      </div>
                    ),
                  )}
                  <Button variant="link" className="text-[#F5BB07] text-sm p-0 h-auto font-medium">
                    View All Notices
                  </Button>
                </CardContent>
              </Card>

              {/* <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/10 to-[#313D6A]/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Payments</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#F5BB07]">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-600 text-white px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Paid:</span>
                      <span className="font-bold text-lg">$450</span>
                    </div>
                  </div>
                  <div className="bg-pink-500 text-white px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Payment:</span>
                      <span className="font-bold text-lg">$150</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/10 to-[#313D6A]/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Attendance</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#F5BB07]">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { code: "PT-1234", classes: "1 Class" },
                    { code: "PT-2456", classes: "2 Classes" },
                    { code: "PT-7894", classes: "3 Classes" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700 font-medium">{item.code}</span>
                      <span className="text-[#313D6A] font-bold">{item.classes}</span>
                    </div>
                  ))}
                </CardContent>
              </Card> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
