"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Clock, Users, BookOpen, MapPin, CheckCircle, DollarSign, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import axios from "axios"

export default function JobDetailPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.jobId

    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [hasApplied, setHasApplied] = useState(false)

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    const fetchJobDetail = async () => {
        try {
            setLoading(true)

            const response = await axios.get(`${API_BASE}/api/job-board/jobs/${jobId}/`)
            console.log("Job Detail:", response)

            if (response.status === 200) {
                setJob(response.data)
                setHasApplied(response.data.user_application !== null)
            } else {
                throw new Error("Job not found")
            }
        } catch (error) {
            console.error("Error fetching job detail:", error)
            toast.error("Failed to load job details")
            setJob(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (jobId) {
            fetchJobDetail()
        }
    }, [jobId])

    const handleApply = async () => {
        try {
            if (!localStorage.getItem("access_token")) {
                toast.error("Please login to apply for this job")
                return
            }

            const response = await axios.post(
                `${API_BASE}/api/job-board/jobs/${jobId}/apply/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                },
            )

            console.log("Application Response:", response)

            if (response.status === 201) {
                setHasApplied(true)
                toast.success("Successfully applied for the job!")
            } else {
                throw new Error("Application failed")
            }
        } catch (error) {
            console.error("Error applying for job:", error)
            toast.error("Failed to apply for job")
        }
    }

    // Helper functions
    const getStatusColor = (status) => {
        switch (status) {
            case "open":
                return "bg-green-100 text-green-800"
            case "in_progress":
                return "bg-blue-100 text-blue-800"
            case "completed":
                return "bg-gray-100 text-gray-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getTeachingModeIcon = (mode) => {
        return mode === "online" ? "💻" : "🏫"
    }

    const formatBudget = (amount, type) => {
        const formattedAmount = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)

        switch (type) {
            case "hourly":
                return `${formattedAmount}/hour`
            case "fixed":
                return `${formattedAmount} (Fixed)`
            case "negotiable":
                return `${formattedAmount} (Negotiable)`
            default:
                return formattedAmount
        }
    }

    const formatDuration = (value, unit) => {
        return `${value} ${unit}${value > 1 ? "s" : ""}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="p-6">
                    <div className="animate-pulse max-w-7xl mx-auto">
                        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
                        <div className="h-64 bg-gray-200 rounded mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                                <div className="h-48 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-96 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="p-6">
                    <div className="text-center py-12 max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h2>
                        <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
                        <Button onClick={() => router.push("/jobs")}>Back to Jobs</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Job Hero Section */}
            <div className="text-white relative overflow-hidden py-10 bg-gradient-to-r from-[#313D6A] to-[#4A5A8A]">
                <div className="absolute inset-0 bg-[#313D6A]/80 z-0" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge className={`${getStatusColor(job.status)} border-0`}>
                                    {job.status?.replace("_", " ").toUpperCase()}
                                </Badge>
                                <span className="text-2xl">{getTeachingModeIcon(job.teaching_mode)}</span>
                                <span className="text-sm text-gray-200">{job.teaching_mode?.replace("_", " ")}</span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">{job.title}</h1>

                            <p className="text-lg text-gray-200 mb-6">{job.description}</p>

                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-[#F5BB07]" />
                                    <span className="font-semibold text-[#F5BB07]">
                                        {formatBudget(job.budget_amount, job.budget_type)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-gray-300" />
                                    <span className="text-gray-300">{formatDuration(job.duration_value, job.duration_unit)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4 text-gray-300" />
                                    <span className="text-gray-300">{job.applications_count} Applications</span>
                                </div>
                            </div>

                            {job.location && (
                                <div className="flex items-center gap-2 mb-6">
                                    <MapPin className="h-4 w-4 text-gray-300" />
                                    <span className="text-gray-300">{job.location}</span>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold px-6 py-2 text-sm"
                                    onClick={handleApply}
                                    disabled={hasApplied || !job.can_apply}
                                >
                                    {hasApplied ? "Applied" : job.can_apply ? "Apply Now" : "Cannot Apply"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white text-white hover:bg-white hover:text-[#313D6A] px-6 py-2 text-sm bg-transparent"
                                >
                                    Save Job
                                </Button>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative">
                            <div className="relative bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                                <div className="flex items-center justify-center h-48 sm:h-64 bg-white/20 rounded-lg">
                                    <div className="text-center">
                                        <GraduationCap className="h-16 w-16 text-white mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">{job.course?.title}</h3>
                                        <p className="text-sm text-gray-200">{job.subject_display}</p>
                                    </div>
                                </div>
                                {job.deadline && (
                                    <div className="mt-4 text-center">
                                        <div className="text-sm text-gray-200">Application Deadline</div>
                                        <div className="text-lg font-semibold">{new Date(job.deadline).toLocaleDateString()}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Job Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Job Requirements */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#313D6A] text-xl">Job Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-5 w-5 text-[#313D6A]" />
                                        <span>Subject: {job.subject_display}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-[#313D6A]" />
                                        <span>Duration: {formatDuration(job.duration_value, job.duration_unit)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="h-5 w-5 text-[#313D6A]" />
                                        <span>Budget: {formatBudget(job.budget_amount, job.budget_type)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-[#313D6A]" />
                                        <span>Mode: {job.teaching_mode?.replace("_", " ")}</span>
                                    </div>
                                    {job.location && (
                                        <div className="flex items-center gap-3 sm:col-span-2">
                                            <MapPin className="h-5 w-5 text-[#313D6A]" />
                                            <span>Location: {job.location}</span>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    className="w-full mt-6 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold"
                                    onClick={handleApply}
                                    disabled={hasApplied || !job.can_apply}
                                >
                                    {hasApplied ? "Applied" : job.can_apply ? "Apply Now" : "Cannot Apply"}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Job Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#313D6A] text-xl">Job Description</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600 leading-relaxed">{job.description}</p>

                                {job.additional_notes && (
                                    <div>
                                        <h4 className="font-semibold text-[#313D6A] mb-2">Additional Notes</h4>
                                        <p className="text-gray-600 leading-relaxed">{job.additional_notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Student Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#313D6A] text-xl">Posted By</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage
                                            src={job.student?.profile_picture || "/placeholder.svg"}
                                            alt={job.student?.full_name}
                                        />
                                        <AvatarFallback className="bg-[#313D6A] text-white text-lg">
                                            {job.student?.full_name?.charAt(0) || job.student?.username?.charAt(0) || "S"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-lg">{job.student?.full_name || job.student?.username}</h3>
                                        <p className="text-gray-600">@{job.student?.username}</p>
                                        <p className="text-sm text-gray-500">Posted on {new Date(job.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Selected Teacher (if any) */}
                        {job.selected_teacher && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-[#313D6A] text-xl">Selected Teacher</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage
                                                src={job.selected_teacher?.profile_picture || "/placeholder.svg"}
                                                alt={job.selected_teacher?.full_name}
                                            />
                                            <AvatarFallback className="bg-green-600 text-white text-lg">
                                                {job.selected_teacher?.full_name?.charAt(0) || job.selected_teacher?.username?.charAt(0) || "T"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {job.selected_teacher?.full_name || job.selected_teacher?.username}
                                            </h3>
                                            <p className="text-gray-600">@{job.selected_teacher?.username}</p>
                                            <Badge className="bg-green-100 text-green-800 mt-1">Selected</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Job Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Job Overview Card */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center mb-6">
                                        <div className="text-3xl font-bold text-[#313D6A] mb-2">
                                            {formatBudget(job.budget_amount, job.budget_type)}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {job.budget_type === "hourly"
                                                ? "Per Hour"
                                                : job.budget_type === "fixed"
                                                    ? "Fixed Price"
                                                    : "Negotiable"}
                                        </p>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Duration</span>
                                            <span className="font-medium">{formatDuration(job.duration_value, job.duration_unit)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Applications</span>
                                            <span className="font-medium">{job.applications_count}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Teaching Mode</span>
                                            <span className="font-medium">{job.teaching_mode?.replace("_", " ")}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Status</span>
                                            <Badge className={`${getStatusColor(job.status)} text-xs`}>{job.status?.replace("_", " ")}</Badge>
                                        </div>
                                        {job.deadline && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Deadline</span>
                                                <span className="font-medium">{new Date(job.deadline).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        className="w-full mb-3 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-black font-semibold"
                                        onClick={handleApply}
                                        disabled={hasApplied || !job.can_apply}
                                    >
                                        {hasApplied ? "Applied" : job.can_apply ? "Apply Now" : "Cannot Apply"}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white bg-transparent"
                                    >
                                        Save Job
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Course Information */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-[#313D6A] mb-4">Course Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium">{job.course?.title}</h4>
                                            <p className="text-sm text-gray-600">{job.subject_display}</p>
                                        </div>
                                        <div className="text-sm">
                                            <span className="text-gray-600">Course Type: </span>
                                            <span className="font-medium">{job.course?.course_type}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-[#313D6A] mb-4">Quick Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Posted</span>
                                            <span className="font-medium">{new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Last Updated</span>
                                            <span className="font-medium">{new Date(job.updated_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Job ID</span>
                                            <span className="font-medium">#{job.id}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
