"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import HeroBg from "@/assets/images/job-board/home-hero.png"

export default function JobBoard() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [activeTab, setActiveTab] = useState("All")
    const [searchSubject, setSearchSubject] = useState("")
    const [searchMode, setSearchMode] = useState("")
    const [searchType, setSearchType] = useState("")


    const tabs = ["All", "Home Tuition", "Online Tuition", "Other Jobs"]

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    useEffect(() => {
        fetchJobs()
    }, [currentPage, activeTab])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${API_URL}/api/job-board/jobs/`, {
                params: {
                    page: currentPage,
                    tab: activeTab !== "All" ? activeTab : undefined,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })

            console.log("Jobs Response:", response)

            setJobs(response.data.results)
            setTotalPages(Math.ceil(response.data.count / 10)) // Assuming 10 items per page
        } catch (error) {
            console.error("Error fetching jobs:", error)
            // Mock data for development
            // setJobs([
            //     {
            //         id: 1,
            //         title: "Tutor For Standard 9 Student - 3 Days / Week",
            //         description: "Chemistry and Physics tutor needed",
            //         student: { id: 1, username: "student1", full_name: "John Doe", profile_picture: "" },
            //         course: { id: 1, title: "Standard 9", course_type: "free" },
            //         subject_display: "Chemistry, Physics",
            //         teaching_mode: "in_person",
            //         budget_amount: "8K-9K",
            //         budget_type: "per_month",
            //         duration_value: 3,
            //         duration_unit: "days",
            //         location: "Local Area",
            //         status: "open",
            //         applications_count: 5,
            //         created_at: "2025-08-21T07:08:53.036Z",
            //         time_ago: "4 Days Ago",
            //         deadline: "2025-09-01T07:08:53.036Z",
            //     },
            // ])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        // Implement search functionality
        fetchJobs()
    }

    const getJobTypeBadge = (job) => {
        if (job.teaching_mode === "in_person") return "Home Tuition"
        if (job.teaching_mode === "remote") return "Online Tuition"
        return "Regular Job"
    }

    const getBadgeColor = (type) => {
        switch (type) {
            case "Home Tuition":
                return "bg-[#F5BB07] text-black hover:bg-[#F5BB07]/80"
            case "Online Tuition":
                return "bg-[#313D6A] text-white hover:bg-[#313D6A]/80"
            case "Regular Job":
                return "bg-green-600 text-white hover:bg-green-600/80"
            default:
                return "bg-gray-500 text-white"
        }
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#FFFCE0" }}>
            {/* Header Section */}
            <div className="relative overflow-hidden" style={{ backgroundColor: "#FFFCE0" }}>
                {/* Decorative circles */}
                <div
                    className="absolute top-7 -left-10 w-32 h-32 rounded-full border-[16px] border-[#F5BB07]/60"
                ></div>
                <div
                    className="absolute top-20 right-0 w-40 h-40 rounded-full border-[16px] border-[#F5BB07]/60"
                ></div>

                <div className="mx-auto py-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-12" style={{ color: "#313D6A" }}>
                        Job Board
                    </h1>

                    <div
                        className="relative grid md:grid-cols-2 gap-8 py-8 w-full"
                        style={{
                            backgroundImage: `url(${HeroBg.src})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* Background overlay */}
                        <div className="absolute z-0 top-0 left-0 w-full h-full bg-primary/85"></div>

                        {/* Left Section */}
                        <div className="space-y-6 z-10 flex flex-col justify-center">
                            <div className="text-center">
                                <div className="inline-block px-6 py-3 text-[#313D6A] bg-white font-semibold rounded-t-md">
                                    For Student & Parents
                                </div>
                                <div
                                    className="flex w-full max-w-sm mx-auto text-lg justify-center bg-[#F5BB07] text-[#313D6A] font-semibold py-3 rounded-none rounded-b-xl"
                                >
                                    Post Online/Home Tuition Job
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="inline-block px-6 py-3 rounded-none rounded-t-md text-[#313D6A] bg-white font-semibold">
                                    For Institutes/Organizations
                                </div>
                                <div
                                    className="flex w-full max-w-sm mx-auto text-lg justify-center bg-[#F5BB07] text-[#313D6A] font-semibold py-3 rounded-none rounded-b-xl "
                                >
                                    Post Teaching/Other Jobs
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Quick Search */}
                        <div className="p-8 z-10 rounded-lg">
                            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                                QUICK SEARCH!
                                <div
                                    className="w-16 h-1 mx-auto mt-2"
                                ></div>
                            </h2>

                            <div className="space-y-4 flex flex-col items-center">
                                <Input
                                    placeholder="Enter Any Subject"
                                    value={searchSubject}
                                    onChange={(e) => setSearchSubject(e.target.value)}
                                    className="bg-white rounded-sm lg:w-1/2 h-12"
                                />
                                <Input
                                    placeholder="Enter Study Mode"
                                    value={searchMode}
                                    onChange={(e) => setSearchMode(e.target.value)}
                                    className="bg-white rounded-sm lg:w-1/2 h-12"
                                />
                                <Input
                                    placeholder="Tuition or Other Jobs"
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="bg-white rounded-sm lg:w-1/2 h-12"
                                />
                                <Button
                                    onClick={handleSearch}
                                    className="py-3 font-semibold rounded-sm lg:w-1/4 h-12 bg-[#F5BB07] hover:bg-[#F5BB07]/80"
                                >
                                    Search Job
                                </Button>
                            </div>
                        </div>

                        {/* Separator Line (only on md and up) */}
                        <span>
                            <span className="hidden md:block absolute h-1/2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px bg-white z-20">
                                <span className="absolute top-0 -right-1 w-2 h-2 bg-white z-20 rotate-45"></span>
                                <span className="absolute bottom-0 -right-1 w-2 h-2 bg-white z-20 rotate-45"></span>
                            </span>
                        </span>
                    </div>

                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b-2" style={{ borderColor: "#F5BB07" }}>
                <div className="container mx-auto px-4">
                    <div className="flex space-x-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-2 font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab
                                    ? "border-[#F5BB07] text-[#313D6A]"
                                    : "border-transparent text-gray-600 hover:text-[#313D6A]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Job Listings */}
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-xl" style={{ color: "#313D6A" }}>
                            Loading jobs...
                        </div>
                    </div>
                ) : jobs.length > 0 ? (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 mb-8">
                            {jobs.map((job) => (
                                <Card key={job.id} className="bg-white max-w-96 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardContent className="py-6">
                                        <div className="flex flex-col justify-between items-start space-y-2 mb-4">
                                            <h3 className="text-lg block font-semibold text-gray-800 flex-1 mr-4">{job?.title}</h3>
                                            <Button className={`${getBadgeColor(getJobTypeBadge(job))} shrink-0 mx-auto rounded-sm`}>
                                                {getJobTypeBadge(job)}
                                            </Button>
                                        </div>

                                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                                            <span>Tuition ID: {job.id}</span>
                                            <span>Posted {job.time_ago}</span>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="grid grid-cols-2">
                                                <span className="font-semibold text-primary">Class</span>
                                                <span className="text-primary">{job?.course?.title.replace("Standard ", "") + "th"}</span>
                                            </div>

                                            <div className="grid grid-cols-2">
                                                <span className="font-semibold text-primary">Subject(s)</span>
                                                <span className="text-primary">{job?.subject_display}</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="font-semibold text-primary">Days To Study</span>
                                                <span className="text-primary">Friday, Saturday, & Sunday</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="font-semibold text-primary">Time to Study</span>
                                                <span className="text-primary">3:00 PM To 6:00 PM</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="font-semibold text-primary">Tutor (Gender)</span>
                                                <span className="text-primary">Female</span>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <span className="font-semibold text-primary">Budget</span>
                                                <span className="text-primary">{job?.budget_amount}</span>
                                            </div>
                                        </div>

                                        <Button
                                            className="inline-flex mx-auto  mt-6 font-semibold py-2 rounded-md"
                                            style={{
                                                backgroundColor: getJobTypeBadge(job) === "Home Tuition" ? "#F5BB07" : "#313D6A",
                                                color: getJobTypeBadge(job) === "Home Tuition" ? "#000" : "#fff",
                                            }}
                                        >
                                            Apply Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white"
                                >
                                    Previous
                                </Button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        onClick={() => setCurrentPage(page)}
                                        className={
                                            currentPage === page
                                                ? "bg-[#313D6A] text-white hover:bg-[#313D6A]/80"
                                                : "border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white"
                                        }
                                    >
                                        {page}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-xl" style={{ color: "#313D6A" }}>
                            No Jobs Posted yet.
                        </div>
                    </div>
                )
                }
            </div>
        </div>
    )
}
