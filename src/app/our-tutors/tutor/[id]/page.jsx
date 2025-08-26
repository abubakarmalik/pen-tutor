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
import Image from "next/image"

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="min-h-screen bg-white">
        <div className="animate-pulse p-6 max-w-screen-xl mx-auto">
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#313D6A] mb-2">Tutor not found</h2>
          <p className="text-sm md:text-base text-gray-600 mb-4">The tutor you're looking for doesn't exist.</p>
          <Button
            onClick={() => router.push("/our-tutors")}
            className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A]"
          >
            Back to Tutors
          </Button>
        </div>
      </div>
    )
  }

  return (
    // page bg stays white as requested
    <div className="min-h-screen pb-6 bg-white">
      {/* Top area */}
      <div className="w-full bg-transparent">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-[#313D6A] hover:text-[#F5BB07] hover:bg-[#313D6A]/5 text-sm md:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutors
          </Button>
        </div>
      </div>

      {/* Main grid: left extreme, center content, right extreme */}
      <div className="w-full">
        {/* full-width grid so sidebars can touch the viewport edges */}
        <div className="grid grid-cols-12 gap-6 w-full max-w-full mx-0 px-0">
          {/* Left Sidebar - flush to left edge on large screens */}
          <aside className="col-span-12 lg:col-span-3 px-0 lg:px-0">
            <div className="h-full lg:sticky lg:top-20">
              {/* keep outer (left) corners square while inner (right) side is rounded */}
              <Card className="bg-[#313D6A] text-white border-0 rounded-none lg:rounded-r-2xl lg:rounded-l-none overflow-hidden w-full">
                <CardContent className="p-5">
                  <div className="text-center mb-6">
                    <Avatar className="h-24 w-24 md:h-28 md:w-28 mx-auto mb-4 border-4 border-[#F5BB07]">
                      <AvatarImage src={tutor?.profile_picture || "/placeholder.svg"} alt={getDisplayName(tutor)} />
                      <AvatarFallback className="bg-[#F5BB07] text-[#313D6A] text-xl md:text-2xl font-bold">
                        {isAdmin ? `${tutor?.first_name?.[0] ?? "T"}${tutor?.last_name?.[0] ?? "#"}` : `T${tutor?.id}`}
                      </AvatarFallback>
                    </Avatar>

                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">Tutor ID: PT{tutor?.id}</h2>
                    <p className="text-sm md:text-base text-gray-300 mb-3">Member Since {tutor?.member_since ?? "N/A"}</p>
                  </div>

                  <div className="space-y-2 mb-6 text-sm md:text-base">
                    <div className="flex justify-between">
                      <span className="text-[#F5BB07] font-semibold">Age:</span>
                      <span>{tutor?.age ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F5BB07] font-semibold">City:</span>
                      <span>{tutor?.city ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F5BB07] font-semibold">Total Students:</span>
                      <span>{tutor?.total_students ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F5BB07] font-semibold">Country:</span>
                      <span>{tutor?.country ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F5BB07] font-semibold">Experience:</span>
                      <span>{tutor?.years_of_experience ?? "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F5BB07] font-semibold">Gender:</span>
                      <span>{tutor?.gender ?? "-"}</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] text-sm md:text-base">Book a session</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Center Content */}
          <main className="col-span-12 lg:col-span-6 space-y-6 px-4 lg:px-6">
            {/* Qualification */}
            <div>
              <div>
                <span className="bg-[#F5BB07] inline-flex text-[#313D6A] py-1 px-2 items-center rounded-full text-sm md:text-base">
                  <Award className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Qualification
                </span>
              </div>

              <Card className="border-0 shadow-sm mt-2">
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    {/* Tailwind collapsed-border table - responsive */}
                    <table className="min-w-full table-fixed border border-gray-300 border-collapse text-sm md:text-base">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300 w-1/4">Degree</th>
                          <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300 w-1/4">Subject</th>
                          <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300 w-1/6">Passing Year</th>
                          <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300 w-1/3">Institute</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {(tutor?.education ?? []).map((edu, index) => (
                          <tr key={index} className="odd:bg-white even:bg-gray-50">
                            <td className="px-3 py-2 border border-gray-300 align-top">{edu?.degree ?? "-"}</td>
                            <td className="px-3 py-2 border border-gray-300 align-top">{edu?.subject ?? tutor?.expertise_areas?.[0] ?? "General"}</td>
                            <td className="px-3 py-2 border border-gray-300 align-top">{edu?.year ?? "-"}</td>
                            <td className="px-3 py-2 border border-gray-300 align-top">{edu?.institution ?? "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Experience */}
            <div>
              <div>
                <span className="bg-[#F5BB07] inline-flex text-[#313D6A] py-1 px-2 items-center rounded-full text-sm md:text-base">
                  <Sparkle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Experience
                </span>
              </div>

              <Card className="border-0 shadow-sm mt-2">
                <CardContent className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-fixed border border-gray-300 border-collapse text-sm md:text-base">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">Position</th>
                          <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">From</th>
                          <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">To</th>
                          <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">Institute</th>
                          <th className="px-3 py-2 text-left text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">Experience</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {(tutor?.experience ?? []).length > 0 ? (
                          (tutor?.experience ?? []).map((exp, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                              <td className="px-3 py-2 border border-gray-300 align-top">{exp?.position ?? "-"}</td>
                              <td className="px-3 py-2 border border-gray-300 align-top">{exp?.from ?? "-"}</td>
                              <td className="px-3 py-2 border border-gray-300 align-top">{exp?.to ?? "-"}</td>
                              <td className="px-3 py-2 border border-gray-300 align-top">{exp?.institute ?? "-"}</td>
                              <td className="px-3 py-2 border border-gray-300 align-top">{exp?.years ?? "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-3 py-4 text-center text-gray-500 border border-gray-300">No experience listed.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Video */}
            <div>
              <div>
                <span className="bg-[#F5BB07] inline-flex text-[#313D6A] py-1 px-2 items-center rounded-full text-sm md:text-base">
                  <Clapperboard className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                  Demo Video
                </span>
              </div>

              <Card className="border-0 shadow-sm mt-2">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tutor?.videos?.length > 0 ? (
                      tutor.videos.map((v, i) => (
                        <div key={i} className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#F5BB07] rounded-full flex items-center justify-center">
                              <Play className="h-7 w-7 md:h-8 md:w-8 text-[#313D6A] ml-1" />
                            </div>
                          </div>
                          {v?.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">No thumbnail</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2">
                        <div className="py-4 text-center text-gray-500">No videos available.</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

          </main>

          {/* Right Sidebar - flush to right edge on large screens */}
          <aside className="col-span-12 bg-[#FFFCE0] lg:col-span-3 px-0 lg:px-0">
            <div className="h-full bg-[#FFFCE0] lg:sticky lg:top-20">
              {/* keep outer (right) corners square while inner (left) side is rounded */}
              <Card className="bg-[#FFFCE0] rounded-none lg:rounded-l-2xl lg:rounded-r-none overflow-hidden w-full border">
                <CardHeader className="text-[#313D6A]">
                  <CardTitle className="text-lg md:text-xl font-bold flex items-center justify-center gap-2">
                    <Users className="h-5 w-5" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-sm md:text-base">
                  {/* Days Availability */}
                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Days Availability</div>
                    <div className="p-3 border border-gray-200 space-y-1">
                      {getAvailabilityDays(tutor?.availability_schedule).map((slot, index) => (
                        <div key={index} className="flex items-center text-sm md:text-base">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span>{slot.day}{slot.time ? ` — ${slot.time}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Availability */}
                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Time Availability</div>
                    <div className="p-3 rounded-b ">
                      <div className="flex items-center text-sm md:text-base">
                        <Clock className="h-4 w-4 text-[#F5BB07] mr-2" />
                        <span>{tutor?.time_availability ?? "Morning, Evening"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Areas */}
                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Areas To Teach</div>
                    <div className="p-3 rounded-b ">
                      <div className="flex items-center text-sm md:text-base">
                        <Globe className="h-4 w-4 text-[#F5BB07] mr-2" />
                        <span>{(tutor?.expertise_areas || []).join(", ") || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Available For Online Teaching</div>
                    <div className="p-3 rounded-b ">
                      <div className="text-sm md:text-base">
                        <div className={`font-semibold ${tutor?.online ? "text-green-600" : "text-gray-600"}`}>{tutor?.online ? "Yes" : "No"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Home Tutoring Status</div>
                    <div className="p-3 rounded-b ">
                      <div className="text-sm md:text-base">
                        <div className={`font-semibold ${tutor?.home_tutoring ? "text-green-600" : "text-gray-600"}`}>{tutor?.home_tutoring ? "Yes" : "No"}</div>
                        <div className="text-gray-600">City: {tutor?.city ?? "-"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Offering Subjects</div>
                    <div className="p-3 rounded-b space-y-1 text-sm md:text-base">
                      {(tutor?.expertise_areas ?? []).map((subject, index) => (
                        <div key={index}>
                          <span className="font-semibold">{subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Teaching Language</div>
                    <div className="p-3 rounded-b space-y-1 text-sm md:text-base">
                      <div className="text-sm md:text-base">{(tutor?.languages_spoken ?? []).join(" & ") || "N/A"}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Fee</div>
                    <div className="p-3 rounded-b space-y-1 text-sm md:text-base">
                      <div className="text-sm md:text-base font-semibold text-[#313D6A]">Charge/Hour: {tutor?.hourly_rate ?? "N/A"}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#313D6A] inline-block text-white px-3 py-2 rounded-full text-sm font-semibold">Languages</div>
                    <div className="p-3 rounded-b space-y-2">
                      {(tutor?.languages_spoken ?? []).map((language, index) => (
                        <div key={index} className="flex items-center justify-between text-sm md:text-base">
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
