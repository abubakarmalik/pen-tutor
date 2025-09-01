"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"
import {
  User,
  Mail,
  Phone,
  CalendarIcon,
  MapPin,
  GraduationCap,
  Globe,
  Star,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Heart,
  Zap,
  Trophy,
  Target,
  Rocket,
  School,
  BookOpen,
  Microscope,
  Book,
  Briefcase,
  Search,
  Github,
  Palette,
  Tag,
  Camera,
  IdCard,
  Paperclip,
  Link,
} from "lucide-react"

export default function StudentRegistrationForm() {
  const router = useRouter()
  const { user, refetchUser } = useAuth()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const [formData, setFormData] = useState({
    // Essential Information (Required)
    full_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    age: "",
    gender: "",
    bio: "",
    city: "",
    country: "",
    education_level: "",
    institution: "",

    // Optional Details (Can be skipped)
    address: "",
    field_of_study: "",
    graduation_year: "",
    gpa: "",
    employment_status: "",
    current_job_title: "",
    company: "",
    career_goals: "",
    linkedin_profile: "",
    github_profile: "",
    portfolio_website: "",
    skills: [],
    interests: [],
    preferred_learning_time: [],
    notification_preferences: [],
    language_preferences: [],
    social_links: [],
    profile_picture: null,
    cnic_or_form_b_picture: null,
    degree: null,
    certificates: [],
  })

  const steps = [
    {
      id: 1,
      title: "About You",
      subtitle: "Let's get to know you better!",
      icon: User,
      color: "from-blue-400 to-blue-600",
      required: true,
    },
    {
      id: 2,
      title: "Your Background",
      subtitle: "Tell us about your education",
      icon: GraduationCap,
      color: "from-green-400 to-green-600",
      required: true,
    },
    {
      id: 3,
      title: "Interests",
      subtitle: "What drives your passion?",
      icon: Star,
      color: "from-purple-400 to-purple-600",
      required: false,
    },
    {
      id: 4,
      title: "Connect",
      subtitle: "Your professional presence",
      icon: Globe,
      color: "from-orange-400 to-orange-600",
      required: false,
    },
    {
      id: 5,
      title: "",
      subtitle: "Upload your documents",
      icon: Upload,
      color: "from-pink-400 to-pink-600",
      required: false,
    },
  ]

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState()
  const [fileNames, setFileNames] = useState({})
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [showCelebration, setShowCelebration] = useState(false)

  // Skills and interests management
  const [skillsList, setSkillsList] = useState([])
  const [interestsList, setInterestsList] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")

  // Preferences management
  const [preferredLearningTimes, setPreferredLearningTimes] = useState([])
  const [notificationPrefs, setNotificationPrefs] = useState([])
  const [languagePrefs, setLanguagePrefs] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const [newPreferredTime, setNewPreferredTime] = useState("")
  const [newNotificationPref, setNewNotificationPref] = useState("")
  const [newLanguagePref, setNewLanguagePref] = useState("")
  const [newSocialLink, setNewSocialLink] = useState("")

  // Certificates management
  const [certificates, setCertificates] = useState([])
  const [newCertificateName, setNewCertificateName] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("formProgress")
    if (saved) {
      const parsed = JSON.parse(saved)
      setCurrentStep(parsed.step || 1)
      setFormData(parsed.formData || formData)
      setCompletedSteps(new Set(parsed.completedSteps || []))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "formProgress",
      JSON.stringify({
        step: currentStep,
        formData,
        completedSteps: Array.from(completedSteps),
      }),
    )
  }, [currentStep, formData, completedSteps])

  const triggerCelebration = () => {
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      if (currentStep === 1 || currentStep === 2) {
        triggerCelebration()
      }
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    if (currentStep < steps.length && !steps[currentStep - 1]) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    setDateOfBirth(date)
    if (date) {
      setFormData((prev) => ({ ...prev, date_of_birth: format(date, "yyyy-MM-dd") }))
    }
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }))
      setFileNames((prev) => ({ ...prev, [fieldName]: file.name }))
    }
  }

  // Skills management functions
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const skill = { id: Date.now(), name: newSkill.trim() }
      setSkillsList((prev) => [...prev, skill])
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (id) => {
    setSkillsList((prev) => prev.filter((skill) => skill.id !== id))
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((skill) => skill.id !== id) }))
  }

  // Interests management functions
  const handleAddInterest = () => {
    if (newInterest.trim()) {
      const interest = { id: Date.now(), name: newInterest.trim() }
      setInterestsList((prev) => [...prev, interest])
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, interest] }))
      setNewInterest("")
    }
  }

  const handleRemoveInterest = (id) => {
    setInterestsList((prev) => prev.filter((interest) => interest.id !== id))
    setFormData((prev) => ({ ...prev, interests: prev.interests.filter((interest) => interest.id !== id) }))
  }

  // Preferences management functions
  const handleAddPreferredTime = () => {
    if (newPreferredTime.trim()) {
      const time = { id: Date.now(), name: newPreferredTime.trim() }
      setPreferredLearningTimes((prev) => [...prev, time])
      setFormData((prev) => ({ ...prev, preferred_learning_time: [...prev.preferred_learning_time, time] }))
      setNewPreferredTime("")
    }
  }

  const handleRemovePreferredTime = (id) => {
    setPreferredLearningTimes((prev) => prev.filter((time) => time.id !== id))
    setFormData((prev) => ({
      ...prev,
      preferred_learning_time: prev.preferred_learning_time.filter((time) => time.id !== id),
    }))
  }

  const handleAddNotificationPref = () => {
    if (newNotificationPref.trim()) {
      const pref = { id: Date.now(), name: newNotificationPref.trim() }
      setNotificationPrefs((prev) => [...prev, pref])
      setFormData((prev) => ({ ...prev, notification_preferences: [...prev.notification_preferences, pref] }))
      setNewNotificationPref("")
    }
  }

  const handleRemoveNotificationPref = (id) => {
    setNotificationPrefs((prev) => prev.filter((pref) => pref.id !== id))
    setFormData((prev) => ({
      ...prev,
      notification_preferences: prev.notification_preferences.filter((pref) => pref.id !== id),
    }))
  }

  const handleAddLanguagePref = () => {
    if (newLanguagePref.trim()) {
      const lang = { id: Date.now(), name: newLanguagePref.trim() }
      setLanguagePrefs((prev) => [...prev, lang])
      setFormData((prev) => ({ ...prev, language_preferences: [...prev.language_preferences, lang] }))
      setNewLanguagePref("")
    }
  }

  const handleRemoveLanguagePref = (id) => {
    setLanguagePrefs((prev) => prev.filter((lang) => lang.id !== id))
    setFormData((prev) => ({
      ...prev,
      language_preferences: prev.language_preferences.filter((lang) => lang.id !== id),
    }))
  }

  const handleAddSocialLink = () => {
    if (newSocialLink.trim()) {
      const link = { id: Date.now(), name: newSocialLink.trim() }
      setSocialLinks((prev) => [...prev, link])
      setFormData((prev) => ({ ...prev, social_links: [...prev.social_links, link] }))
      setNewSocialLink("")
    }
  }

  const handleRemoveSocialLink = (id) => {
    setSocialLinks((prev) => prev.filter((link) => link.id !== id))
    setFormData((prev) => ({ ...prev, social_links: prev.social_links.filter((link) => link.id !== id) }))
  }

  // Certificates management functions
  const handleAddCertificate = () => {
    if (newCertificateName.trim()) {
      const certificate = { id: Date.now(), name: newCertificateName.trim(), file: null }
      setCertificates((prev) => [...prev, certificate])
      setFormData((prev) => ({ ...prev, certificates: [...prev.certificates, certificate] }))
      setNewCertificateName("")
    }
  }

  const handleRemoveCertificate = (id) => {
    setCertificates((prev) => prev.filter((cert) => cert.id !== id))
    setFormData((prev) => ({ ...prev, certificates: prev.certificates.filter((cert) => cert.id !== id) }))
  }

  const handleCertificateFileChange = (certificateId, file) => {
    setCertificates((prev) => prev.map((cert) => (cert.id === certificateId ? { ...cert, file } : cert)))
    setFormData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((cert) => (cert.id === certificateId ? { ...cert, file } : cert)),
    }))
  }

  const arrayToObjectTrue = (arr = []) => {
    if (!Array.isArray(arr)) return {}
    return arr.reduce((acc, cur) => {
      if (typeof cur === "string" && cur.trim()) acc[cur.trim()] = true
      return acc
    }, {})
  }

  const socialLinksArrayToObject = (arr = []) => {
    if (!Array.isArray(arr)) return {}
    const obj = {}
    arr.forEach((entry, i) => {
      if (!entry || typeof entry !== "string") return
      const trimmed = entry.trim()
      let key, val
      if (trimmed.includes("://")) {
        const parts = trimmed.split(/\s+|\||:/)
        if (parts.length >= 2) {
          key = parts[0].replace(/[:\s|]+$/g, "")
          val = parts.slice(1).join(":").trim()
        } else {
          key = `link_${i + 1}`
          val = trimmed
        }
      } else if (trimmed.includes("|")) {
        const parts = trimmed.split("|")
        key = parts[0].trim()
        val = parts[1] ? parts[1].trim() : ""
      } else if (trimmed.includes(":")) {
        const idx = trimmed.indexOf(":")
        key = trimmed.slice(0, idx).trim()
        val = trimmed.slice(idx + 1).trim()
      } else if (trimmed.includes("=>")) {
        const parts = trimmed.split("=>")
        key = parts[0].trim()
        val = parts[1] ? parts[1].trim() : ""
      } else {
        key = trimmed
        val = ""
      }

      let normalizedKey = key || `link_${i + 1}`
      let suffix = 1
      while (obj.hasOwnProperty(normalizedKey)) {
        normalizedKey = `${key}_${suffix++}`
      }
      obj[normalizedKey] = val
    })
    return obj
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("access_token")
      const data = new FormData()

      const skipKeys = ["certificates", "notification_preferences", "social_links"]
      Object.keys(formData).forEach((key) => {
        if (skipKeys.includes(key)) return

        const val = formData[key]
        if (val === null || val === "") return

        if (val instanceof File) {
          data.append(key, val)
          return
        }

        if (Array.isArray(val)) {
          if (val.length > 0) {
            data.append(key, JSON.stringify(val))
          }
          return
        }

        if (typeof val === "object") {
          data.append(key, JSON.stringify(val))
          return
        }

        data.append(key, val)
      })

      const notifObj = arrayToObjectTrue(formData.notification_preferences || notificationPrefs || [])
      data.append("notification_preferences", JSON.stringify(notifObj))

      const socialObj = socialLinksArrayToObject(formData.social_links || socialLinks || [])
      data.append("social_links", JSON.stringify(socialObj))

      const certificatesMetadata = []
      let fileAppendIndex = 0
      certificates.forEach((cert, index) => {
        const hasFile = cert.file instanceof File
        if (hasFile) {
          data.append("certificates_files", cert.file)
          certificatesMetadata.push({
            name: cert.name || `Certificate ${index + 1}`,
            file_index: fileAppendIndex,
            uploaded_at: new Date().toISOString(),
          })
          fileAppendIndex += 1
        } else {
          certificatesMetadata.push({
            name: cert.name || `Certificate ${index + 1}`,
            file_index: null,
            uploaded_at: cert.uploaded_file_url ? null : new Date().toISOString(),
            uploaded_file_url: cert.uploaded_file_url || null,
          })
        }
      })

      if (certificatesMetadata.length > 0) {
        data.append("certificates", JSON.stringify(certificatesMetadata))
      }

      const response = await axios.post(`${API_BASE}/api/auth/student-profile/create/`, data, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })

      if (response.status === 201 || response.status === 200) {
        toast.success("Profile updated successfully!")
        refetchUser()
        router.push("/student/dashboard")
      } else {
        toast.error("Unexpected response while updating profile.")
        console.error("Unexpected response", response)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Backend error:", error.response.data)
        toast.error("Failed to update profile: " + (error.response.data.message || JSON.stringify(error.response.data)))
      } else {
        console.error(error)
        toast.error("An error occurred while updating your profile.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const ProgressIndicator = () => (
    <div className="relative">
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="animate-pulse">
            <Sparkles className="w-12 h-12 text-[#F5BB07] animate-spin" />
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        {/* <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
          <Rocket className="w-6 h-6 text-[#F5BB07]" />
          <h2 className="text-2xl font-bold text-white">Your Journey to Success</h2>
          <Trophy className="w-6 h-6 text-[#F5BB07]" />
        </div> */}
        <p className="text-white/90 text-lg">{steps[currentStep - 1].subtitle}</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full p-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id)
            const isCurrent = step.id === currentStep

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-full border-3 transition-all duration-500 transform",
                    isCompleted
                      ? "bg-[#F5BB07] border-[#F5BB07] text-[#313D6A] scale-110"
                      : isCurrent
                        ? "bg-white border-white text-[#313D6A] scale-110 animate-pulse"
                        : "bg-transparent border-white/50 text-white/70 hover:scale-105",
                  )}
                >
                  {isCompleted ? (
                    <div className="flex items-center justify-center">
                      <Check className="w-6 h-6 " />
                    </div>
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}

                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className={cn("text-xs font-medium", isCurrent ? "text-[#F5BB07]" : "text-white/70")}>
                      {step.title}
                    </span>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-1 mx-2 rounded-full transition-all duration-500",
                      isCompleted ? "bg-[#F5BB07]" : "bg-white/30",
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative">
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#F5BB07] to-yellow-300 h-3 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>
        <div className="text-center mt-2">
          <span className="text-white/90 text-sm font-medium">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-[#F5BB07] to-yellow-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <User className="w-12 h-12 text-[#313D6A]" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Heart className="w-6 h-6 text-red-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#313D6A] mb-2 flex items-center justify-center gap-2">
                Welcome! <User className="w-8 h-8" />
              </h3>
              <p className="text-gray-600 text-lg">Let's start with the basics about you</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-700">
                  <Zap className="w-4 h-4 inline mr-1" />
                  This step is required to create your profile
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-[#313D6A] font-semibold">
                    First Name *
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First name"
                    required
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-[#313D6A] font-semibold">
                    Last Name *
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    required
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-[#313D6A] font-semibold">
                    Age
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="25"
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date of Birth
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-2 border-gray-200 hover:border-[#F5BB07]",
                          !dateOfBirth && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick your birth date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dateOfBirth} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-[#313D6A] font-semibold">
                    Gender
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-[#F5BB07]">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    City *
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Your city"
                    required
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-[#313D6A] font-semibold">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Your country"
                    required
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <Label htmlFor="bio" className="text-[#313D6A] font-semibold">
                  Tell us about yourself
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Share a bit about yourself, your interests, and what you're looking to achieve..."
                  rows={4}
                  className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Target className="w-6 h-6 text-[#F5BB07] animate-pulse" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#313D6A] mb-2 flex items-center justify-center gap-2">
                Your Academic Journey <GraduationCap className="w-8 h-8" />
              </h3>
              <p className="text-gray-600 text-lg">Tell us about your educational background</p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="text-sm text-green-700">
                  <Zap className="w-4 h-4 inline mr-1" />
                  This helps us match you with the right opportunities
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="education_level" className="text-[#313D6A] font-semibold">
                    Education Level *
                  </Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("education_level", value)}
                    value={formData.education_level}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-[#F5BB07]">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school" className="flex items-center">
                        <School className="w-4 h-4 mr-2" /> High School
                      </SelectItem>
                      <SelectItem value="bachelors" className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" /> Bachelor's Degree
                      </SelectItem>
                      <SelectItem value="masters" className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" /> Master's Degree
                      </SelectItem>
                      <SelectItem value="phd" className="flex items-center">
                        <Microscope className="w-4 h-4 mr-2" /> PhD
                      </SelectItem>
                      <SelectItem value="other" className="flex items-center">
                        <Book className="w-4 h-4 mr-2" /> Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution" className="text-[#313D6A] font-semibold">
                    Institution *
                  </Label>
                  <Input
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="Your school/university name"
                    required
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="field_of_study" className="text-[#313D6A] font-semibold">
                    Field of Study
                  </Label>
                  <Input
                    id="field_of_study"
                    name="field_of_study"
                    value={formData.field_of_study}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science, Business"
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduation_year" className="text-[#313D6A] font-semibold">
                    Graduation Year
                  </Label>
                  <Input
                    id="graduation_year"
                    name="graduation_year"
                    type="number"
                    value={formData.graduation_year}
                    onChange={handleInputChange}
                    placeholder="2024"
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Star className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#313D6A] mb-2 flex items-center justify-center gap-2">
                What Drives You? <Star className="w-8 h-8" />
              </h3>
              <p className="text-gray-600 text-lg">Share your interests and goals with us</p>
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <p className="text-sm text-purple-700 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" /> This step is optional but helps us personalize your experience
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills */}
                <div className="space-y-4">
                  <Label className="text-[#313D6A] font-semibold text-lg flex items-center gap-2">
                    <Rocket className="w-5 h-5" /> Your Skills
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill (e.g., JavaScript, Design)"
                      className="flex-1 border-2 border-gray-200 focus:border-[#F5BB07]"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-[#313D6A] text-white hover:bg-[#313D6A]/90"
                    >
                      Add
                    </Button>
                  </div>
                  {skillsList.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium animate-fadeIn"
                        >
                          {skill.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSkill(skill.id)}
                            className="h-4 w-4 p-0 hover:bg-blue-200 ml-1"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div className="space-y-4">
                  <Label className="text-[#313D6A] font-semibold text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5" /> Your Interests
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest (e.g., Photography, Music)"
                      className="flex-1 border-2 border-gray-200 focus:border-[#F5BB07]"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
                    />
                    <Button
                      type="button"
                      onClick={handleAddInterest}
                      className="bg-[#313D6A] text-white hover:bg-[#313D6A]/90"
                    >
                      Add
                    </Button>
                  </div>
                  {interestsList.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {interestsList.map((interest) => (
                        <div
                          key={interest.id}
                          className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium animate-fadeIn"
                        >
                          {interest.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveInterest(interest.id)}
                            className="h-4 w-4 p-0 hover:bg-green-200 ml-1"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <Label htmlFor="career_goals" className="text-[#313D6A] font-semibold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" /> Your Goals
                </Label>
                <Textarea
                  id="career_goals"
                  name="career_goals"
                  value={formData.career_goals}
                  onChange={handleInputChange}
                  placeholder="What are your career goals and aspirations? What do you hope to achieve?"
                  rows={4}
                  className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Globe className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#313D6A] mb-2 flex items-center justify-center gap-2">
                Connect & Share <Globe className="w-8 h-8" />
              </h3>
              <p className="text-gray-600 text-lg">Show off your professional presence</p>
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <p className="text-sm text-orange-700 flex items-center">
                  <Link className="w-4 h-4 mr-1" /> Optional: Add your professional profiles to stand out
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_profile" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> LinkedIn Profile
                  </Label>
                  <Input
                    id="linkedin_profile"
                    name="linkedin_profile"
                    value={formData.linkedin_profile}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourname"
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_profile" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub Profile
                  </Label>
                  <Input
                    id="github_profile"
                    name="github_profile"
                    value={formData.github_profile}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourname"
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio_website" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Portfolio Website
                  </Label>
                  <Input
                    id="portfolio_website"
                    name="portfolio_website"
                    value={formData.portfolio_website}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.com"
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="employment_status" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Employment Status
                  </Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("employment_status", value)}
                    value={formData.employment_status}
                  >
                    <SelectTrigger className="border-2 border-gray-200 focus:border-[#F5BB07]">
                      <SelectValue placeholder="Select your current status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student" className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" /> Student
                      </SelectItem>
                      <SelectItem value="employed" className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" /> Employed
                      </SelectItem>
                      <SelectItem value="self_employed" className="flex items-center">
                        <Rocket className="w-4 h-4 mr-2" /> Self Employed
                      </SelectItem>
                      <SelectItem value="unemployed" className="flex items-center">
                        <Search className="w-4 h-4 mr-2" /> Looking for opportunities
                      </SelectItem>
                      <SelectItem value="other" className="flex items-center">
                        <FileText className="w-4 h-4 mr-2" /> Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_job_title" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Current Job Title
                  </Label>
                  <Input
                    id="current_job_title"
                    name="current_job_title"
                    value={formData.current_job_title}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Developer, Student"
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Upload className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#313D6A] mb-2 flex items-center justify-center gap-2">
                Final Touches <FileText className="w-8 h-8" />
              </h3>
              <p className="text-gray-600 text-lg">Upload your documents to complete your profile</p>
              <div className="mt-4 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400">
                <p className="text-sm text-pink-700 flex items-center">
                  <Paperclip className="w-4 h-4 mr-1" /> Optional: Add documents to verify your credentials
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <div className="space-y-2">
                  <Label htmlFor="profile_picture" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Profile Picture
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F5BB07] transition-colors cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
                    <Input
                      id="profile_picture"
                      name="profile_picture"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "profile_picture")}
                      className="hidden"
                    />
                    <label htmlFor="profile_picture" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-[#313D6A] mb-3" />
                      <p className="text-sm text-gray-600 font-medium">
                        {fileNames.profile_picture || "Click to upload your photo"}
                      </p>
                    </label>
                  </div>
                </div>

                {/* CNIC or Form B Picture */}
                <div className="space-y-2">
                  <Label htmlFor="cnic_or_form_b_picture" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <IdCard className="w-4 h-4" /> ID Document
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F5BB07] transition-colors cursor-pointer bg-gradient-to-br from-green-50 to-green-100">
                    <Input
                      id="cnic_or_form_b_picture"
                      name="cnic_or_form_b_picture"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "cnic_or_form_b_picture")}
                      className="hidden"
                    />
                    <label htmlFor="cnic_or_form_b_picture" className="cursor-pointer">
                      <FileText className="mx-auto h-12 w-12 text-[#313D6A] mb-3" />
                      <p className="text-sm text-gray-600 font-medium">
                        {fileNames.cnic_or_form_b_picture || "Upload CNIC/Form B"}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Degree */}
                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-[#313D6A] font-semibold flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Degree Certificate
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F5BB07] transition-colors cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100">
                    <Input
                      id="degree"
                      name="degree"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "degree")}
                      className="hidden"
                    />
                    <label htmlFor="degree" className="cursor-pointer">
                      <GraduationCap className="mx-auto h-12 w-12 text-[#313D6A] mb-3" />
                      <p className="text-sm text-gray-600 font-medium">{fileNames.degree || "Upload your degree"}</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-primary/10 rounded-lg py-4 sm:py-8">

      {/* Decorative background circles */}
      <div className="absolute z-0 inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border-[10px] border-[#F5BB07]/60 rounded-full " />
        <div className="absolute top-20 right-9 w-24 h-24 rounded-full opacity-60 bg-[#F5BB07]" />
        <div className="absolute bottom-32 left-16 w-40 h-40 rounded-full opacity-25 bg-[#F5BB07]" />
        <div className="absolute bottom-20 right-32 w-28 h-28 border-[10px] border-[#F5BB07]/60 rounded-full opacity-60" />
        <div className="absolute top-1/2 left-0 w-36 h-36 rounded-full opacity-50 -translate-x-1/2 bg-[#F5BB07]" />
        <div className="absolute top-1/3 right-0 w-32 h-32 border-[10px] border-[#F5BB07]/60 rounded-full opacity-60 translate-x-1/2" />
      </div>

      <div className="max-w-5xl overflow-hidden relative z-10 mx-auto  px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl gap-0  py-0 overflow-hidden border-0">
          <CardHeader className="bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] rounded-none rounded-t-lg text-white p-6 sm:p-8">
            <ProgressIndicator />
          </CardHeader>
          <CardContent className="p-6 sm:p-8 lg:p-10 bg-gray-50">
            <form className="space-y-8">
              <div className="min-h-[500px]">{renderStepContent()}</div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-8 border-t-2 border-gray-200">
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-[#313D6A] order-2 sm:order-1 w-full sm:w-auto px-6 py-3"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </Button>

                <div className="text-center order-1 sm:order-2">
                  <div className="text-lg font-bold text-[#313D6A]">
                    Step {currentStep} of {steps.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    {steps[currentStep - 1].required ? "Required" : "Optional"}
                  </div>
                </div>

                <div className="flex gap-3 order-3 w-full sm:w-auto">
                  {!steps[currentStep - 1].required && currentStep < steps.length && (
                    <Button
                      type="button"
                      onClick={handleSkip}
                      variant="ghost"
                      className="text-gray-500 hover:text-[#313D6A] px-6 py-3"
                    >
                      Skip for now
                    </Button>
                  )}

                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-[#F5BB07] to-yellow-400 text-[#313D6A] hover:from-[#F5BB07]/90 hover:to-yellow-400/90 font-bold flex items-center justify-center gap-2 px-8 py-3 shadow-lg transform hover:scale-105 transition-all"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-[#F5BB07] to-yellow-400 text-[#313D6A] hover:from-[#F5BB07]/90 hover:to-yellow-400/90 font-bold px-8 py-3 shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#313D6A]"></div>
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          <Trophy className="w-5 h-5" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}