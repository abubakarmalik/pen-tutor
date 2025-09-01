"use client"
import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, BookOpen, DollarSign, Users, Video, Plus, Trash } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CreateCoursePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    courseType: "",
    isActive: true,
    hasLiveClasses: false,
    subject: "",
    courseCategories: "", // comma separated
  })

  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  // topics: array of { title, description, order, videoFile }
  const [topics, setTopics] = useState([])

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
      const url = URL.createObjectURL(file)
      setThumbnailPreview(url)
    } else {
      setThumbnailFile(null)
      setThumbnailPreview(null)
    }
  }

  const addTopic = () => {
    setTopics((prev) => [...prev, { title: "", description: "", order: prev.length + 1, videoFile: null }])
  }

  const updateTopic = (index, key, value) => {
    setTopics((prev) => prev.map((t, i) => (i === index ? { ...t, [key]: value } : t)))
  }

  const removeTopic = (index) => {
    setTopics((prev) => prev.filter((_, i) => i !== index).map((t, i) => ({ ...t, order: i + 1 })))
  }

  const handleTopicVideoChange = (index, e) => {
    const file = e.target.files?.[0] ?? null
    updateTopic(index, "videoFile", file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        toast({ title: "Error", description: "You must be logged in to create a course.", variant: "destructive" })
        setIsLoading(false)
        return
      }

      const payload = new FormData()
      payload.append("title", formData.title)
      payload.append("description", formData.description)

      const priceValue = formData.courseType === "free" ? "0.00" : (formData.price ? parseFloat(formData.price).toFixed(2) : "0.00")
      payload.append("price", priceValue)

      // API expects snake_case
      payload.append("course_type", formData.courseType)
      payload.append("is_active", formData.isActive ? "true" : "false")
      payload.append("has_live_classes", formData.hasLiveClasses ? "true" : "false")

      payload.append("subject", formData.subject)

      // categories as JSON array
      const categoriesArr = formData.courseCategories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
      payload.append("course_categories", JSON.stringify(categoriesArr))

      if (thumbnailFile) payload.append("thumbnail", thumbnailFile)

      // Append topics as JSON (without files) and append any topic video files separately.
      const topicsPayload = topics.map((t, i) => ({ title: t.title, description: t.description, order: t.order }))
      payload.append("topics", JSON.stringify(topicsPayload))

      // Append topic video files with predictable keys: topic_0_videos, topic_1_videos
      topics.forEach((t, i) => {
        if (t.videoFile) {
          // Append one file; server should accept this key and associate with topic by order/index.
          payload.append(`topic_${i}_videos`, t.videoFile)
        }
      })

      // Post to teacher endpoint as you requested
      const response = await axios.post(`${API_BASE}/api/teacher/courses/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("course created response", response)

      if (response.status === 201 || response.status === 200) {
        const newId = response.data?.id ?? response.data?.data?.id
        toast({ title: "Success", description: "Course created successfully!" })
        if (newId) router.push(`/courses/details/${newId}`)
        else router.push(`/courses`)
      } else {
        throw new Error("Unexpected response from server")
      }
    } catch (error) {
      console.log("course created error", error)
      toast({ title: "Error", description: "Failed to create course. Please try again.", variant: "destructive" })
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-[#313D6A] hover:bg-[#313D6A]/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-[#313D6A]" />
                <h1 className="text-xl font-semibold text-[#313D6A]">Create New Course</h1>
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
                <CardDescription className="text-gray-200">Fill in the details to create your new course</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[#313D6A] font-medium">
                      Course Title *
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter course title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[#313D6A] font-medium">Subject *</Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="e.g., Mathematics, Physics, Chemistry"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]"
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <Label htmlFor="courseCategories" className="text-[#313D6A] font-medium">Course Categories (comma separated)</Label>
                    <Input
                      id="courseCategories"
                      type="text"
                      placeholder="e.g., Data Science, Web Development"
                      value={formData.courseCategories}
                      onChange={(e) => handleInputChange("courseCategories", e.target.value)}
                      className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]"
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail" className="text-[#313D6A] font-medium">Thumbnail</Label>
                    <input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F5BB07]/20 file:text-[#313D6A]"
                    />
                    {thumbnailPreview && (
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="mt-2 w-48 h-28 object-cover rounded" />
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[#313D6A] font-medium">Course Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what students will learn in this course"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                      rows={4}
                      className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]"
                    />
                  </div>

                  {/* Course Type and Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseType" className="text-[#313D6A] font-medium">Course Type *</Label>
                      <Select
                        value={formData.courseType}
                        onValueChange={(value) => handleInputChange("courseType", value)}
                        required
                      >
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
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={formData.price || ""}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          required={formData.courseType === "paid"}
                          disabled={formData.courseType === "free"}
                          className="pl-10 border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07] disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Topics editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[#313D6A] font-medium">Topics</Label>
                      <Button type="button" variant="ghost" onClick={addTopic} className="text-[#313D6A]">
                        <Plus className="h-4 w-4 mr-2" /> Add Topic
                      </Button>
                    </div>

                    {topics.length === 0 && <p className="text-sm text-gray-500">No topics added yet.</p>}

                    <div className="space-y-4">
                      {topics.map((topic, idx) => (
                        <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold">Topic {idx + 1}</div>
                            <Button type="button" variant="ghost" onClick={() => removeTopic(idx)} className="text-red-500">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Input
                              placeholder="Topic title"
                              value={topic.title}
                              onChange={(e) => updateTopic(idx, "title", e.target.value)}
                              className="border-gray-300"
                            />
                            <Textarea
                              placeholder="Topic description"
                              value={topic.description}
                              onChange={(e) => updateTopic(idx, "description", e.target.value)}
                              rows={2}
                            />

                            <div>
                              <Label className="text-sm">Optional topic video</Label>
                              <input type="file" accept="video/*" onChange={(e) => handleTopicVideoChange(idx, e)} className="block w-full text-sm text-gray-600 mt-1" />
                              {topic.videoFile && <div className="text-xs text-gray-600 mt-1">{topic.videoFile.name}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
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
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                        className="data-[state=checked]:bg-[#F5BB07]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Video className="h-5 w-5 text-[#313D6A]" />
                        <div>
                          <Label htmlFor="hasLiveClasses" className="text-[#313D6A] font-medium">Live Classes</Label>
                          <p className="text-sm text-gray-600">Include live interactive sessions</p>
                        </div>
                      </div>
                      <Switch
                        id="hasLiveClasses"
                        checked={formData.hasLiveClasses}
                        onCheckedChange={(checked) => handleInputChange("hasLiveClasses", checked)}
                        className="data-[state=checked]:bg-[#F5BB07]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] font-semibold px-8 py-2"
                    >
                      {isLoading ? "Creating..." : "Create Course"}
                    </Button>
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
                    <p className="text-xs text-gray-500 mt-1">{(formData.courseCategories || "").split(",").map(s=>s.trim()).filter(Boolean).join(" • ")}</p>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3">{formData.description || "Course description will appear here..."}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          formData.courseType === "free" ? "bg-green-100 text-green-800" : "bg-[#F5BB07]/20 text-[#313D6A]"
                        }`}
                      >
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

                  {/* Topics preview */}
                  {topics.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-[#313D6A] mb-2">Topics Preview</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {topics.map((t, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span>{i + 1}. {t.title || "Untitled"}</span>
                            <span className="text-xs text-gray-500">{t.videoFile ? "Video" : ""}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
