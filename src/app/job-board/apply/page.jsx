"use client"

import React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, DollarSign, Briefcase } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function JobApplyPage() {
    const searchParams = useSearchParams()
    const jobId = searchParams.get("job_id")

    const [formData, setFormData] = useState({
        cover_letter: "",
        proposed_rate: "",
    })
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!jobId) {
            toast.error("Job ID is required to apply")
            return
        }

        setIsSubmitting(true)

        try {
            const payload = {
                cover_letter: formData.cover_letter,
                proposed_rate: formData.proposed_rate || null,
            }

            await axios.post(`${API_URL}/api/job-board/jobs/${jobId}/apply/`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            toast.success("Application submitted successfully!")

            // Reset form
            setFormData({
                cover_letter: "",
                proposed_rate: "",
            })
        } catch (error) {
            console.error("Error submitting application:", error)
            toast.error("Failed to submit application. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

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
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <Briefcase className="w-8 h-8 text-gray-700" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-balance">Apply for Job</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Submit your application for this teaching opportunity</p>
                    {jobId && <p className="text-gray-500 text-sm mt-2">Job ID: {jobId}</p>}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
                        {/* Cover Letter */}
                        <div className="space-y-2 mb-8">
                            <Label htmlFor="cover_letter" className="text-gray-700 font-medium">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Cover Letter
                            </Label>
                            <p className="text-sm text-gray-500 mb-2">Why are you the right fit for this job?</p>
                            <Textarea
                                id="cover_letter"
                                placeholder="Tell us why you're the perfect candidate for this position. Highlight your relevant experience, skills, and what makes you unique..."
                                value={formData.cover_letter}
                                onChange={(e) => handleInputChange("cover_letter", e.target.value)}
                                className="bg-gray-50 border-gray-200 min-h-[200px]"
                                required
                            />
                        </div>

                        {/* Proposed Rate */}
                        <div className="space-y-2 mb-8">
                            <Label htmlFor="proposed_rate" className="text-gray-700 font-medium">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Proposed Rate (Optional)
                            </Label>
                            <p className="text-sm text-gray-500 mb-2">Leave blank to accept student's budget</p>
                            <Input
                                id="proposed_rate"
                                type="number"
                                step="0.01"
                                placeholder="Enter your proposed rate"
                                value={formData.proposed_rate}
                                onChange={(e) => handleInputChange("proposed_rate", e.target.value)}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !jobId}
                                className="px-8 py-3 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                style={{ backgroundColor: "#F5BB07" }}
                            >
                                {isSubmitting ? "Submitting Application..." : "Submit Application"}
                            </Button>
                        </div>

                        {!jobId && (
                            <div className="text-center mt-4">
                                <p className="text-red-500 text-sm">Job ID is required to submit an application</p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}
