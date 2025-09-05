"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample instructor images
import Instructor1 from "@/assets/images/tutors/tut-a.webp"
import Instructor2 from "@/assets/images/tutors/tut-b.webp"
import Instructor3 from "@/assets/images/tutors/tut-c.webp"
import Link from "next/link"

const courses = [
    {
        id: 15,
        title: "O-Level Chemistry Course",
        instructor: { id: "PT139", name: "Dr. Sarah Johnson", image: Instructor1 },
        starts: "28-Feb-2022",
        duration: "2 Months",
        fee: "$500",
        location: "On-Campus",
        scheduleDays: "Mon, Wed, Fri",
        scheduleTime: "04:00 PM - 06:00 PM (GMT +5)",
    },
    {
        id: 16,
        title: "A-Level Physics Crash Course",
        instructor: { id: "PT140", name: "Prof. Michael Chen", image: Instructor2 },
        starts: "01-Mar-2022",
        duration: "3 Months",
        fee: "$650",
        location: "Online",
        scheduleDays: "Tue, Thu, Sat",
        scheduleTime: "05:00 PM - 07:00 PM (GMT +5)",
    },
    {
        id: 17,
        title: "O-Level Biology Revision",
        instructor: { id: "PT141", name: "Dr. Emily Williams", image: Instructor3 },
        starts: "10-Mar-2022",
        duration: "1.5 Months",
        fee: "$420",
        location: "On-Campus",
        scheduleDays: "Mon, Wed",
        scheduleTime: "03:00 PM - 05:00 PM (GMT +5)",
    },
]

