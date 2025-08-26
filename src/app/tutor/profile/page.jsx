"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import axios from "axios"

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  Globe,
  Clock,
  Star,
  Users,
  BookOpen,
  Edit,
  ExternalLink,
  Languages,
  Briefcase,
  CheckCircle,
  PlayCircle,
  Linkedin,
  Github,
} from "lucide-react"

export default function TutorProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // support either env var name you used before, fallback to localhost
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
      try {
        // read token only in browser runtime
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const response = await axios.get(`${API_BASE}/api/auth/profile/update/`, {
          headers,
        })

        // axios doesn't have response.ok; check status
        if (response.status !== 200 && response.status !== 201) {
          throw new Error(`Failed to fetch profile (status ${response.status})`)
        }

        // support both shapes: { data: { ... } } or direct payload
        const payload = response.data?.data ?? response.data
        if (isMounted) setProfile(payload)
      } catch (err) {
        console.error("Tutor profile fetch error:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchProfile()

    return () => {
      isMounted = false
    }
  }, [API_BASE])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCE0]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#313D6A] mx-auto mb-4"></div>
            <p className="text-[#313D6A] font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#FFFCE0]">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4 font-medium">Error: {error || "Profile not found"}</p>
            <Button
              onClick={() => (typeof window !== "undefined" ? window.location.reload() : null)}
              className="bg-[#F5BB07] hover:bg-[#E5A906] text-[#313D6A] font-semibold"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const safe = (v, fallback = "—") => (v === null || v === undefined || v === "" ? fallback : v)

  const formatTeachingMethod = (method = "") => {
    return method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatCourseCategory = (category = "") => {
    return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const profilePictureSrc =
    profile?.profile_picture && profile.profile_picture.startsWith("http")
      ? profile.profile_picture
      : profile?.profile_picture
        ? `${API_BASE}${profile.profile_picture}`
        : "/placeholder.svg?height=128&width=128&text=Profile"

  const expertiseAreas = profile?.expertise_areas ?? []
  const certifications = profile?.certifications ?? []
  const education = profile?.education ?? []
  const languagesSpoken = profile?.languages_spoken ?? []
  const preferredTeachingMethods = profile?.preferred_teaching_methods ?? []
  const courseCategories = profile?.course_categories ?? []
  const availabilitySchedule = profile?.availability_schedule ?? {}
  const userVerified = profile?.user?.is_verified ?? false
  const averageRating =
    profile?.average_rating !== undefined && profile.average_rating !== null ? Number(profile.average_rating) : null

  return (
    <div className="min-h-screen bg-white">
      {/* <div className="bg-[#313D6A] text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-blue-200 mt-1">Manage your professional information</p>
            </div>
            <Button className="bg-[#F5BB07] hover:bg-[#E5A906] text-[#313D6A] font-semibold">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-3">
            <Card className="bg-[#313D6A] rounded-none rounded-r-lg text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#F5BB07] mx-auto">
                    <Image
                      src={profilePictureSrc || "/placeholder.svg"}
                      alt={profile?.full_name ?? "Profile"}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {userVerified && (
                    <div className="absolute -bottom-2 -right-8 bg-[#F5BB07] rounded-full p-2">
                      <CheckCircle className="h-4 w-4 text-[#313D6A]" />
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold mb-2">{safe(profile?.full_name, "")}</h2>
                <p className="text-blue-200 text-sm mb-4">{safe(profile?.headline, "")}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#F5BB07]" />
                    <span>
                      {safe(profile?.city)}, {safe(profile?.country)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#F5BB07]" />
                    <span>{((profile?.employment_type || "") + "").replace(/_/g, " ").toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-[#F5BB07]" />
                    <span>{safe(profile?.years_of_experience, 0)} Years Experience</span>
                  </div>
                </div>

                <Separator className="my-4 bg-blue-700" />

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1 text-[#F5BB07]">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{averageRating !== null ? averageRating.toFixed(1) : "—"}</span>
                  </div>
                  <div className="text-2xl font-bold text-[#F5BB07]">${safe(profile?.hourly_rate, "0")}/hr</div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  {profile?.linkedin_profile && (
                    <a
                      href={profile.linkedin_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F5BB07] hover:text-white transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {profile?.github_profile && (
                    <a
                      href={profile.github_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F5BB07] hover:text-white transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {profile?.youtube_channel && (
                    <a
                      href={profile.youtube_channel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F5BB07] hover:text-white transition-colors"
                    >
                      <PlayCircle className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 bg-[#F5BB07] text-[#313D6A] px-3 py-2 rounded-full">
                <User className="h-5 w-5" />
                <span className="font-semibold text-sm md:text-base">Professional Details</span>
              </div>
            </div>
            <Card className="border-l-4 overflow-hidden p-0]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-[#313D6A] block mb-1">Bio</label>
                    <p className="text-gray-700 leading-relaxed">{safe(profile?.bio, "")}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#313D6A] block mb-1">Age</label>
                      <p className="text-gray-700">{safe(profile?.age, "—")} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#313D6A] block mb-1">Gender</label>
                      <p className="text-gray-700 capitalize">{safe(profile?.gender, "")}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#313D6A] block mb-1">Department</label>
                    <p className="text-gray-700">{safe(profile?.department, "")}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#313D6A] block mb-1">Teaching Style</label>
                    <p className="text-gray-700">{safe(profile?.teaching_style, "")}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#313D6A] block mb-2">Expertise Areas</label>
                    <div className="flex flex-wrap gap-2">
                      {expertiseAreas.map((area, index) => (
                        <Badge key={index} className="bg-[#313D6A] text-white hover:bg-[#2A3458]">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="inline-block">
              <div className="inline-flex items-center gap-2 bg-[#F5BB07] py-2 px-4 text-[#313D6A] rounded-full">
                <GraduationCap className="h-5 w-5" />
                <span className="font-semibold text-sm md:text-base">Education & Qualifications</span>
              </div>
            </div>
            <Card className="border-l-4 p-0 overflow-hidden ">
              <CardContent className="p-0">
                {education.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No education data available</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#313D6A] uppercase tracking-wider">
                            Degree
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#313D6A] uppercase tracking-wider">
                            Institution
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-[#313D6A] uppercase tracking-wider">
                            Year
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {education.map((edu, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-[#313D6A]">{safe(edu.degree, "")}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{safe(edu.institution, "")}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{safe(edu.year, "")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {certifications.length > 0 && (
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <h4 className="font-semibold text-[#313D6A] mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-[#F5BB07]/20 text-[#313D6A] text-sm font-medium border border-[#F5BB07]/50"
                        >
                          {safe(cert.name, "")} <span className="text-xs text-gray-600">(Year: {safe(cert.year, "")})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="inline-block">
              <div className="inline-flex items-center gap-2 bg-[#F5BB07] py-2 px-4 text-[#313D6A] rounded-full">
                <Languages className="h-5 w-5" />
                <span className="font-semibold text-sm md:text-base">Teaching & Languages</span>
              </div>
            </div>
            <Card className="border-l-4 p-0 overflow-hidden">
              <CardContent className="p-6 space-y-6">
                {/* Languages */}
                <div>
                  <label className="text-sm font-semibold text-[#313D6A] block mb-2">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {languagesSpoken.length === 0 ? (
                      <span className="text-gray-500 text-sm">No languages listed</span>
                    ) : (
                      languagesSpoken.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full border border-[#313D6A] text-[#313D6A] text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Teaching Methods */}
                <div>
                  <label className="text-sm font-semibold text-[#313D6A] block mb-2">Teaching Methods</label>
                  <div className="flex flex-wrap gap-2">
                    {preferredTeachingMethods.map((method, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-[#F5BB07] text-[#313D6A] text-sm font-medium hover:bg-[#E5A906]"
                      >
                        {formatTeachingMethod(method)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Course Categories */}
                <div>
                  <label className="text-sm font-semibold text-[#313D6A] block mb-2">Course Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {courseCategories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-[#313D6A] text-white text-sm font-medium hover:bg-[#2A3458]"
                      >
                        {formatCourseCategory(category)}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card> 

          </div>

          {/* Right Sidebar - Stats and Status */}
          <div className="lg:col-span-3 bg-[#FFFCE0] rounded-none rounded-l-lg  space-y-6">
            <Card className="bg-[#FFFCE0] shadow-none border-none rounded-none rounded-l-lg ">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-[#313D6A] text-lg">Teaching Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-white rounded-lg border border-[#F5BB07]">
                  <BookOpen className="h-6 w-6 text-[#313D6A] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#313D6A]">{safe(profile?.total_courses, 0)}</div>
                  <div className="text-sm text-gray-600">Total Courses</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg border border-[#F5BB07]">
                  <Users className="h-6 w-6 text-[#313D6A] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#313D6A]">{safe(profile?.total_students, 0)}</div>
                  <div className="text-sm text-gray-600">Students Taught</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg border border-[#F5BB07]">
                  <Clock className="h-6 w-6 text-[#313D6A] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#313D6A]">{safe(profile?.total_course_hours, 0)}</div>
                  <div className="text-sm text-gray-600">Course Hours</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#FFFCE0] shadow-none border-none rounded-none rounded-l-lg ">
              <CardHeader>
                <CardTitle className="text-[#313D6A] text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-[#F5BB07]" />
                  <span className="text-gray-700">{safe(profile?.email)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-[#F5BB07]" />
                  <span className="text-gray-700">{safe(profile?.phone)}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#F5BB07] mt-0.5" />
                  <span className="text-gray-700">{safe(profile?.address, "")}</span>
                </div>
              </CardContent>
            </Card>

            {(profile?.resume || profile?.degree_certificates) && (
              <Card className="bg-[#FFFCE0] shadow-none border-none rounded-none rounded-l-lg ">
                <CardHeader>
                  <CardTitle className="text-[#313D6A] text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {profile?.resume && (
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#313D6A] hover:text-[#2A3458] text-sm p-2 rounded hover:bg-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Resume
                    </a>
                  )}
                  {profile?.degree_certificates && (
                    <a
                      href={profile.degree_certificates}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#313D6A] hover:text-[#2A3458] text-sm p-2 rounded hover:bg-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Degree Certificates
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* <Card className="border-l-4 border-l-[#F5BB07]">
          <CardHeader className="bg-[#F5BB07] text-[#313D6A]">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Availability Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {Object.entries(availabilitySchedule).length === 0 ? (
              <div className="text-center text-gray-500 py-8">No availability schedule set.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {Object.entries(availabilitySchedule).map(([day, times]) => (
                  <div key={day} className="text-center">
                    <div className="font-semibold text-[#313D6A] mb-3 pb-2 border-b border-[#F5BB07]">{day}</div>
                    <div className="space-y-2">
                      {(times || []).map((time, index) => (
                        <div key={index} className="bg-[#313D6A] text-white text-xs px-3 py-2 rounded-full">
                          {time}
                        </div>
                      ))}
                      {(!times || times.length === 0) && <div className="text-gray-400 text-xs">Not Available</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div >
  )
}
