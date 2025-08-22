"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, BookOpen, DollarSign, Users, Video } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params || {}

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const [isLoading, setIsLoading] = useState(false)
  const [course, setCourse] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    courseType: "free",
    isActive: false,
    hasLiveClasses: false,
    subject: "",
  })

  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [removeThumbnail, setRemoveThumbnail] = useState(false)

  const getCourseDetails = async () => {
    if (!id) return
    try {
      const response = await axios.get(`${API_BASE}/api/teacher/courses/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      const courseData = response.data?.data
      if (courseData) {
        setCourse(courseData)
        setFormData({
          title: courseData.title || "",
          description: courseData.description || "",
          price: courseData.price ?? "",
          courseType: courseData.course_type || "free",
          isActive: !!courseData.is_active,
          hasLiveClasses: !!courseData.has_live_classes,
          subject: courseData.subject || "",
        })
        // set existing thumbnail url if available
        setThumbnailPreview(`${API_BASE}${courseData.thumbnail}` || null)
      }
    } catch (err) {
      console.error("Failed to fetch course:", err)
      toast({ title: "Error", description: "Failed to load course details.", variant: "destructive" })
    }
  }

  useEffect(() => {
    getCourseDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0] ?? null
    if (file) {
      setThumbnailFile(file)
      setRemoveThumbnail(false)
      // create local preview
      const url = URL.createObjectURL(file)
      setThumbnailPreview(url)
    }
  }

  const handleRemoveThumbnailToggle = () => {
    setThumbnailFile(null)
    setThumbnailPreview(null)
    setRemoveThumbnail((prev) => !prev)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        toast({ title: "Error", description: "You must be logged in to update a course.", variant: "destructive" })
        setIsLoading(false)
        return
      }

      // Use FormData so we can send file + fields
      const payload = new FormData()
      payload.append("title", formData.title)
      payload.append("description", formData.description)
      const priceValue = formData.courseType === "free" ? 0 : (formData.price || 0)
      payload.append("price", priceValue)
      payload.append("course_type", formData.courseType)
      payload.append("is_active", formData.isActive)
      payload.append("has_live_classes", formData.hasLiveClasses)
      payload.append("subject", formData.subject)

      if (thumbnailFile) {
        payload.append("thumbnail", thumbnailFile)
      }

      // if user explicitly removed thumbnail, tell the backend to remove it
      if (removeThumbnail && !thumbnailFile) {
        // backend should handle this boolean flag and delete existing thumbnail
        payload.append("remove_thumbnail", "true")
      }

      const response = await axios.put(`${API_BASE}/api/teacher/courses/${id}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type; browser will set multipart boundary
        },
      })

      if (response.status === 200 || response.status === 201) {
        toast({ title: "Success", description: "Course updated successfully!" })
        const newId = response.data?.data?.id || id
        router.push(`/courses/details/${newId}`)
      } else {
        throw new Error("Unexpected response status: " + response.status)
      }
    } catch (error) {
      console.error("course update error", error)
      toast({ title: "Error", description: "Failed to update course. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-[#313D6A] hover:bg-[#313D6A]/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-[#313D6A]" />
                <h1 className="text-xl font-semibold text-[#313D6A]">Edit Course</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="bg-[#313D6A] py-2 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Information</span>
                </CardTitle>
                <CardDescription className="text-gray-200">Fill in the details to edit your course</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[#313D6A] font-medium">Course Title *</Label>
                    <Input id="title" type="text" placeholder="Enter course title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]" />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[#313D6A] font-medium">Subject *</Label>
                    <Input id="subject" type="text" placeholder="e.g., Mathematics, Physics, Chemistry" value={formData.subject} onChange={(e) => handleInputChange("subject", e.target.value)} required className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]" />
                  </div>

                  {/* Thumbnail */}
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail" className="text-[#313D6A] font-medium">Thumbnail</Label>
                    <input id="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F5BB07]/20 file:text-[#313D6A]" />
                    <div className="flex items-center gap-3 mt-2">
                      {thumbnailPreview ? (
                        <img src={thumbnailPreview} alt="Thumbnail preview" className="w-48 h-28 object-cover rounded" />
                      ) : (
                        <div className="w-48 h-28 bg-gray-100 rounded flex items-center justify-center text-gray-400">No thumbnail</div>
                      )}
                      <div className="flex flex-col gap-2">
                        <label className="inline-flex items-center space-x-2">
                          <input type="checkbox" checked={removeThumbnail} onChange={handleRemoveThumbnailToggle} />
                          <span className="text-sm">Remove existing thumbnail</span>
                        </label>
                        <p className="text-xs text-gray-500">Uploading a new image will replace the existing thumbnail.</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[#313D6A] font-medium">Course Description *</Label>
                    <Textarea id="description" placeholder="Describe what students will learn in this course" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} required rows={4} className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]" />
                  </div>

                  {/* Course Type and Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseType" className="text-[#313D6A] font-medium">Course Type *</Label>
                      <Select value={formData.courseType} onValueChange={(value) => handleInputChange("courseType", value)} required>
                        <SelectTrigger className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]">
                          <SelectValue placeholder="Select course type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-[#313D6A] font-medium">Price {formData.courseType === "paid" && "*"}</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input id="price" type="number" step="0.01" min="0" placeholder="0.00" value={formData.price || ""} onChange={(e) => handleInputChange("price", e.target.value)} required={formData.courseType === "paid"} disabled={formData.courseType === "free"} className="pl-10 border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07] disabled:bg-gray-100" />
                      </div>
                    </div>
                  </div>

                  {/* Switches */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-[#313D6A]" />
                        <div>
                          <Label htmlFor="isActive" className="text-[#313D6A] font-medium">Course Active</Label>
                          <p className="text-sm text-gray-600">Make this course available to students</p>
                        </div>
                      </div>
                      <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => handleInputChange("isActive", checked)} className="data-[state=checked]:bg-[#F5BB07]" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Video className="h-5 w-5 text-[#313D6A]" />
                        <div>
                          <Label htmlFor="hasLiveClasses" className="text-[#313D6A] font-medium">Live Classes</Label>
                          <p className="text-sm text-gray-600">Include live interactive sessions</p>
                        </div>
                      </div>
                      <Switch id="hasLiveClasses" checked={formData.hasLiveClasses} onCheckedChange={(checked) => handleInputChange("hasLiveClasses", checked)} className="data-[state=checked]:bg-[#F5BB07]" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6">
                    <Button type="submit" disabled={isLoading} className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] font-semibold px-8 py-2">{isLoading ? "Updating..." : "Update Course"}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm sticky top-8">
              <CardHeader className="bg-[#313D6A] py-2 text-white">
                <CardTitle className="text-lg">Course Preview</CardTitle>
                <CardDescription className="text-gray-200">How your course will appear</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#313D6A] text-lg">{formData.title || "Course Title"}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formData.subject || "Subject"}</p>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3">{formData.description || "Course description will appear here..."}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${formData.courseType === "free" ? "bg-green-100 text-green-800" : "bg-[#F5BB07]/20 text-[#313D6A]"}`}>
                        {formData.courseType || "Type"}
                      </span>
                      {formData.hasLiveClasses && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Live</span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-[#313D6A]">{formData.courseType === "free" ? "Free" : `$${formData.price || "0.00"}`}</div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Status:</span>
                    <span className={`font-medium ${formData.isActive ? "text-green-600" : "text-gray-500"}`}>{formData.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
