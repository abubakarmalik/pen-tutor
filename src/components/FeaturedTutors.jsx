"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import TutA from "@/assets/images/tutors/tut-a.webp"
import TutB from "@/assets/images/tutors/tut-b.webp"
import TutC from "@/assets/images/tutors/tut-c.webp"
import TutD from "@/assets/images/tutors/tut-d.webp"
import TutE from "@/assets/images/tutors/tut-e.webp"

const tutors = [
  {
    id: 1,
    name: "Dr. Alice",
    teacherId: "TUT001",
    subject: "Mathematics",
    degree: "PhD",
    specialization: "Algebra",
    experience: "8 years",
    rating: 4.8,
    students: 120,
    image: TutA,
  },
  {
    id: 2,
    name: "Dr. Brian",
    teacherId: "TUT002",
    subject: "Physics",
    degree: "PhD",
    specialization: "Quantum Mechanics",
    experience: "12 years",
    rating: 4.9,
    students: 200,
    image: TutB,
  },
  {
    id: 3,
    name: "Prof. Clara",
    teacherId: "TUT003",
    subject: "English Literature",
    degree: "MA",
    specialization: "Poetry",
    experience: "6 years",
    rating: 4.7,
    students: 95,
    image: TutC,
  },
  {
    id: 4,
    name: "Dr. Daniel",
    teacherId: "TUT004",
    subject: "Chemistry",
    degree: "PhD",
    specialization: "Organic Chemistry",
    experience: "10 years",
    rating: 4.8,
    students: 160,
    image: TutD,
  },
  {
    id: 5,
    name: "Dr. Emma",
    teacherId: "TUT005",
    subject: "Biology",
    degree: "PhD",
    specialization: "Genetics",
    experience: "9 years",
    rating: 4.9,
    students: 180,
    image: TutE,
  },
]

export default function FeaturedTutors() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progressKey, setProgressKey] = useState(0)

  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % tutors.length)
    setProgressKey((k) => k + 1)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning])

  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + tutors.length) % tutors.length)
    setProgressKey((k) => k + 1)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning])

  const goToSlide = (index) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setProgressKey((k) => k + 1)
    setTimeout(() => setIsTransitioning(false), 600)
  }

  useEffect(() => {
    if (isPaused || isTransitioning) return
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [isPaused, isTransitioning, nextSlide])

  const getVisibleTutors = () => {
    return [-1, 0, 1].map((pos) => {
      const index = (currentIndex + pos + tutors.length) % tutors.length
      return { ...tutors[index], position: pos }
    })
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(49,61,106,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,187,7,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 relative">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#313D6A] to-slate-800 bg-clip-text text-transparent mb-4">
              Featured Tutors
            </h2>
            <div className="h-1 w-24 bg-[#F5BB07] mx-auto rounded-full" />
          </div>
          <p className="text-gray-600 text-lg mt-6 max-w-2xl mx-auto">
            Meet our exceptional educators who are passionate about helping students achieve their academic goals
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            {/* Prev Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={isTransitioning}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#F5BB07] text-[#F5BB07] hover:bg-[#F5BB07] hover:text-white bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Tutor Cards */}
            {getVisibleTutors().map((tutor) => {
              const isCenter = tutor.position === 0
              return (
                <div
                  key={tutor.id}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    transform: `translateX(${tutor.position * 320}px) scale(${isCenter ? 1 : 0.85})`,
                    zIndex: isCenter ? 20 : 10,
                    opacity: isCenter ? 1 : 0.7,
                  }}
                >
                  <Card
                    className={`w-80 h-[480px] transition-all duration-700 ${isCenter
                        ? "shadow-2xl border-2 border-[#F5BB07] bg-gradient-to-br from-white to-[#F5BB07]/10"
                        : "shadow-lg bg-white/80 backdrop-blur-sm"
                      }`}
                  >
                    <CardContent className="p-8 text-center space-y-6">
                      {/* Tutor Image */}
                      <div className="relative mx-auto -mt-12">
                        <div className={`relative ${isCenter ? "w-32 h-32" : "w-28 h-28"} mx-auto`}>
                          <div
                            className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#F5BB07] to-[#F5BB07] ${isCenter ? "p-1" : "p-0.5"
                              }`}
                          >
                            <Image
                              src={tutor.image || "/placeholder.svg"}
                              alt={`${tutor.subject} Tutor`}
                              width={isCenter ? 120 : 105}
                              height={isCenter ? 120 : 105}
                              className="rounded-full w-full h-full object-cover bg-white transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                          {isCenter && (
                            <div className="absolute -top-2 -right-2 bg-[#F5BB07] text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              ID: {tutor.teacherId}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tutor Info */}
                      <div className="space-y-3 pt-4">
                        <h3 className={`font-bold text-[#313D6A] ${isCenter ? "text-xl" : "text-lg"}`}>
                          {isCenter ? tutor.name : tutor.teacherId}
                        </h3>

                        {isCenter ? (
                          <>
                            <div className="space-y-2">
                              <p className="font-semibold text-[#F5BB07] text-lg">
                                {tutor.degree} in {tutor.subject}
                              </p>
                              <p className="text-sm text-[#313D6A] font-medium">
                                Specialization: {tutor.specialization}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Experience:</span> {tutor.experience}
                              </p>
                            </div>

                            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <span className="text-[#F5BB07]">★</span>
                                <span>{tutor.rating}</span>
                              </div>
                              <div>
                                <span className="font-medium">{tutor.students}+</span> students
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <p className="font-semibold text-[#F5BB07]">{tutor.subject}</p>
                            <p className="text-xs text-gray-600">{tutor.experience}</p>
                          </div>
                        )}
                      </div>

                      {/* Button */}
                      <Button
                        className={`transition-all duration-300 ${isCenter
                            ? "w-full bg-gradient-to-r from-[#313D6A] to-[#313D6A] text-white shadow-lg hover:scale-105"
                            : "w-full bg-[#313D6A] text-white"
                          }`}
                        size={isCenter ? "default" : "sm"}
                      >
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )
            })}

            {/* Next Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={isTransitioning}
              aria-label="Next slide"
              className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#F5BB07] text-[#F5BB07] hover:bg-[#F5BB07] hover:text-white bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-12 space-x-3">
            {tutors.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${currentIndex === index
                    ? "w-8 h-3 bg-[#F5BB07] shadow-lg"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-125"
                  }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          {/* {!isPaused && !isTransitioning && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  key={progressKey}
                  className="bg-[#F5BB07] h-full rounded-full shadow-sm"
                  style={{
                    animation: "progress 5s linear forwards",
                  }}
                />
              </div>
            </div>
          )} */}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
