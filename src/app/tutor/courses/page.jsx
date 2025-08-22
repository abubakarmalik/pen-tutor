"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus, BookOpen, Users, Clock, Star } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export default function TutorCoursesPage() {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [deletingId, setDeletingId] = useState(null)
  const router = useRouter()
  const { toast } = useToast()
  const user = JSON.parse(localStorage.getItem("user_data"))

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, filterType, filterStatus])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE}/api/teacher/courses/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      console.log("Courses Response:", response)
      setCourses(response.data.data || [])
    } catch (error) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to fetch courses. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = courses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((course) => course.courseType === filterType)
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((course) => (filterStatus === "active" ? course.isActive : !course.isActive))
    }

    setFilteredCourses(filtered)
  }

  const handleDelete = async (courseId) => {
    try {
      setDeletingId(courseId)
      await axios.delete(`${API_BASE}/api/teacher/courses/${courseId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setCourses(courses.filter((course) => course.id !== courseId))
      toast({
        title: "Success",
        description: "Course deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting course:", error)
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (courseId) => {
    router.push(`/courses/edit/${courseId}`)
  }

  const handleCreateNew = () => {
    router.push("/courses/create")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCE0] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-xl shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#313D6A] mb-4">Manage Your Online Courses</h1>
          <p className="text-[#313D6A]/70 text-lg mb-8">Track performance and manage your course portfolio</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-[#F5BB07] rounded-full p-1 shadow-lg">
              <div className="flex items-center bg-white rounded-full px-2 py-1">
                <Input
                  placeholder="Search your courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent text-[#313D6A] placeholder:text-[#313D6A]/50 focus-visible:ring-0 text-lg"
                />
                <Button className="bg-[#313D6A] hover:bg-[#313D6A]/90 text-white rounded-full px-8 ml-2">Search</Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              onClick={handleCreateNew}
              className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] font-semibold px-8 py-3 rounded-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Course
            </Button>

            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 rounded-full border-[#313D6A]/20">
                  <SelectValue placeholder="Course Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 rounded-full border-[#313D6A]/20">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-24 h-24 text-[#313D6A]/30 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-[#313D6A] mb-4">No courses found</h3>
            <p className="text-[#313D6A]/70 mb-8 max-w-md mx-auto">
              {courses.length === 0
                ? "You haven't created any courses yet. Start by creating your first course!"
                : "No courses match your current filters. Try adjusting your search criteria."}
            </p>
            {courses.length === 0 && (
              <Button
                onClick={handleCreateNew}
                className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] px-8 py-3 rounded-full"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Course
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-0"
              >
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-[#313D6A] to-[#313D6A]/80">
                  <img
                    src={`${API_BASE}${course.thumbnail}` || "/placeholder.svg?height=200&width=400"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${course.course_type === "paid" ? "bg-[#F5BB07] text-[#313D6A]" : "bg-green-500 text-white"
                        } px-3 py-1 rounded-full font-medium`}
                    >
                      {course.subject}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant={course.isActive ? "default" : "secondary"}
                      className={course.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Course Title */}
                  <h3 className="text-lg font-bold text-[#313D6A] mb-2 line-clamp-2 min-h-[3.5rem]">{course.title}</h3>

                  {/* Rating and Students */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-[#F5BB07] text-[#F5BB07]" />
                      <span className="text-sm font-medium text-[#313D6A]">4.8</span>
                      <span className="text-sm text-[#313D6A]/60">(127)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#313D6A]/60">
                      <Users className="w-4 h-4" />
                      {course.total_enrollments || 0} Students
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="flex items-center justify-between text-sm text-[#313D6A]/60 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />1 hr 45 min
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      46 Lectures
                    </div>
                  </div>

                  {/* Instructor Info and Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#313D6A] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{course.title.charAt(0)}</span>
                        {user?.profile_image && (
                          <Avatar>
                            <AvatarImage src={user?.profile_image} />
                          </Avatar>
                        )}
                      </div>
                      <span className="text-sm font-medium text-[#313D6A]">You</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#F5BB07]">
                        {course.courseType === "paid" ? `$${course.price || 20}` : "FREE"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(course.id)}
                      className="flex-1 border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white rounded-full"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent rounded-full"
                          disabled={deletingId === course.id}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Course</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{course.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(course.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredCourses.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-[#F5BB07] border-[#F5BB07] text-[#313D6A] hover:bg-[#F5BB07]/90"
            >
              ←
            </Button>
            {[1, 2, 3, 4].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="icon"
                className={`rounded-full ${page === 1
                  ? "bg-[#313D6A] text-white"
                  : "border-[#313D6A]/20 text-[#313D6A] hover:bg-[#313D6A] hover:text-white"
                  }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-[#F5BB07] border-[#F5BB07] text-[#313D6A] hover:bg-[#F5BB07]/90"
            >
              →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
