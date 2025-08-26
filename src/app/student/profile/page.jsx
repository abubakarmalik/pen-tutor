"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import axios from "axios"
import {
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  Github,
  Linkedin,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StudentProfile() {
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    let isMounted = true

    const fetchStudentData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null

        if (!token) {
          console.warn("No access token found in localStorage")
          if (isMounted) setLoading(false)
          return
        }

        const response = await axios.get(`${API_BASE}/api/auth/profile/update/`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 200) {
          const payload = response.data?.data ?? response.data
          if (isMounted) setStudentData(payload)
        } else {
          console.warn("Unexpected status while fetching profile:", response.status)
        }
      } catch (error) {
        console.error("Error fetching student data:", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchStudentData()

    return () => {
      isMounted = false
    }
  }, [API_BASE])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-28 w-28 border-b-2 border-[#313D6A]"></div>
      </div>
    )
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#313D6A] mb-2">Profile Not Found</h2>
          <p className="text-sm md:text-base text-gray-600">Unable to load student profile data.</p>
        </div>
      </div>
    )
  }

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase()

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const profilePictureSrc = studentData?.profile_picture ? `${API_BASE}${studentData.profile_picture}` : "/placeholder.svg"

  return (
    // keep page bg white and make sidebars flush on large screens
    <div className="min-h-screen py-3 lg:py-6 bg-white">
      {/* full-width grid so sidebars can touch viewport edges */}
      <div className="grid grid-cols-12 gap-6 w-full max-w-full mx-0 px-0">
        {/* Left Sidebar - flush to left edge */}
        <aside className="col-span-12 lg:col-span-3 px-0 lg:px-0">
          <div className="h-full lg:sticky lg:top-6">
            <div className="bg-[#313D6A] text-white rounded-none lg:rounded-r-2xl lg:rounded-l-none p-6 w-full">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-[#F5BB07]">
                  <AvatarImage src={profilePictureSrc} alt={studentData.full_name || "Student"} />
                  <AvatarFallback className="text-xl bg-[#F5BB07] text-[#313D6A]">{getInitials(studentData.full_name)}</AvatarFallback>
                </Avatar>

                <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-1">{studentData.full_name}</h2>
                <p className="text-xs md:text-sm text-blue-200 mb-2">Student ID: ST{studentData.id || "143"}</p>
                <p className="text-xs md:text-sm text-blue-200">Member Since {formatDate(studentData.created_at) || "June 4, 2023"}</p>
              </div>

              <div className="space-y-2 text-sm md:text-base">
                <div>
                  <span className="text-[#F5BB07] font-semibold">Gender:</span> {studentData.gender || "—"}
                </div>
                <div>
                  <span className="text-[#F5BB07] font-semibold">City:</span> {studentData.city || "—"}
                </div>
                <div>
                  <span className="text-[#F5BB07] font-semibold">Country:</span> {studentData.country || "—"}
                </div>
                <div>
                  <span className="text-[#F5BB07] font-semibold">Institution:</span> {studentData.institution || "—"}
                </div>
                <div>
                  <span className="text-[#F5BB07] font-semibold">Field:</span> {studentData.field_of_study || "—"}
                </div>
                <div>
                  <span className="text-[#F5BB07] font-semibold">Level:</span> {studentData.education_level?.replace(/_/g, " ") || "—"}
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                {studentData.linkedin_profile && (
                  <a href={studentData.linkedin_profile} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {studentData.github_profile && (
                  <a href={studentData.github_profile} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-900 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {studentData.portfolio_website && (
                  <a href={studentData.portfolio_website} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-green-600 rounded flex items-center justify-center hover:bg-green-700 transition-colors">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Content */}
        <main className="col-span-12 lg:col-span-6 space-y-6 px-4 lg:px-6">
          <div className="bg-[#F5BB07] inline-flex rounded-full px-6 py-2">
            <h3 className="text-[#313D6A] font-bold flex items-center gap-2 text-base md:text-lg">
              <GraduationCap className="w-5 h-5" />
              Academic Qualifications
            </h3>
          </div>
          <div className="bg-white rounded-none lg:rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">Degree</th>
                    <th className="px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">Institution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm md:text-base text-gray-900">{studentData.education_level?.replace(/_/g, " ") || "Bachelor"}</td>
                    <td className="px-6 py-4 text-sm md:text-base text-gray-900">{studentData.field_of_study || "Computer Science"}</td>
                    <td className="px-6 py-4 text-sm md:text-base text-gray-900">{studentData.graduation_year || "2024"}</td>
                    <td className="px-6 py-4 text-sm md:text-base text-gray-900">{studentData.institution || "University"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#313D6A] inline-flex rounded-full px-6 py-2">
            <h3 className="text-white font-bold flex items-center gap-2 text-base md:text-lg">
              <Briefcase className="w-5 h-5" />
              Skills & Experience
            </h3>
          </div>
          <div className="bg-white rounded-none lg:rounded-lg overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#313D6A] mb-3 text-sm md:text-base">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(studentData.skills || ["JavaScript", "React", "Python"]).map((skill, index) => (
                      <Badge key={index} className="bg-[#F5BB07] text-[#313D6A] hover:bg-[#F5BB07]/80 text-xs md:text-sm">{typeof skill === "string" ? skill : skill.name}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-[#313D6A] mb-3 text-sm md:text-base">Career Information</h4>
                  <div className="space-y-2 text-sm md:text-base">
                    <div>
                      <span className="font-medium">Status:</span> {studentData.employment_status || "Student"}
                    </div>
                    <div>
                      <span className="font-medium">Position:</span> {studentData.current_job_title || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Company:</span> {studentData.company || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(studentData.certificates || []).length > 0 && (
            <>
              <div className="bg-[#F5BB07] inline-flex rounded-full px-6 py-2">
                <h3 className="text-[#313D6A] font-bold flex items-center gap-2 text-base md:text-lg">
                  <Award className="w-5 h-5" />
                  Certificates & Achievements
                </h3>
              </div>
              <div className="bg-white rounded-none lg:rounded-lg overflow-hidden shadow-sm">
                <div className="p-6">
                  <div className="space-y-3">
                    {(studentData.certificates || []).map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-[#313D6A] text-sm md:text-base">{typeof cert.name === "string" ? cert.name : cert.name.name}</h4>
                          <p className="text-xs md:text-sm text-gray-600">Uploaded on {formatDate(cert.uploaded_at)}</p>
                        </div>
                        <Badge className="bg-[#313D6A] text-white text-xs md:text-sm">Certified</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Right Sidebar - flush to right edge */}
        <aside className="col-span-12 lg:col-span-3 px-0 lg:px-0">
          <div className="h-full lg:sticky lg:top-6">
            <div className="bg-[#FFFCE0] rounded-none lg:rounded-l-2xl lg:rounded-r-none p-6 w-full border">
              <h3 className="text-[#313D6A] font-bold text-base md:text-lg mb-6">Academic Details</h3>

              <div className="mb-6">
                <div className="bg-[#313D6A] inline-flex text-white px-3 py-2 rounded-full text-sm md:text-base font-semibold">Academic Performance</div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm md:text-base">GPA</span>
                    <span className="font-bold text-[#313D6A]">{studentData.gpa || "3.8"}/4.0</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm md:text-base mb-1">
                      <span>Attendance</span>
                      <span className="font-semibold text-[#313D6A]">{studentData.attendance_percentage || 95}%</span>
                    </div>
                    <Progress value={studentData.attendance_percentage || 95} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-[#313D6A] inline-flex text-white px-3 py-2 rounded-full text-sm md:text-base font-semibold">Course Statistics</div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm md:text-base">
                    <span>Completed Courses</span>
                    <span className="font-semibold text-[#313D6A]">{studentData.completed_courses_count || 12}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span>Current Courses</span>
                    <span className="font-semibold text-[#313D6A]">{studentData.current_courses_count || 4}</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span>Assignments Done</span>
                    <span className="font-semibold text-[#313D6A]">{studentData.completed_assignments || 45}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-[#313D6A] inline-flex text-white px-3 py-2 rounded-full text-sm md:text-base font-semibold">Learning Preferences</div>
                <div className="p-4">
                  <div className="mb-3">
                    <span className="text-sm md:text-base font-medium text-[#313D6A]">Preferred Time:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(studentData.preferred_learning_time || ["Morning", "Evening"]).map((time, index) => (
                        <Badge key={index} variant="secondary" className="text-xs md:text-sm bg-[#F5BB07] text-[#313D6A]">{typeof time === "string" ? time : time.name}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm md:text-base font-medium text-[#313D6A]">Languages:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(studentData.language_preferences || ["English", "Urdu"]).map((lang, index) => (
                        <Badge key={index} variant="secondary" className="text-xs md:text-sm bg-[#F5BB07] text-[#313D6A]">{typeof lang === "string" ? lang : lang.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-[#313D6A] inline-flex text-white px-3 py-2 rounded-full text-sm md:text-base font-semibold">Contact Information</div>
                <div className="p-4 space-y-2 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#313D6A]" />
                    <span className="truncate">{studentData.email || "student@email.com"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#313D6A]" />
                    <span>{studentData.phone || "+92 300 1234567"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#313D6A] mt-0.5" />
                    <span className="text-xs md:text-sm">{studentData.address || `${studentData.city || "Lahore"}, ${studentData.country || "Pakistan"}`}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-[#313D6A] inline-flex text-white px-3 py-2 rounded-full text-sm md:text-base font-semibold">Interests</div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {(studentData.interests || ["Technology", "Research", "Innovation"]).map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs md:text-sm border-[#313D6A] text-[#313D6A]">{typeof interest === "string" ? interest : interest.name}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