export default function GroupSessions() {
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // touch handling for mobile swipe
    const [touchStartX, setTouchStartX] = useState(null)
    const [touchEndX, setTouchEndX] = useState(null)
    const MIN_SWIPE = 40

    const next = useCallback(() => {
        setCurrent((c) => (c + 1) % courses.length)
    }, [])

    const prev = useCallback(() => {
        setCurrent((c) => (c - 1 + courses.length) % courses.length)
    }, [])

    useEffect(() => {
        if (isPaused) return
        const iv = setInterval(next, 5000)
        return () => clearInterval(iv)
    }, [isPaused, next])

    // keyboard navigation for accessibility
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") next()
            if (e.key === "ArrowLeft") prev()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [next, prev])

    // swipe logic
    const handleTouchStart = (e) => {
        setTouchEndX(null)
        setTouchStartX(e.touches[0].clientX)
    }
    const handleTouchMove = (e) => {
        setTouchEndX(e.touches[0].clientX)
    }
    const handleTouchEnd = () => {
        if (touchStartX == null || touchEndX == null) return
        const diff = touchStartX - touchEndX
        if (Math.abs(diff) > MIN_SWIPE) {
            if (diff > 0) next()
            else prev()
        }
        setTouchStartX(null)
        setTouchEndX(null)
    }

    return (
        <section
            className="py-16 bg-white relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Group Sessions carousel"
        >
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
                    <span className="text-[#313D6A]">Group</span>{" "}
                    <span className="text-[#F5BB07]">Sessions</span>
                </h2>

                <div className="relative max-w-5xl mx-auto">
                    {/* Desktop arrows (kept as-is) */}
                    <button
                        onClick={prev}
                        aria-label="Previous course"
                        className="hidden md:flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 z-40 w-14 h-14 rounded-full shadow-lg bg-[#F5BB07]"
                    >
                        <ChevronLeft className="w-6 h-6 text-[#313D6A]" />
                    </button>

                    <button
                        onClick={next}
                        aria-label="Next course"
                        className="hidden md:flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 z-40 w-14 h-14 rounded-full shadow-lg bg-[#313D6A]"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Desktop view */}
                    <div className="hidden md:block">
                        <div className="flex justify-center items-center gap-8">
                            {[-1, 0, 1].map((offset) => {
                                const index = (current + offset + courses.length) % courses.length
                                const course = courses[index]
                                const isCenter = offset === 0

                                return (
                                    <div
                                        key={course.id}
                                        className={`transition-all overflow-hidden border border-[#313D6A] rounded-md shadow-lg duration-500 ease-in-out ${isCenter ? "scale-100 opacity-100 z-10" : "scale-90 opacity-50 z-0"} ${offset === -1 ? "-translate-x-6" : offset === 1 ? "translate-x-6" : ""}`}
                                        style={{ width: isCenter ? "420px" : "380px" }}
                                    >
                                        <Card className="rounded-md py-0 overflow-hidden shadow-lg border-0 relative">
                                            <div className="bg-[#313D6A] rounded-md text-white py-4 px-6 text-center text-lg font-semibold">
                                                {course.title}
                                            </div>

                                            <CardContent className="px-6 py-3">
                                                <div className="absolute top-12 left-6 flex items-end rounded-full p-1">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                                                        <Image src={course.instructor.image} alt={course.instructor.name} width={48} height={48} className="object-cover" />
                                                    </div>
                                                    <div className="ml-2 mr-3 flex gap-2 items-center">
                                                        <div className="text-xs font-semibold text-[#313D6A]">Instructor ID</div>
                                                        <div className="text-sm font-bold text-[#313D6A]">{course.instructor.id}</div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-2 border-dashed border-gray-900 my-4" />

                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-sm text-[#F5BB07] font-bold">Starts</div>
                                                        <div className="text-lg font- text-[#313D6A]">{course.starts}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-500 font-medium">Duration</div>
                                                        <div className="text-lg font-bold text-[#313D6A]">{course.duration}</div>
                                                    </div>

                                                    <div className="flex justify-center items-end gap-2">
                                                        <div className="text-sm text-gray-500">Fee:</div>
                                                        <div className="text-base font-semibold">{course.fee}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-500">Location</div>
                                                        <div className="text-base font-semibold">{course.location}</div>
                                                    </div>
                                                </div>

                                                <div className="mb-6">
                                                    <div className="text-[#313D6A] font-semibold mb-2">Course Schedule</div>
                                                    <div className="text-sm text-gray-600">Days: <span className="font-medium">{course.scheduleDays}</span></div>
                                                    <div className="text-sm text-gray-600">Time: <span className="font-medium">{course.scheduleTime}</span></div>
                                                </div>

                                                <div className="flex justify-center gap-4">
                                                    <Button className="bg-[#F5BB07] hover:bg-[#e0a906] text-black font-semibold px-6 py-2 rounded-md">View Course</Button>
                                                    <Button className="bg-[#313D6A] hover:bg-[#252e53] text-white font-semibold px-6 py-2 rounded-md">Enroll Now</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Mobile view */}
                    <div
                        className="md:hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="w-full flex justify-center">
                            <Card className="rounded-2xl py-0 overflow-hidden shadow-lg border-0 mx-auto w-[92%] max-w-xs relative">
                                {/* header/title */}
                                <div className="bg-[#313D6A] text-white py-3 px-5 text-center text-sm md:text-base font-semibold">
                                    {courses[current].title}
                                </div>

                                <CardContent className="p-5 pt-14">
                                    {/* Instructor badge positioned with safe spacing */}
                                    <div className="absolute top-8 left-5 flex items-end rounded-full  p-1 z-20">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                                            <Image
                                                src={courses[current].instructor.image}
                                                alt={courses[current].instructor.name}
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="ml-2 mr-3 flex gap-2 items-center">
                                            <div className="text-[10px] font-semibold text-[#313D6A]">Instructor ID</div>
                                            <div className="text-xs font-bold text-[#F5BB07]">{courses[current].instructor.id}</div>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed border-gray-900 my-3" />

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <div className="text-xs text-[#F5BB07] font-semibold">Starts</div>
                                            <div className="text-sm font-bold text-[#313D6A]">{courses[current].starts}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 font-medium">Duration</div>
                                            <div className="text-sm font-bold text-[#313D6A]">{courses[current].duration}</div>
                                        </div>

                                        <div>
                                            <div className="text-xs text-gray-500">Fee:</div>
                                            <div className="text-sm font-semibold">{courses[current].fee}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500">Location</div>
                                            <div className="text-sm font-semibold">{courses[current].location}</div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-[#313D6A] font-semibold mb-1 text-sm">Course Schedule</div>
                                        <div className="text-xs text-gray-600">Days: <span className="font-medium">{courses[current].scheduleDays}</span></div>
                                        <div className="text-xs text-gray-600">Time: <span className="font-medium">{courses[current].scheduleTime}</span></div>
                                    </div>

                                    <div className="flex justify-center gap-3">
                                        <Button className="bg-[#F5BB07] hover:bg-[#e0a906] text-black text-sm font-semibold px-4 py-1 rounded-md">View Course</Button>
                                        <Button className="bg-[#313D6A] hover:bg-[#252e53] text-white text-sm font-semibold px-4 py-1 rounded-md">Enroll Now</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* small nav controls + indicators */}
                        <div className="flex items-center justify-center mt-4 gap-4">
                            <button
                                onClick={prev}
                                aria-label="Previous"
                                className="p-2 rounded-full shadow-sm bg-white border border-gray-200"
                            >
                                <ChevronLeft className="w-5 h-5 text-[#313D6A]" />
                            </button>

                            {/* dots */}
                            <div className="flex items-center gap-2">
                                {courses.map((c, i) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setCurrent(i)}
                                        aria-label={`Go to ${i + 1}`}
                                        aria-current={current === i ? "true" : "false"}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${current === i ? "scale-125" : "opacity-40"}`}
                                        style={{ backgroundColor: current === i ? "#313D6A" : "#cbd5e1" }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={next}
                                aria-label="Next"
                                className="p-2 rounded-full shadow-sm bg-white border border-gray-200"
                            >
                                <ChevronRight className="w-5 h-5 text-[#313D6A]" />
                            </button>
                        </div>
                    </div>

                    {/* View All button */}
                    <div className="flex justify-center mt-8">
                        <Button className="border-2 border-[#313D6A] text-[#313D6A] bg-transparent hover:bg-[#313D6A] hover:text-white font-semibold px-8 py-3 rounded-md">
                            <Link href="/courses">
                                View All
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
