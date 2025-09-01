"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

import ChildPlay from "@/assets/images/home/childs-play.png"
import Meeting from "@/assets/images/pages/our-services/services-meeting.png"
import Image from "next/image"
import axios from "axios"
import Link from "next/link"

export default function ServicesPage() {
    const [groupSessionsIndex, setGroupSessionsIndex] = useState(0)
    const [resourcesIndex, setResourcesIndex] = useState(0)
    const [courses, setCourses] = useState([])

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/courses`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                })
                setCourses(response.data.results)
            } catch (error) {
                console.error('Error fetching courses:', error)
            }
        }
        fetchCourses()
    }, [])


    const groupSessions = [
        {
            title: "O-Level Chemistry Crash Course with Past Papers",
            courseId: "15",
            instructor: "PT139",
            startDate: "28-Feb-2022",
            duration: "2 Months",
            fee: "$500",
            location: "On-Campus",
            schedule: "Days: Mon, Wed, Fri",
            time: "04:00 PM - 06:00 PM (GMT +5)",
            image: "/placeholder.svg?height=60&width=60",
        },
        {
            title: "A-Level Physics Intensive Course",
            courseId: "16",
            instructor: "PT140",
            startDate: "15-Mar-2022",
            duration: "3 Months",
            fee: "$600",
            location: "Online",
            schedule: "Days: Tue, Thu, Sat",
            time: "05:00 PM - 07:00 PM (GMT +5)",
            image: "/placeholder.svg?height=60&width=60",
        },
    ]

    const onlineCourses = new Array(6).fill(0).map(() => ({
        title: "Adobe Photoshop: Beginner To Advance",
        duration: "1 hr 45 mins",
        lectures: "46 Lectures",
        price: "20K PKR",
        image: "/placeholder.svg?height=120&width=160",
    }))

    const resources = [
        { title: "English Past Paper 2021", image: "/placeholder.svg?height=200&width=280", bgColor: "bg-yellow-600" },
        { title: "Maths O-Level MCQ's Notes", image: "/placeholder.svg?height=200&width=280", bgColor: "bg-teal-600" },
        { title: "Chemistry Past Paper Notes", image: "/placeholder.svg?height=200&width=280", bgColor: "bg-indigo-600" },
    ]

    const nextGroupSession = () => setGroupSessionsIndex((p) => (p + 1) % groupSessions.length)
    const prevGroupSession = () => setGroupSessionsIndex((p) => (p - 1 + groupSessions.length) % groupSessions.length)
    const nextResource = () => setResourcesIndex((p) => (p + 1) % resources.length)
    const prevResource = () => setResourcesIndex((p) => (p - 1 + resources.length) % resources.length)

    /*
      Reusable section heading: creates a centered "pill" that sits overlapping the top border.
      Props:
        - title: string
        - pillBg: Tailwind bg class for the pill (eg. 'bg-[#313D6A]' or 'bg-yellow-500')
        - borderColor: hex or tailwind color for the top border
    */
    const SectionHeading = ({ title, pillBg = 'bg-[#313D6A]', borderColor = '#313D6A' }) => (
        <div className="relative w-full">
            {/* top border line */}
            <div className="w-full" style={{ borderTop: `2px solid ${borderColor}` }} />

            {/* pill centered and overlapping the border */}
            <h2
                className={`${pillBg} text-white font-bold rounded-none rounded-t-lg inline-block px-6 py-2 absolute left-1/2 bottom-0 -translate-x-1/2 z-10 text-lg sm:text-2xl drop-shadow-sm`}
            >
                {title}
            </h2>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            {/* Home Tutoring Section */}
            <section className="pt-12 pb-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading title="Home Tutoring" pillBg="bg-[#313D6A]" borderColor="#313D6A" />

                    <div className="mt-8 grid gap-10 lg:grid-cols-2 items-center">
                        <div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-[#313D6A] mb-4">Home Tutoring</h3>
                            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
                                If you are looking for qualified home tutors, your search ends here. Pen Tutor is providing tutors for all
                                the classes and all subjects your child needs help in. Our experienced tutors are available to give your child
                                100% personalized attention and the freedom to ask questions resulting in improved performance.
                            </p>
                            <Link href="/home-tutoring" className="text-white font-semibold px-6 py-2 rounded-md hover:opacity-95 bg-[#313D6A]" >
                                Read More
                            </Link>
                        </div>

                        <div className="flex justify-center py-4">
                            <div className="relative rounded-full overflow-hidden w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80">
                                <Image src={ChildPlay} alt="Home tutoring session" fill className="object-cover" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Online Tutoring Section */}
            <section className="pt-12 pb-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading title="Online Tutoring" pillBg="bg-[#F5BB07]" borderColor="#F5BB07" />

                    <div className="mt-8 grid gap-10 lg:grid-cols-2 justify-center">
                        <div className="order-2 flex flex-col justify-center">
                            <h3 className="text-2xl sm:text-3xl text-center font-bold text-[#F5BB07] mb-4">Online Tutoring</h3>
                            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6 text-center">
                                If you are looking for qualified Online tutors, your search ends here. Pen Tutor is providing tutors for all
                                the classes and all subjects your child needs help in. Our experienced tutors are available to give your child
                                100% personalized attention and the freedom to ask questions resulting in improved performance.
                            </p>
                            <Link href="/online-tutoring" className="text-white w-fit mx-auto font-semibold px-6 py-2 rounded-md hover:opacity-95 bg-[#F5BB07]">
                                Read More
                            </Link>
                        </div>

                        <div className="order-1  flex justify-start">
                            <div className="w-full max-w-md rounded-lg overflow-hidden shadow-lg">
                                <Image src={Meeting} alt="Online tutoring session" className="w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Session Types */}
            <section className="pt-12 pb-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading title="Session Types" pillBg="bg-[#313D6A]" borderColor="#313D6A" />

                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                        <div className="flex flex-col md:flex-row items-center gap-4 bg-yellow-50 rounded-lg p-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                                <Image src={Meeting} alt="Individual session" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#313D6A]">Individual Sessions</h3>
                                <p className="text-sm text-gray-600">Personalized 1:1 attention</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 bg-blue-50 rounded-lg p-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                                <Image src={Meeting} alt="Group session" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#313D6A]">Small Group Sessions</h3>
                                <p className="text-sm text-gray-600">Collaborative small groups</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 bg-green-50 rounded-lg p-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                                <Image src={Meeting} alt="Academy session" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#313D6A]">Academy Sessions</h3>
                                <p className="text-sm text-gray-600">Structured classroom-style courses</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Group Sessions Carousel */}
            <section className="pt-12 pb-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading title="Group Sessions" pillBg="bg-[#313D6A]" borderColor="#313D6A" />

                    <div className="mt-8 relative">
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <Button onClick={prevGroupSession} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5BB07' }}>
                                <ChevronLeft className="w-4 h-4 text-white" />
                            </Button>

                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full sm:w-[480px]">
                                <div className="text-center mb-4">
                                    <h3 className="text-lg sm:text-xl font-bold mb-1 text-[#313D6A]">{groupSessions[groupSessionsIndex].title}</h3>
                                    <p className="text-sm text-[#F5BB07]">Course ID: {groupSessions[groupSessionsIndex].courseId}</p>
                                </div>

                                <div className="flex items-center justify-center mb-4">
                                    <img src={groupSessions[groupSessionsIndex].image || '/placeholder.svg'} alt="Instructor" className="w-12 h-12 rounded-full" />
                                    <span className="ml-2 text-sm text-gray-600">Instructor ID: {groupSessions[groupSessionsIndex].instructor}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div>
                                        <p className="text-sm text-[#F5BB07]">Starts</p>
                                        <p className="font-semibold">{groupSessions[groupSessionsIndex].startDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm">Duration</p>
                                        <p className="font-semibold text-[#313D6A]">{groupSessions[groupSessionsIndex].duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm">Fee: <span className="font-semibold">{groupSessions[groupSessionsIndex].fee}</span></p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#F5BB07]">Location</p>
                                        <p className="font-semibold">{groupSessions[groupSessionsIndex].location}</p>
                                    </div>
                                </div>

                                <div className="mb-4 text-sm">
                                    <p className="font-semibold text-[#313D6A]">Course Schedule</p>
                                    <p className="text-sm">{groupSessions[groupSessionsIndex].schedule}</p>
                                    <p className="text-sm">Time: {groupSessions[groupSessionsIndex].time}</p>
                                </div>

                                <div className="flex gap-3">
                                    <Button className="flex-1 text-white font-semibold py-2 rounded-md" style={{ backgroundColor: '#F5BB07' }}>
                                        View Course
                                    </Button>
                                    <Button className="flex-1 text-white font-semibold py-2 rounded-md" style={{ backgroundColor: '#313D6A' }}>
                                        Enroll Now
                                    </Button>
                                </div>
                            </div>

                            <Button onClick={nextGroupSession} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#313D6A' }}>
                                <ChevronRight className="w-4 h-4 text-white" />
                            </Button>
                        </div>

                        {/* <div className="text-center mt-8">
                            <Button variant="outline" className="px-6 py-2 border-2 font-semibold rounded-md bg-transparent" style={{ borderColor: '#313D6A', color: '#313D6A' }}>
                                View All
                            </Button>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Online Courses */}
            <section className="pt-12 pb-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading title="Online Courses" pillBg="bg-[#F5BB07]" borderColor="#F5BB07" />

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={course.thumbnail || '/placeholder.svg'} alt={course.title} className="w-full h-40 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-semibold text-sm mb-2">{course.title}</h3>
                                    <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
                                        <span>{course.total_enrollments} Students</span>
                                        <span>{course.total_videos} Lectures</span>
                                    </div>
                                    <p className="text-red-500 font-bold text-sm">{course.price} PKR</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/courses" className="px-6  py-2 border-2 font-semibold rounded-md bg-transparent" style={{ borderColor: '#F5BB07', color: '#F5BB07' }}>
                            View All
                        </Link>
                    </div>
                </div>
            </section>

            {/* Online Resources */}
            {/* <section className="pt-12 pb-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading title="Online Resources" pillBg="bg-[#313D6A]" borderColor="#313D6A" />

                    <div className="mt-8">
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <Button onClick={prevResource} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5BB07' }}>
                                <ChevronLeft className="w-4 h-4 text-white" />
                            </Button>

                            <div className="flex gap-4 overflow-hidden">
                                {resources.map((resource, index) => (
                                    <div key={index} className={`${resource.bgColor} rounded-lg p-6 text-white text-center min-w-[220px] transform transition-transform ${index === resourcesIndex ? 'scale-105' : 'scale-95 opacity-70'}`}>
                                        <h3 className="text-lg font-bold">{resource.title}</h3>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={nextResource} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#313D6A' }}>
                                <ChevronRight className="w-4 h-4 text-white" />
                            </Button>
                        </div>

                        <div className="text-center mt-8">
                            <Button variant="outline" className="px-6 py-2 border-2 font-semibold rounded-md bg-transparent" style={{ borderColor: '#F5BB07', color: '#F5BB07' }}>
                                View All
                            </Button>
                        </div>
                    </div>
                </div>
            </section> */}
        </div>
    )
}
