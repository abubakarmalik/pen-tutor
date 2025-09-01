"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Check, X, Clock, User, Mail, MapPin, Calendar, Shield } from "lucide-react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function PendingTeachers() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchPendingProfiles()
  }, [])

  const fetchPendingProfiles = async () => {
    try {
      const response = await api.get("/api/admin-portal/pending-profiles/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setProfiles(response.data.profiles)
    } catch (error) {
      console.error("Error fetching pending profiles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewProfile = async (profileId, action) => {
    setActionLoading((prev) => ({ ...prev, [profileId]: true }))

    try {
      const response = await axios.put(
        `${API_URL}/api/admin-portal/review-profile/?profile_type=teacher&profile_id=${profileId}`,
        { action },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }
      )

      if (response.status === 200 || response.status === 204) {
        // remove locally for instant feedback
        setProfiles((prev) => prev.filter((p) => p.profile_id !== profileId))
      }
    } catch (error) {
      console.error("Error reviewing profile:", error)
    } finally {
      setActionLoading((prev) => ({ ...prev, [profileId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#313D6A]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="p-3 rounded-full bg-[#313D6A]">
              <User className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#313D6A]">Pending Teacher Profiles</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Review and approve teacher applications</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-[#F5BB07] to-[#F5BB07]/80">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#313D6A] mb-0">{profiles.length}</div>
                    <Badge className="text-xs sm:text-sm px-3 py-1 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-white border-0">
                      Awaiting Review
                    </Badge>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600">Teacher profiles pending approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {profiles.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-[#313D6A]">Applications for Review</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile) => (
                <Card
                  key={profile.profile_id}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#313D6A] to-[#313D6A]/80 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base sm:text-lg font-semibold text-[#313D6A] truncate">
                            {profile.user.first_name} {profile.user.last_name}
                          </CardTitle>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">@{profile.user.username}</p>
                        </div>
                      </div>
                      <Badge className="text-xs sm:text-sm bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-white border-0 ml-2">{profile.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                        <Mail className="h-4 w-4 text-[#313D6A]" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-600 block">Email</span>
                          <p className="text-sm sm:text-sm text-gray-900 truncate">{profile.user.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                          <Shield className="h-4 w-4 text-[#313D6A]" />
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-gray-600 block">Role</span>
                            <p className="text-sm text-gray-900">{profile.user.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                          <Check className="h-4 w-4 text-[#313D6A]" />
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-gray-600 block">Verified</span>
                            <p className="text-sm text-gray-900">{profile.user.is_verified ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </div>

                      {(profile.user.city || profile.user.country) && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                          <MapPin className="h-4 w-4 text-[#313D6A]" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs sm:text-sm font-medium text-gray-600 block">Location</span>
                            <p className="text-sm text-gray-900 truncate">
                              {profile.user.city && profile.user.country
                                ? `${profile.user.city}, ${profile.user.country}`
                                : profile.user.city || profile.user.country}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                        <Calendar className="h-4 w-4 text-[#313D6A]" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-600 block">Applied</span>
                          <p className="text-sm text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto flex-1 border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white transition-colors bg-transparent"
                        onClick={() => router.push(`/our-tutors/tutor/${profile.profile_id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="text-xs sm:text-sm">View Profile</span>
                      </Button>

                      <Button
                        size="sm"
                        className="w-full sm:w-auto bg-[#313D6A] hover:bg-[#313D6A]/90 text-white"
                        onClick={() => handleReviewProfile(profile.user.id, "approve")}
                        disabled={actionLoading[profile.user.id]}
                      >
                        {actionLoading[profile.user.id] ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        <span className="text-xs sm:text-sm">Approve</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                        onClick={() => handleReviewProfile(profile.user.id, "reject")}
                        disabled={actionLoading[profile.user.id]}
                      >
                        <X className="h-4 w-4 mr-2" />
                        <span className="text-xs sm:text-sm">Reject</span>
                      </Button>
                    </div>

                    {actionLoading[profile.user.id] && (
                      <div className="flex items-center justify-center py-3 bg-slate-50 rounded-lg">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#313D6A]"></div>
                        <span className="ml-2 text-xs sm:text-sm text-gray-600">Processing...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-full bg-gradient-to-r from-[#313D6A] to-[#313D6A]/80">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#313D6A]">All Caught Up!</h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-md">
                  No pending teacher profiles to review at the moment. New applications will appear here when submitted.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
