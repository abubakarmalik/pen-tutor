"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  BookOpen,
  Calendar,
  Users,
  Video,
  FileQuestion,
  Monitor,
  Menu,
  X,
  GraduationCap,
  User,
  Bell,
  FlaskConical,
  Info,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { useAuth } from "@/components/auth/AuthContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

function TutorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [teacherData, setTeacherData] = useState(null)
  const [teacherProfile, setTeacherProfile] = useState(null)
  const [scheduledSessions, setScheduledSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [recentJobs, setRecentJobs] = useState([])
  const router = useRouter()
  const { user, logout } = useAuth()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const teacherResponse = await axios.get(`${API_BASE}/api/teacher/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        if (teacherResponse.status === 200) {
          setTeacherData(teacherResponse.data.data)
        }
      } catch (error) {
        toast.error("Failed to fetch dashboard data.")
        setTeacherData(null)
      } finally {
        setLoading(false)
      }
    }

    const fetchScheduledSessions = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/live-class/upcoming/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        if (res.status === 200) {
          setScheduledSessions(res.data.data)
        }
      } catch {
        setScheduledSessions([])
      }
    }

    fetchData()
    fetchScheduledSessions()
  }, [])

  // Notifications
  useEffect(() => {
    fetchNotifications()
    fetchNotificationStats()
    fetchRecentJobs()
  }, [])

  const navLinks = [
    { label: "Dashboard", icon: Calendar, path: "/tutor-dashboard" },
    { label: "Profile", icon: User, path: "/tutor/profile" },
    // { label: "Agreement", icon: FileQuestion, path: "/tutor/agreement" },
    { label: "Agreement", icon: FileQuestion, path: "#" },
    { label: "Class Schedule", icon: Calendar, path: "#" },
    // { label: "Record of Payment", icon: Monitor, path: "/tutor/record-payment" },
    { label: "Courses of Material", icon: BookOpen, path: "/tutor/courses" },
    { label: "Create Course", icon: Plus, path: "/courses/create" },
    { label: "Job Board", icon: Users, path: "/job-board" },
    // { label: "Student Request", icon: GraduationCap, path: "/tutor/student-request" },
    { label: "Become Featured Tutors", icon: Video, path: "#" },
    { label: "Become Pentutor Affiliate", icon: Users, path: "#" },
  ]

  const fetchRecentJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/job-board/jobs/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      console.log("Recent Jobs Response:", res)
      setRecentJobs(res.data.results)
    } catch (error) {
      toast.error("Failed to fetch recent jobs")
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notifications/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      console.log("Notifications Response:", res)
      setNotifications(res.data.results)
    } catch (error) {
      toast.error("Failed to fetch notifications")
    }
  }

  const fetchNotificationStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notifications/stats/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setUnreadCount(res.data.unread_count)
    } catch { }
  }

  const markAsRead = async (id) => {
    try {
      await axios.post(
        `${API_BASE}/api/notifications/${id}/mark-read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      )
      fetchNotifications()
      fetchNotificationStats()
    } catch { }
  }

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${API_BASE}/api/notifications/mark-all-read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      )
      fetchNotifications()
      fetchNotificationStats()
    } catch { }
  }

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/notifications/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      fetchNotifications()
      fetchNotificationStats()
    } catch { }
  }

  const deleteAllRead = async () => {
    try {
      await axios.post(
        `${API_BASE}/api/notifications/delete-all-read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      )
      fetchNotifications()
      fetchNotificationStats()
    } catch { }
  }

  const getIconForType = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="text-green-500 h-5 w-5" />
      case "warning":
        return <AlertCircle className="text-yellow-500 h-5 w-5" />
      default:
        return <Info className="text-blue-500 h-5 w-5" />
    }
  }

  const handleVideoClick = (videoId) => {
    router.push(`/tutor/videos/${videoId}`)
  }

  const handleCourseClick = (courseId) => {
    router.push(`/courses/details/${courseId}`)
  }

  const handleLogout = async () => {
    try {
      logout()
      router.push("/")
    } catch (error) {
      toast.error("Failed to logout.")
      console.error("Error logging out:", error)
    }
  }

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

  if (!teacherData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-red-600">Failed to load dashboard data</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#313D6A] hover:bg-[#313D6A]/90 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const { teacher, statistics, videos, courses } = teacherData

  const upcomingSessions = [
    {
      id: 1,
      studentId: "PTS100",
      studentName: "Muhammad Ahmad",
      classLevel: "O Level 1",
      subject: "Chemistry",
      dateTime: "Monday 17:00 PM-18:00 PM",
      timings: "Tuesday 17:00 PM-18:00 PM",
      mode: "Online",
      status: "Confirmed",
    },
    {
      id: 2,
      studentId: "PTS200",
      studentName: "Sarah Khan",
      classLevel: "A Level 2",
      subject: "Physics",
      dateTime: "Tuesday 15:00 PM-16:00 PM",
      timings: "Wednesday 15:00 PM-16:00 PM",
      mode: "Home",
      status: "Pending",
    },
  ]

  const scheduledClasses = {
    homeTuitions: [
      {
        id: 1,
        studentId: "PTS100",
        studentName: "Muhammad Ahmad",
        classLevel: "O Level 1",
        subject: "Chemistry",
        daysTime: "Monday 17:00 PM-18:00 PM, Tuesday 17:00 PM-18:00 PM",
        location: "Street No 6, DHA Phase 5, Lahore",
      },
    ],
    onlineTuitions: [
      {
        id: 1,
        studentId: "PTS100",
        studentName: "Muhammad Ahmad",
        classLevel: "O Level 1",
        subject: "Chemistry",
        daysTime: "Monday 17:00 PM-18:00 PM, Tuesday 17:00 PM-18:00 PM",
      },
    ],
    onlineGroupSessions: [
      {
        id: 1,
        studentId: "PTS100",
        studentName: "Muhammad Ahmad",
        classLevel: "O Level 1",
        subject: "Chemistry",
        daysTime: "Monday 17:00 PM-18:00 PM, Tuesday 17:00 PM-18:00 PM",
      },
    ],
  }

  const videoCourses = [
    { id: 1, title: "O Level Chemistry", color: "bg-[#F5BB07]" },
    { id: 2, title: "O Level Physics", color: "bg-cyan-400" },
    { id: 3, title: "O Level Computer", color: "bg-pink-500" },
  ]

  const onlineResources = [
    { id: 1, title: "Key Book", color: "bg-[#F5BB07]" },
    { id: 2, title: "Past Papers", color: "bg-cyan-400" },
    { id: 3, title: "Important Notes", color: "bg-pink-500" },
  ]

  // const recentJobs = [
  //   "O/A Levels Tutors Required",
  //   "O/A Levels Tutors Required",
  //   "O/A Levels Tutors Required",
  //   "O/A Levels Tutors Required",
  // ]

  const notices = ["Notice No. 1", "Notice No. 2", "Notice No. 3", "Notice No. 4"]

  const attendanceData = [
    { code: "PTS-100", classes: "1 Class" },
    { code: "PTS-200", classes: "2 Classes" },
    { code: "PTS-300", classes: "3 Classes" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-[#313D6A]/20 backdrop-blur-xs z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white text-white transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="p-4 shadow-lg rounded-lg">
          {/* Profile Section */}
          <div className="bg-[#4A5A8A] rounded-lg p-4 mb-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <Avatar className="h-16 w-16 border-2 border-white/20">
                <AvatarImage
                  src={`${API_BASE}${teacherData?.profile_picture}` || "/placeholder.svg"}
                  alt={teacherData?.teacher_name}
                />
                <AvatarFallback className="bg-[#F5BB07] text-[#313D6A] text-lg font-bold">
                  {teacherData?.teacher_name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "MS"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  {teacherData?.teacher_name || "Maryam Safdar"}
                </h3>
                <p className="text-[#F5BB07] text-xs font-medium">Level 2</p>
              </div>
            </div>
          </div>

          {/* Close button (mobile only) */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/10 mb-4 w-full justify-start"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Close Menu
          </Button>

          {/* Navigation */}
          <nav className="space-y-1">
            {navLinks.map(({ label, icon: Icon, path }) => (
              <Button
                key={label}
                variant="ghost"
                className="w-full justify-start text-[#313D6A] hover:bg-[#313D6A]/10 hover:text-[#313D6A] transition-colors data-[active=true]:bg-[#313D6A]/20 data-[active=true]:text-[#313D6A] text-sm"
                onClick={() => router.push(path)}
                data-active={label === "Dashboard"}
              >
                <Icon className="h-4 w-4 mr-3" />
                {label}
              </Button>
            ))}

            {/* Logout */}
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-300 hover:text-red-600 transition-colors text-sm mt-4"
              onClick={handleLogout}
            >
              <X className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </nav>
        </div>
      </div>

      <div className="lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-[#313D6A]"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#313D6A]">Welcome To Tutor Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Member Since: 5 July 2021</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <input
                  type="text"
                  placeholder="Search Anything"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#313D6A] focus:border-transparent"
                />
              </div>
              <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white bg-transparent"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />}
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
                            className={`p-3 rounded-lg border mb-2 ${!n.is_read ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}
                          >
                            <div className="flex items-start space-x-3">
                              {getIconForType(n.type)}
                              <div className="flex-1">
                                <p className="text-sm font-medium text-[#313D6A]">{n.title}</p>
                                <p className="text-xs text-gray-600">{n.message}</p>
                                <span className="text-xs text-gray-400">{n.timestamp}</span>
                              </div>
                              {!n.is_read && (
                                <Button size="xs" variant="ghost" onClick={() => markAsRead(n.id)}>
                                  Mark Read
                                </Button>
                              )}
                              <Button size="xs" variant="ghost" onClick={() => deleteNotification(n.id)}>
                                ✕
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
                                {getIconForType(n.type)}
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-[#313D6A]">{n.title}</p>
                                  <p className="text-xs text-gray-600">{n.message}</p>
                                </div>
                                <Button size="xs" variant="ghost" onClick={() => markAsRead(n.id)}>
                                  Mark Read
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
                            {getIconForType(n.type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#313D6A]">{n.title}</p>
                              <p className="text-xs text-gray-600">{n.message}</p>
                              <span className="text-xs text-gray-400">{n.timestamp}</span>
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
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="bg-[#313D6A] text-white rounded-t-lg">
                  <CardTitle className="text-white text-lg font-bold">Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-[#313D6A] text-white text-sm font-semibold">
                        <tr>
                          <th className="px-4 py-3 text-left border-r border-white/20">Student ID</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Class/Level</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Subject</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Date/day</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Timings</th>
                          <th className="px-4 py-3 text-left border-r border-white/20">Mode</th>
                          <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingSessions.map((session, index) => (
                          <tr key={session.id} className={index % 2 === 0 ? "bg-[#313D6A]/5" : "bg-white"}>
                            <td className="px-4 py-3 text-sm border-r border-gray-200">
                              <div className="font-medium text-[#313D6A]">{session.studentId}</div>
                              <div className="text-xs text-gray-500">{session.studentName}</div>
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                              {session.classLevel}
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                              {session.subject}
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-gray-700">
                              {session.dateTime}
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-gray-700">
                              {session.timings}
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                              {session.mode}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Badge
                                variant={session.status === "Confirmed" ? "default" : "secondary"}
                                className={
                                  session.status === "Confirmed"
                                    ? "bg-[#F5BB07] text-[#313D6A] font-medium"
                                    : "bg-orange-500 text-white font-medium"
                                }
                              >
                                {session.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <h2 className="text-2xl text-center font-bold text-[#313D6A]">My Scheduled Classes</h2>

                <Card className="border-[#313D6A]/20 shadow-lg">
                  <CardHeader className="bg-white border-b border-gray-200">
                    <CardTitle className="text-[#313D6A] font-bold">My Scheduled Home Tuitions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="bg-[#F5BB07] text-[#313D6A] text-sm font-bold">
                          <tr>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20">Student ID</th>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20">Class/Level</th>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20">Subject</th>
                            <th className="px-4 py-3 text-left border-r border-[#313D6A]/20">Days & Timing</th>
                            <th className="px-4 py-3 text-left">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduledClasses?.homeTuitions?.map((session, index) => (
                            <tr key={session.id} className="bg-[#F5BB07]/10">
                              <td className="px-4 py-3 text-sm border-r border-gray-200">
                                <div className="font-medium text-[#313D6A]">{session.studentId}</div>
                                <div className="text-xs text-gray-600">{session.studentName}</div>
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.classLevel}
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.subject}
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-gray-700">
                                {session.daysTime}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{session.location}</td>
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
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-cyan-400 text-white text-sm font-bold">
                          <tr>
                            <th className="px-4 py-3 text-left border-r border-white/20">Student ID</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Class/Level</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Subject</th>
                            <th className="px-4 py-3 text-left">Days & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduledClasses?.onlineTuitions?.map((session, index) => (
                            <tr key={session.id} className="bg-cyan-50">
                              <td className="px-4 py-3 text-sm border-r border-gray-200">
                                <div className="font-medium text-[#313D6A]">{session.studentId}</div>
                                <div className="text-xs text-gray-600">{session.studentName}</div>
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.classLevel}
                              </td>
                              <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                {session.subject}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{session.daysTime}</td>
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
                            <th className="px-4 py-3 text-left border-r border-white/20">Student ID</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Class/Level</th>
                            <th className="px-4 py-3 text-left border-r border-white/20">Subject</th>
                            <th className="px-4 py-3 text-left">Days & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scheduledClasses?.onlineGroupSessions?.length > 0 ? (
                            scheduledClasses?.onlineGroupSessions?.map((session, index) => (
                              <tr key={session.id} className="bg-pink-50">
                                <td className="px-4 py-3 text-sm border-r border-gray-200">
                                  <div className="font-medium text-[#313D6A]">{session.studentId}</div>
                                  <div className="text-xs text-gray-600">{session.studentName}</div>
                                </td>
                                <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                  {session.classLevel}
                                </td>
                                <td className="px-4 py-3 text-sm border-r border-gray-200 text-[#313D6A] font-medium">
                                  {session.subject}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{session.daysTime}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-6 text-gray-500">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videoCourses.map((course) => (
                    <Card
                      key={course.id}
                      className={`${course.color} text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                            <FlaskConical className="h-8 w-8" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{course.title}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#313D6A]">My Online Resources</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {onlineResources.map((resource) => (
                    <Card
                      key={resource.id}
                      className={`${resource.color} text-white cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">{resource.title}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/5 to-[#313D6A]/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Recent Jobs</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#313D6A]/70">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentJobs.map((job, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-lg hover:bg-[#313D6A]/10 transition-colors cursor-pointer"
                    >
                      - {job.title}
                    </div>
                  ))}
                  <Link href="/job-board" className="text-[#313D6A] text-sm p-0 h-auto font-medium hover:underline">
                    View All Jobs
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/5 to-[#313D6A]/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Notice Board</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#313D6A]/70">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notices.map((notice, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-700 py-2 px-3 bg-gray-50 rounded-lg hover:bg-[#313D6A]/10 transition-colors cursor-pointer"
                    >
                      - {notice}
                    </div>
                  ))}
                  <Button variant="link" className="text-[#313D6A] text-sm p-0 h-auto font-medium">
                    View All Notices
                  </Button>
                </CardContent>
              </Card>

              {/* <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/5 to-[#313D6A]/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Payments</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#313D6A]/70">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-600 text-white px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Received Payment:</span>
                      <span className="font-bold text-lg">1500 RS</span>
                    </div>
                  </div>
                  <div className="bg-pink-500 text-white px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending Payment:</span>
                      <span className="font-bold text-lg">2500 RS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#313D6A]/20 shadow-lg">
                <CardHeader className="pb-3 bg-gradient-to-r from-[#313D6A]/5 to-[#313D6A]/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#313D6A] text-lg font-bold">Attendance</CardTitle>
                    <Button variant="ghost" size="sm" className="text-[#313D6A] hover:text-[#313D6A]/70">
                      →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {attendanceData.map((item, index) => (
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

export default function TutorDashboardPage() {
  return <TutorDashboard />
}
