"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  Globe,
  Award,
  CheckCircle,
  Play,
  Clapperboard,
  Sparkle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import axios from "axios"

export default function TutorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tutorId = params.id
  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

  // Check user role from localStorage
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

  const fetchTutorDetail = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/courses/teachers/${tutorId}`)
      if (response.status === 200) {
        setTutor(response.data)
      } else {
        throw new Error("Failed to fetch tutor details")
      }
    } catch (error) {
      console.error("Error fetching tutor detail:", error)
      toast.error("Failed to load tutor details")
      setTutor(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tutorId) fetchTutorDetail()
  }, [tutorId])

  const getDisplayName = (teacher) => {
    if (!teacher) return "Teacher"
    if (isAdmin) return `${teacher.first_name} ${teacher.last_name}`
    return `Teacher #${teacher.id}`
  }

  const getAvailabilityDays = (schedule) => {
    if (!schedule || typeof schedule !== "object") return []
    return Object.entries(schedule).map(([day, time]) => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      time: Array.isArray(time) ? time.join(", ") : time,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCE0]">
        <div className="animate-pulse p-6">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="h-96 bg-gray-200 rounded lg:col-span-3"></div>
            <div className="h-96 bg-gray-200 rounded lg:col-span-6"></div>
            <div className="h-96 bg-gray-200 rounded lg:col-span-3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-[#FFFCE0] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#313D6A] mb-2">Tutor not found</h2>
          <p className="text-gray-600 mb-4">The tutor you're looking for doesn't exist.</p>
          <Button
            onClick={() => router.push("/our-tutor")}
            className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A]"
          >
            Back to Tutors
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-6 bg-white">
      {/* Top area */}
      <div className="w-full bg-white">
        <div className="grid grid-cols-12 gap-6 max-w-[1200px] mx-auto px-6 ml-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-[#313D6A] hover:text-[#F5BB07] hover:bg-[#313D6A]/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutors
          </Button>
        </div>
      </div>

      {/* Main grid: left extreme, center content, right extreme */}
      <div className="w-full">
        <div className="grid grid-cols-12 gap-6 max-w-[1200px]">
          {/* Left Sidebar - extreme left (col-span-2) */}
          <aside className="col-span-12 lg:col-span-3 px-4 lg:px-0">
            <div className="h-full">
              <Card className="bg-[#313D6A] text-white border-0 lg:rounded-r-2xl lg:rounded-l-none rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="h-28 w-28 mx-auto mb-4 border-4 border-[#F5BB07]">
                      <AvatarImage src={tutor.profile_picture || "/placeholder.svg"} alt={getDisplayName(tutor)} />
                      <AvatarFallback className="bg-[#F5BB07] text-[#313D6A] text-2xl font-bold">
                        {isAdmin ? `${tutor.first_name?.[0] ?? "T"}${tutor.last_name?.[0] ?? "#"}` : `T${tutor.id}`}
                      </AvatarFallback>
                    </Avatar>

                    <h2 className="text-xl font-bold mb-2">Tutor ID: PT{tutor.id}</h2>
                    <p className="text-sm text-gray-300 mb-4">Member Since {tutor.member_since || "N/A"}</p>
                  </div>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex space-x-2">
                      <span className="text-[#F5BB07] font-semibold">Age:</span>
                      <span>{tutor.age ?? "-"}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-[#F5BB07] font-semibold">City:</span>
                      <span>{tutor.city ?? "-"}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-[#F5BB07] font-semibold">Total Students:</span>
                      <span>{tutor.total_students ?? "-"}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-[#F5BB07] font-semibold">Country:</span>
                      <span>{tutor.country ?? "-"}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-[#F5BB07] font-semibold">Experience:</span>
                      <span>{tutor.years_of_experience ?? "-"}</span>
                    </div>
                    <div className="flex space-x-2">
                      <span className="text-[#F5BB07] font-semibold">Gender:</span>
                      <span>{tutor.gender ?? "-"}</span>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3">
                    <Button className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A]">Book a session</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Center Content */}
          <main className="col-span-12 lg:col-span-6 space-y-6">
            {/* Qualification */}
            <div className="pl-6 md:pl-0">
              <span className="bg-[#F5BB07] inline-flex text-[#313D6A] py-1 px-2 items-center rounded-full">
                <Award className="h-5 w-5 mr-2" />
                Qualification
              </span>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    {/* Tailwind collapsed-border table */}
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-500 border-collapse text-sm">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-500">Degree</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-500">Subject</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-500">Passing Year</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-500">Institute</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {(tutor.education ?? []).map((edu, index) => (
                          <tr key={index} className="odd:bg-white even:bg-gray-50">
                            <td className="px-3 py-2 border border-gray-500 align-top">{edu.degree}</td>
                            <td className="px-3 py-2 border border-gray-500 align-top">{edu.subject ?? tutor.expertise_areas?.[0] ?? "General"}</td>
                            <td className="px-3 py-2 border border-gray-500 align-top">{edu.year}</td>
                            <td className="px-3 py-2 border border-gray-500 align-top">{edu.institution}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Experience */}
            <div className="pl-6 md:pl-0">
              <span className="bg-[#F5BB07] inline-flex text-[#313D6A] py-1 px-2 items-center rounded-full">
                <Sparkle className="h-5 w-5 mr-2" />
                Experience
              </span>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-500 border-collapse text-sm">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-500">Position</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-500">From</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-500">To</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-500">Institute</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border border-gray-500">Experience</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {(tutor.experience ?? []).length > 0 ? (
                          (tutor.experience ?? []).map((exp, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                              <td className="px-3 py-2 border border-gray-500 align-top">{exp.position}</td>
                              <td className="px-3 py-2 border border-gray-500 align-top">{exp.from}</td>
                              <td className="px-3 py-2 border border-gray-500 align-top">{exp.to}</td>
                              <td className="px-3 py-2 border border-gray-500 align-top">{exp.institute}</td>
                              <td className="px-3 py-2 border border-gray-500 align-top">{exp.years}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-3 py-4 text-center text-gray-500 border border-gray-500">No experience listed.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Video */}
            <div className="pl-6 md:pl-0">
              <span className="bg-[#F5BB07] inline-flex text-[#313D6A] py-1 px-2 items-center rounded-full">
                <Clapperboard className="h-5 w-5 mr-2" />
                Demo Video
              </span>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tutor.videos?.length > 0 ? tutor.videos.map((v, i) => (
                      <div key={i} className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-16 h-16 bg-[#F5BB07] rounded-full flex items-center justify-center">
                            <Play className="h-8 w-8 text-[#313D6A] ml-1" />
                          </div>
                        </div>
                        <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                      </div>
                    )) : (
                      <div className="col-span-2">
                        <div className="py-4 text-center text-gray-500">No videos available.</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>

          {/* Right Sidebar - extreme right (col-span-2) */}
          <aside className="col-span-12 lg:col-span-3 px-4 lg:px-0">
            <div className="h-full">
              <Card className="bg-[#FFFCE0] lg:rounded-l-2xl lg:rounded-r-none rounded-xl overflow-hidden">
                <CardHeader className="text-[#313D6A] py-3">
                  <CardTitle className="text-lg font-bold flex flex-col items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Days Availability */}
                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Days Availability</div>
                    <div className=" p-3 border-gray-500 space-y-1">
                      {getAvailabilityDays(tutor.availability_schedule).map((slot, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>{slot.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Availability */}
                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Time Availability</div>
                    <div className=" p-3 rounded-b ">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-[#F5BB07] mr-2" />
                        <span>{tutor.time_availability ?? "Morning, Evening"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Area, Online, Home, Subjects, Languages, Fee - kept the same but safe-guarded */}
                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Areas To Teach</div>
                    <div className=" p-3 rounded-b ">
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 text-[#F5BB07] mr-2" />
                        <span>{(tutor.expertise_areas || []).join(", ") || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Available For Online Teaching</div>
                    <div className=" p-3 rounded-b ">
                      <div className="text-sm">
                        <div className={`font-semibold ${tutor.online ? "text-green-600" : "text-gray-600"}`}>{tutor.online ? "Yes" : "No"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Home Tutoring Status</div>
                    <div className=" p-3 rounded-b ">
                      <div className="text-sm">
                        <div className={`font-semibold ${tutor.home_tutoring ? "text-green-600" : "text-gray-600"}`}>{tutor.home_tutoring ? "Yes" : "No"}</div>
                        <div className="text-gray-600">City: {tutor.city ?? "-"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] text-white px-3 py-2 rounded-full text-sm font-semibold">Offering Subjects</div>
                    <div className="p-3 rounded-b space-y-1 text-sm">
                      {(tutor.expertise_areas ?? []).map((subject, index) => (
                        <div key={index}>
                          <span className="font-semibold">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] text-white px-3 py-2 rounded-full text-sm font-semibold">Teaching Language</div>
                    <div className="p-3 rounded-b space-y-1 text-sm">
                      <div className="text-sm">{(tutor.languages_spoken ?? []).join(" & ") || "N/A"}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] text-white px-3 py-2 rounded-full text-sm font-semibold">Fee</div>
                    <div className="p-3 rounded-b space-y-1 text-sm">
                      <div className="text-sm font-semibold text-[#313D6A]">Charge/Hour: {tutor.hourly_rate ?? "N/A"}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] text-white px-3 py-2 rounded-full text-sm font-semibold">Languages</div>
                    <div className="p-3 rounded-b space-y-2">
                      {(tutor.languages_spoken ?? []).map((language, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{language}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-[#F5BB07] fill-current" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
