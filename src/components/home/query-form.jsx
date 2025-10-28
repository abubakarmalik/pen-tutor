"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import QueryBgImage from "@/assets/images/home/query-bg.png"

import { Loader2, Send } from "lucide-react"

export default function QueryFormShadcn() {
    const router = useRouter()
    const API_BASE = process.env.NEXT_PUBLIC_API_URL

    const [formData, setFormData] = useState({
        name: "",
        area: "",
        current_class: "",
        subjects: "",
        email: "",
        contact: "",
        special_requirements: "",
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((s) => ({ ...s, [name]: value }))
    }

    const validate = () => {
        if (!formData.name.trim()) return "Please enter your full name."
        if (!formData.email.trim()) return "Please enter your email."
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(formData.email)) return "Please enter a valid email."
        if (!formData.contact.trim()) return "Please enter a contact number."
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const err = validate()
        if (err) {
            toast.error(err)
            return
        }

        setLoading(true)
        try {
            const payload = {
                name: formData.name,
                area: formData.area,
                current_class: formData.current_class,
                subjects: formData.subjects,
                email: formData.email,
                contact_no: formData.contact,
                special_requirements: formData.special_requirements,
            }

            const response = await axios.post(`${API_BASE}/api/auth/student-query/`, payload)
            console.log(response)
            if (response.status === 201) {
                toast.success("Query submitted successfully")
                setFormData({
                    name: "",
                    area: "",
                    current_class: "",
                    subjects: "",
                    email: "",
                    contact: "",
                    special_requirements: "",
                })
                router.push("/query-submitted")
                setLoading(false)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to submit query")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section
            className="relative min-h-screen py-12 sm:py-16 md:py-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${QueryBgImage.src})` }}
        >
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-primary/80 z-0" />
            
            <div className="container relative z-10 mx-auto px-3 sm:px-0">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
                            Student Query Form
                        </h2>
                        <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto px-4">
                            Fill out the form below and we'll connect you with the perfect tutor for your needs
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                                {/* Full Name */}
                                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="h-11 sm:h-12 border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                    />
                                </div>

                                {/* Area */}
                                <div className="space-y-2">
                                    <Label htmlFor="area" className="text-sm font-semibold text-gray-700">
                                        Area
                                    </Label>
                                    <Input
                                        id="area"
                                        name="area"
                                        placeholder="e.g., Gulberg, DHA"
                                        value={formData.area}
                                        onChange={handleChange}
                                        className="h-11 sm:h-12 border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                {/* Class */}
                                <div className="space-y-2">
                                    <Label htmlFor="current_class" className="text-sm font-semibold text-gray-700">
                                        Class / Grade
                                    </Label>
                                    <Input
                                        id="current_class"
                                        name="current_class"
                                        placeholder="e.g., 10th, A-Levels"
                                        value={formData.current_class}
                                        onChange={handleChange}
                                        className="h-11 sm:h-12 border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                {/* Subjects */}
                                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                    <Label htmlFor="subjects" className="text-sm font-semibold text-gray-700">
                                        Subjects
                                    </Label>
                                    <Input
                                        id="subjects"
                                        name="subjects"
                                        placeholder="Math, Physics, Chemistry"
                                        value={formData.subjects}
                                        onChange={handleChange}
                                        className="h-11 sm:h-12 border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                        Email <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="h-11 sm:h-12 border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                    />
                                </div>

                                {/* Contact No */}
                                <div className="space-y-2">
                                    <Label htmlFor="contact" className="text-sm font-semibold text-gray-700">
                                        Contact Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="contact"
                                        name="contact"
                                        type="tel"
                                        placeholder="+92 3XX XXXXXXX"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        className="h-11 sm:h-12 border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        required
                                        inputMode="tel"
                                    />
                                </div>

                                {/* Special Requirements - Full Width */}
                                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                                    <Label htmlFor="special_requirements" className="text-sm font-semibold text-gray-700">
                                        Special Requirements
                                    </Label>
                                    <Textarea
                                        id="special_requirements"
                                        name="special_requirements"
                                        placeholder="Please mention your preferred timing, tutor gender, any accessibility needs, or other specific requirements..."
                                        value={formData.special_requirements}
                                        onChange={handleChange}
                                        className="min-h-[120px] border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        rows={5}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center pt-2 sm:pt-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="bg-[#F5BB07] hover:bg-[#e5ab00] text-primary font-semibold text-base sm:text-lg rounded-full px-8 sm:px-12 py-2 sm:py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Query</span>
                                            {/* <Send className="h-5 w-5 ml-2" /> */}
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Helper Text */}
                            <p className="text-center text-sm text-gray-500 mt-4">
                                <span className="text-red-500">*</span> Required fields
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}