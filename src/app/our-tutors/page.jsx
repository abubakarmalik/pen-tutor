"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"

import TeacherImage from "@/assets/images/our-tutors/teacher.webp"
import MaleTeacher from "@/assets/images/our-tutors/male-teacher.webp"
import Image from "next/image"

export default function OurTutorPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [gradeFilter, setGradeFilter] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const tutorsPerPage = 6

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        setIsAdmin(userData.role === "admin")
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/courses/teachers/`)

      if (response.data.success) {
        setTeachers(response.data.data || [])
      } else {
        throw new Error("Failed to fetch teachers")
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
      toast.error("Failed to load tutors")
      setTeachers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      searchQuery === "" ||
      teacher.expertise_areas.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      teacher.course_categories.some((category) => category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (isAdmin &&
        (teacher.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.last_name.toLowerCase().includes(searchQuery.toLowerCase())))

    // For now, we'll keep the existing filtering logic since grade and city aren't in the API response
    return matchesSearch
  })

  const handleTutorClick = (tutorId) => {
    router.push(`/our-tutors/tutor/${tutorId}`)
  }

  const getDisplayName = (teacher) => {
    if (isAdmin) {
      return `${teacher.first_name} ${teacher.last_name}`
    }
    return `Teacher #${teacher.id}`
  }

  const totalPages = Math.ceil(filteredTeachers.length / tutorsPerPage)
  const currentTutors = filteredTeachers.slice(currentPage * tutorsPerPage, (currentPage + 1) * tutorsPerPage)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const handleSearch = () => {
    setCurrentPage(0) // Reset to first page when searching
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFCE0" }}>
      <div className="relative">
        <div className="relative min-h-[600px] overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#F5BB07] rounded-full opacity-20 -translate-x-32 -translate-y-32"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5BB07] rounded-full opacity-20 translate-x-32 -translate-y-32"></div>

          {/* Hero Content Container */}
          <section className="relative z-10 container mx-auto pt-6 sm:pt-8 lg:pt-12 pb-8">
            {/* Decorative background rings */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* Left Ring */}
              <div className="absolute lg:hidden top-44 -left-20 w-40 h-40 rounded-full border-4 border-[#F5BB07]/60" />
              {/* Right Ring */}
              <div className="absolute lg:hidden bottom-8 -right-16 w-32 h-32 rounded-full border-4 border-[#313D6A]/60 " />
            </div>

            {/* Top area with heading and side images */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 min-h-[240px] sm:min-h-[300px] lg:min-h-[420px]">

                {/* LEFT IMAGE */}
                <div className="hidden sm:flex justify-center lg:justify-start">
                  <div
                    className="relative w-32 h-44 sm:w-40 sm:h-56 md:w-56 md:h-72 lg:w-72 lg:h-[420px] rounded-lg overflow-hidden transform sm:translate-y-4 md:translate-y-6 lg:translate-y-12"
                    aria-hidden="true"
                  >
                    <Image
                      src={TeacherImage}
                      alt="Female Tutor"
                      fill
                      className="object-cover object-center"
                      priority
                      quality={90}
                      sizes="(max-width: 640px) 128px, (max-width: 1024px) 224px, 320px"
                    />
                  </div>
                </div>

                {/* CENTER HEADING */}
                <div className="flex justify-center text-center px-2 sm:px-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-[#313D6A] leading-snug sm:leading-tight">
                    Certified Tutors
                  </h1>
                </div>

                {/* RIGHT IMAGE */}
                <div className="hidden sm:flex justify-center lg:justify-end">
                  <div
                    className="relative w-32 h-44 sm:w-40 sm:h-56 md:w-56 md:h-72 lg:w-72 lg:h-[420px] rounded-lg overflow-hidden transform sm:translate-y-4 md:translate-y-6 lg:translate-y-12"
                    aria-hidden="true"
                  >
                    <Image
                      src={MaleTeacher}
                      alt="Male Tutor"
                      fill
                      className="object-cover object-center"
                      priority
                      quality={90}
                      sizes="(max-width: 640px) 128px, (max-width: 1024px) 224px, 320px"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEARCH BLOCK */}
            <div className="relative z-20 -mt-6 sm:-mt-8 md:-mt-14">
              <div className="max-w-5xl mx-auto relative px-3 sm:px-4">

                {/* Floating button */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 sm:-top-8 md:-top-12 z-30">
                  <button className="bg-black text-[#F5BB07] px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-3 rounded-t-lg font-bold text-sm sm:text-base md:text-lg">
                    Search Tutor
                  </button>
                </div>

                {/* Yellow pill */}
                <div className="bg-[#F5BB07] rounded-lg md:rounded-full p-3 sm:p-4 md:px-6 md:mt-6 shadow-xl">
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                    <input
                      placeholder="Enter Any Subject"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full md:flex-1 bg-white border-0 rounded-lg lg:rounded-l-full lg:rounded-r-none h-12 sm:h-14 text-gray-700 placeholder:text-gray-500 text-sm sm:text-base md:text-lg text-center md:text-left font-medium px-3 sm:px-4"
                    />
                    <input
                      placeholder="Enter Any Grade To Search"
                      value={gradeFilter}
                      onChange={(e) => setGradeFilter(e.target.value)}
                      className="w-full md:flex-1 bg-white border-0 rounded-lg lg:rounded-none h-12 sm:h-14 text-gray-700 placeholder:text-gray-500 text-sm sm:text-base md:text-lg text-center md:text-left font-medium px-3 sm:px-4"
                    />
                    <input
                      placeholder="Enter City / Area To Search"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="w-full md:flex-1 bg-white border-0 rounded-lg lg:rounded-l-md lg:rounded-r-full h-12 sm:h-14 text-gray-700 placeholder:text-gray-500 text-sm sm:text-base md:text-lg text-center md:text-left font-medium px-3 sm:px-4"
                    />
                  </div>
                </div>

                {/* Main Search button */}
                <div className="flex justify-center mt-3 sm:mt-4">
                  <button
                    onClick={handleSearch}
                    className="bg-black hover:bg-gray-800 text-[#F5BB07] px-8 sm:px-12 md:px-16 py-2 md:py-3 rounded-full text-base sm:text-lg md:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <div className="bg-[#313D6A] py-4 text-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <h2 className="text-2xl md:text-2xl lg:text-4xl font-bold text-white">REGISTERED TUTORS</h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[#313D6A] text-lg mb-2">No tutors found</div>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentTutors.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border-2 border-gray-100 hover:border-[#F5BB07]"
                  onClick={() => handleTutorClick(teacher.id)}
                >
                  <CardContent className="p-6 text-center">
                    {/* Profile Picture */}
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-20 w-20 border-4 border-gray-200">
                        <AvatarImage
                          src={teacher.profile_picture || "/placeholder.svg"}
                          alt={getDisplayName(teacher)}
                        />
                        <AvatarFallback className="bg-[#313D6A] text-white text-xl">
                          {isAdmin ? `${teacher.first_name[0]}${teacher.last_name[0]}` : `T${teacher.id}`}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* ID Badge */}
                    <div className="mb-4">
                      <Badge className="bg-[#F5BB07] text-black font-bold px-3 py-1">
                        ID: PT{teacher.id.toString().padStart(3, "0")}
                      </Badge>
                    </div>

                    {/* Teacher Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#313D6A]">Qualification:</span>
                        <span className="text-gray-700">{teacher?.education[0]?.degree}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-semibold text-[#313D6A]">Experience:</span>
                        <span className="text-gray-700">{teacher?.years_of_experience}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-semibold text-[#313D6A]">Areas To Teach:</span>
                        <span className="text-gray-700">
                          {teacher.expertise_areas.slice(0, 1).join(", ") || "Multiple"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-semibold text-[#313D6A]">Age:</span>
                        <span className="text-gray-700">{teacher?.age}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-semibold text-[#313D6A]">Course Category:</span>
                        <span className="text-gray-700">{teacher?.course_categories[0] || "Multiple"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-semibold text-[#313D6A]">Teaching Method:</span>
                        <span className="text-gray-700">{teacher?.preferred_teaching_methods[0] || "Multiple"}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-2 mt-6">
                      <Button
                        className="flex-1 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-medium"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTutorClick(teacher.id)
                        }}
                      >
                        View Full Profile
                      </Button>
                      <Button
                        className="flex-1 bg-[#313D6A] hover:bg-[#313D6A]/90 text-white font-medium"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle trial class booking
                          toast.success("Trial class booking feature coming soon!")
                        }}
                      >
                        Take Trial Class
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
