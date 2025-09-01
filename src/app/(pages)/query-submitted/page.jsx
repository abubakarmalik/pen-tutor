"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, User, BookOpen, Users, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") // 'job-created' or 'application-submitted'

  const isJobCreated = type === "job-created"
  const isApplicationSubmitted = type === "application-submitted"

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#FFFCE0" }}>
      {/* Decorative background circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-30"
          style={{ backgroundColor: "#F5BB07" }}
        />
        <div
          className="absolute top-20 right-20 w-24 h-24 rounded-full opacity-20"
          style={{ backgroundColor: "#F5BB07" }}
        />
        <div
          className="absolute bottom-32 left-16 w-40 h-40 rounded-full opacity-25"
          style={{ backgroundColor: "#F5BB07" }}
        />
        <div
          className="absolute bottom-20 right-32 w-28 h-28 rounded-full opacity-30"
          style={{ backgroundColor: "#F5BB07" }}
        />
        <div
          className="absolute top-1/2 left-0 w-36 h-36 rounded-full opacity-20 -translate-x-1/2"
          style={{ backgroundColor: "#F5BB07" }}
        />
        <div
          className="absolute top-1/3 right-0 w-32 h-32 rounded-full opacity-25 translate-x-1/2"
          style={{ backgroundColor: "#F5BB07" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-balance">
            {isJobCreated && "Job Created Successfully!"}
            {isApplicationSubmitted && "Application Submitted Successfully!"}
            {!isJobCreated && !isApplicationSubmitted && "Success!"}
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            {isJobCreated && "Your teaching opportunity has been posted and is now live."}
            {isApplicationSubmitted && "Your application has been sent to the job poster."}
            {!isJobCreated && !isApplicationSubmitted && "Your Query has been processed successfully."}
          </p>

          <p className="text-gray-500">
            {isJobCreated && "Qualified tutors will start applying soon. We'll notify you when applications come in."}
            {isApplicationSubmitted && "You'll receive updates on your application status via email."}
            {!isJobCreated && !isApplicationSubmitted && "Thank you for using our platform. We'll get back to you soon."}
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Create Profile */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Create Your Profile</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Build a comprehensive profile to showcase your skills, experience, and qualifications to potential
                students or tutors.
              </p>
              <Button
                className="w-full text-white font-medium rounded-xl transition-all duration-200"
                style={{ backgroundColor: "#F5BB07" }}
                asChild
              >
                <Link href="/profile/create" className="flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Explore Courses */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Explore Courses</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Discover a wide range of subjects and courses available on our platform. Find the perfect learning
                opportunity for you.
              </p>
              <Button
                className="w-full text-white font-medium rounded-xl transition-all duration-200"
                style={{ backgroundColor: "#F5BB07" }}
                asChild
              >
                <Link href="/courses" className="flex items-center justify-center gap-2">
                  Browse Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Find Tutors */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Available Tutors</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Connect with experienced tutors in various subjects. Browse profiles, read reviews, and find the perfect
                match.
              </p>
              <Button
                className="w-full text-white font-medium rounded-xl transition-all duration-200"
                style={{ backgroundColor: "#F5BB07" }}
                asChild
              >
                <Link href="/tutors" className="flex items-center justify-center gap-2">
                  Find Tutors
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Next?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl px-6 bg-transparent"
                asChild
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>

              {isJobCreated && (
                <Button
                  className="text-white font-medium rounded-xl px-6"
                  style={{ backgroundColor: "#F5BB07" }}
                  asChild
                >
                  <Link href="/dashboard/jobs">View My Jobs</Link>
                </Button>
              )}

              {isApplicationSubmitted && (
                <Button
                  className="text-white font-medium rounded-xl px-6"
                  style={{ backgroundColor: "#F5BB07" }}
                  asChild
                >
                  <Link href="/dashboard/applications">View My Applications</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
