"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Clock, DollarSign, BookOpen } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function JobCreationForm() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        course: "",
        subject_text: "",
        teaching_mode: "remote",
        budget_amount: "",
        budget_type: "per_hour",
        duration_value: "",
        duration_unit: "",
        additional_notes: "",
        location: "",
        deadline: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const payload = {
                ...formData,
                course: Number.parseInt(formData.course) || 0,
                duration_value: Number.parseInt(formData.duration_value) || 0,
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : new Date().toISOString(),
            }

           const response = await axios.post(`${API_URL}/api/job-board/jobs/create/`, payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
           })
           console.log(response)

           toast.success("Job created successfully!")

            // Reset form
            setFormData({
                title: "",
                description: "",
                course: "",
                subject_text: "",
                teaching_mode: "remote",
                budget_amount: "",
                budget_type: "per_hour",
                duration_value: "",
                duration_unit: "",
                additional_notes: "",
                location: "",
                deadline: "",
            })
        } catch (error) {
            console.error("Error creating job:", error)
            toast.error("Failed to create job. Please try again.")
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
                        <BookOpen className="w-8 h-8 text-gray-700" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-balance">Job Creation Form</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Create a new teaching opportunity</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-gray-700 font-medium">
                                    Job Title
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Enter job title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="course" className="text-gray-700 font-medium">
                                    Course ID
                                </Label>
                                <Input
                                    id="course"
                                    type="number"
                                    placeholder="Enter course ID"
                                    value={formData.course}
                                    onChange={(e) => handleInputChange("course", e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject_text" className="text-gray-700 font-medium">
                                    Subject
                                </Label>
                                <Input
                                    id="subject_text"
                                    placeholder="Enter subject"
                                    value={formData.subject_text}
                                    onChange={(e) => handleInputChange("subject_text", e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-gray-700 font-medium">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    placeholder="Enter location"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 mb-8">
                            <Label htmlFor="description" className="text-gray-700 font-medium">
                                Job Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the job requirements and expectations"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                className="bg-gray-50 border-gray-200 min-h-[120px]"
                                required
                            />
                        </div>

                        {/* Teaching Mode */}
                        <div className="space-y-4 mb-8">
                            <Label className="text-gray-700 font-medium">Teaching Mode</Label>
                            <RadioGroup
                                value={formData.teaching_mode}
                                onValueChange={(value) => handleInputChange("teaching_mode", value)}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="remote" id="remote" />
                                    <Label htmlFor="remote" className="text-gray-600">
                                        Remote
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="physical" id="physical" />
                                    <Label htmlFor="physical" className="text-gray-600">
                                        In Person
                                    </Label>
                                </div>
                                {/* <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="hybrid" id="hybrid" />
                                    <Label htmlFor="hybrid" className="text-gray-600">
                                        Hybrid
                                    </Label>
                                </div> */}
                            </RadioGroup>
                        </div>

                        {/* Budget Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <Label htmlFor="budget_amount" className="text-gray-700 font-medium">
                                    <DollarSign className="w-4 h-4 inline mr-1" />
                                    Budget Amount
                                </Label>
                                <Input
                                    id="budget_amount"
                                    placeholder="Enter budget amount"
                                    value={formData.budget_amount}
                                    onChange={(e) => handleInputChange("budget_amount", e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-gray-700 font-medium">Budget Type</Label>
                                <RadioGroup
                                    value={formData.budget_type}
                                    onValueChange={(value) => handleInputChange("budget_type", value)}
                                    className="flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="per_hour" id="per_hour" />
                                        <Label htmlFor="per_hour" className="text-gray-600">
                                            Per Hour
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="fixed" id="fixed" />
                                        <Label htmlFor="fixed" className="text-gray-600">
                                            Fixed
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <Label htmlFor="duration_value" className="text-gray-700 font-medium">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Duration Value
                                </Label>
                                <Input
                                    id="duration_value"
                                    type="number"
                                    placeholder="Enter duration"
                                    value={formData.duration_value}
                                    onChange={(e) => handleInputChange("duration_value", e.target.value)}
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration_unit" className="text-gray-700 font-medium">
                                    Duration Unit
                                </Label>
                                <Select
                                    value={formData.duration_unit}
                                    onValueChange={(value) => handleInputChange("duration_unit", value)}
                                >
                                    <SelectTrigger className="bg-gray-50 border-gray-200">
                                        <SelectValue placeholder="Select duration unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hours">Hours</SelectItem>
                                        <SelectItem value="days">Days</SelectItem>
                                        <SelectItem value="weeks">Weeks</SelectItem>
                                        <SelectItem value="months">Months</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="space-y-2 mb-8">
                            <Label htmlFor="deadline" className="text-gray-700 font-medium">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Application Deadline
                            </Label>
                            <Input
                                id="deadline"
                                type="datetime-local"
                                value={formData.deadline}
                                onChange={(e) => handleInputChange("deadline", e.target.value)}
                                className="bg-gray-50 border-gray-200"
                                required
                            />
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-2 mb-8">
                            <Label htmlFor="additional_notes" className="text-gray-700 font-medium">
                                Additional Notes
                            </Label>
                            <Textarea
                                id="additional_notes"
                                placeholder="Any additional requirements or notes"
                                value={formData.additional_notes}
                                onChange={(e) => handleInputChange("additional_notes", e.target.value)}
                                className="bg-gray-50 border-gray-200 min-h-[100px]"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 text-lg font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                                style={{ backgroundColor: "#F5BB07" }}
                            >
                                {isSubmitting ? "Creating Job..." : "Create Job"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
