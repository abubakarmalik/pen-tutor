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
  Briefcase,
  Globe,
  Star,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react"

export default function StudentRegistrationForm() {
  const router = useRouter()
  const { user, refetchUser } = useAuth()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    age: "",
    gender: "",
    bio: "",

    // Location
    address: "",
    city: "",
    country: "",

    // Academic Information
    education_level: "",
    institution: "",
    field_of_study: "",
    graduation_year: "",
    gpa: "",

    // Employment Information
    employment_status: "",
    current_job_title: "",
    company: "",
    career_goals: "",

    // Social Profiles
    linkedin_profile: "",
    github_profile: "",
    portfolio_website: "",

    // Skills & Interests (as arrays)
    skills: [],
    interests: [],

    // Preferences (as arrays)
    preferred_learning_time: [],
    notification_preferences: [],
    language_preferences: [],
    social_links: [],

    // File uploads
    profile_picture: null,
    cnic_or_form_b_picture: null,
    degree: null,
    certificates: [],
  })

  const steps = [
    { id: 1, title: "Personal Information", icon: User },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Academic Info", icon: GraduationCap },
    { id: 4, title: "Employment Info", icon: Briefcase },
    { id: 5, title: "Social Profiles", icon: Globe },
    { id: 6, title: "Skills & Interests", icon: Star },
    { id: 7, title: "Preferences", icon: Star },
    { id: 8, title: "Document Uploads", icon: Upload },
    { id: 9, title: "Certificates", icon: FileText },
  ]

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState()
  const [fileNames, setFileNames] = useState({})

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
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("formProgress", JSON.stringify({ step: currentStep, formData }))
  }, [currentStep, formData])

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
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
    // convert ["Email","SMS"] => { Email: true, SMS: true }
    if (!Array.isArray(arr)) return {}
    return arr.reduce((acc, cur) => {
      if (typeof cur === "string" && cur.trim()) acc[cur.trim()] = true
      return acc
    }, {})
  }

  const socialLinksArrayToObject = (arr = []) => {
    // Accept entries like "twitter:https://..." or "Twitter|https://..." or just "Twitter"
    // Output object { twitter: "https://...", Twitter2: "" }
    if (!Array.isArray(arr)) return {}
    const obj = {}
    arr.forEach((entry, i) => {
      if (!entry || typeof entry !== "string") return
      const trimmed = entry.trim()
      // try separators :, |, =>
      let key, val
      if (trimmed.includes("://")) {
        // if URL present, try to split by first space or pipe/colon
        const parts = trimmed.split(/\s+|\||:/)
        if (parts.length >= 2) {
          key = parts[0].replace(/[:\s|]+$/g, "")
          val = parts.slice(1).join(":").trim()
        } else {
          // only a URL present -> use index-based key
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

      // normalize key (avoid duplicates)
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

      // Build payload fields (but handle notification_preferences & social_links specially)
      // We'll iterate keys but skip these special fields
      const skipKeys = ["certificates", "notification_preferences", "social_links"]
      Object.keys(formData).forEach((key) => {
        if (skipKeys.includes(key)) return

        const val = formData[key]
        if (val === null || val === "") return

        // Files
        if (val instanceof File) {
          data.append(key, val)
          return
        }

        // Arrays -> send as JSON string
        if (Array.isArray(val)) {
          if (val.length > 0) {
            data.append(key, JSON.stringify(val))
          }
          return
        }

        // Objects (non-file) -> stringify
        if (typeof val === "object") {
          data.append(key, JSON.stringify(val))
          return
        }

        // otherwise primitive
        data.append(key, val)
      })

      // notification_preferences: backend expects a dict -> convert array -> object
      const notifObj = arrayToObjectTrue(formData.notification_preferences || notificationPrefs || [])
      // If user had local `notificationPrefs` state, prefer that fallback
      data.append("notification_preferences", JSON.stringify(notifObj))

      // social_links: convert array -> object
      const socialObj = socialLinksArrayToObject(formData.social_links || socialLinks || [])
      data.append("social_links", JSON.stringify(socialObj))

      // Certificates: metadata + files
      // We'll append each certificate file (if present) under the same field name `certificates_files`
      // and send certificates metadata list as `certificates`
      const certificatesMetadata = []
      let fileAppendIndex = 0
      certificates.forEach((cert, index) => {
        const hasFile = cert.file instanceof File
        if (hasFile) {
          // append file(s) as repeated field name (certificates_files)
          data.append("certificates_files", cert.file)
          certificatesMetadata.push({
            name: cert.name || `Certificate ${index + 1}`,
            file_index: fileAppendIndex,
            uploaded_at: new Date().toISOString(),
          })
          fileAppendIndex += 1
        } else {
          // if there's an already uploaded_file_url or just a name
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

      // Debug log (optional) — remove in production
      // for (const [k, v] of data.entries()) console.log(k, v)

      // POST to student profile endpoint (get_or_create in your backend will create or update)
      const response = await axios.post(
        `${API_BASE}/api/auth/student-profile/create/`,
        data,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            // DO NOT set Content-Type — browser sets boundary for FormData
          },
        }
      )

      if (response.status === 201 || response.status === 200) {
        toast.success("Profile updated successfully!")
        refetchUser()
      } else {
        toast.error("Unexpected response while updating profile.")
        console.error("Unexpected response", response)
      }
    } catch (error) {
      // DRF commonly responds with { errors: { field: [..] } } or plain data
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
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Student Registration</h2>
        <span className="text-xs sm:text-sm text-gray-200">
          Step {currentStep} of {steps.length}
        </span>
      </div>

      {/* Mobile-first step indicators with horizontal scroll */}
      <div className="overflow-x-auto pb-2 mb-4">
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-max px-1">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep
            const IconComponent = step.icon

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 flex-shrink-0",
                    isCompleted
                      ? "bg-white border-white text-[#313D6A]"
                      : isCurrent
                        ? "bg-[#F5BB07] border-[#F5BB07] text-white"
                        : "bg-transparent border-gray-300 text-gray-300",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                  ) : (
                    <IconComponent className="w-3 h-3 sm:w-5 sm:h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 transition-all duration-200 flex-shrink-0",
                      isCompleted ? "bg-white" : "bg-gray-400",
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-400 rounded-full h-1.5 sm:h-2">
        <div
          className="bg-white h-1.5 sm:h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-[#313D6A] mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-[#313D6A]">Personal Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateOfBirth} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => handleSelectChange("gender", value)} value={formData.gender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-[#313D6A] mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-[#313D6A]">Location</h3>
              <p className="text-gray-600">Where are you located?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full Address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <GraduationCap className="w-12 h-12 text-[#313D6A] mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-[#313D6A]">Academic Information</h3>
              <p className="text-gray-600">Your educational background</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education_level">Education Level</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("education_level", value)}
                  value={formData.education_level}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Education Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="Institution/University"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field_of_study">Field of Study</Label>
                <Input
                  id="field_of_study"
                  name="field_of_study"
                  value={formData.field_of_study}
                  onChange={handleInputChange}
                  placeholder="Field of Study"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <Input
                  id="graduation_year"
                  name="graduation_year"
                  type="number"
                  value={formData.graduation_year}
                  onChange={handleInputChange}
                  placeholder="Graduation Year"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  name="gpa"
                  type="number"
                  step="0.01"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  placeholder="GPA"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 text-[#313D6A] mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-[#313D6A]">Employment Information</h3>
              <p className="text-gray-600">Your work experience and career goals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employment_status">Employment Status</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("employment_status", value)}
                  value={formData.employment_status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_job_title">Current Job Title</Label>
                <Input
                  id="current_job_title"
                  name="current_job_title"
                  value={formData.current_job_title}
                  onChange={handleInputChange}
                  placeholder="Current Job Title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Company Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="career_goals">Career Goals</Label>
              <Textarea
                id="career_goals"
                name="career_goals"
                value={formData.career_goals}
                onChange={handleInputChange}
                placeholder="Describe your career goals..."
                rows={3}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Globe className="w-12 h-12 text-[#313D6A] mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-[#313D6A]">Social Profiles</h3>
              <p className="text-gray-600">Connect your professional profiles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
                <Input
                  id="linkedin_profile"
                  name="linkedin_profile"
                  value={formData.linkedin_profile}
                  onChange={handleInputChange}
                  placeholder="LinkedIn URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_profile">GitHub Profile</Label>
                <Input
                  id="github_profile"
                  name="github_profile"
                  value={formData.github_profile}
                  onChange={handleInputChange}
                  placeholder="GitHub URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio_website">Portfolio Website</Label>
                <Input
                  id="portfolio_website"
                  name="portfolio_website"
                  value={formData.portfolio_website}
                  onChange={handleInputChange}
                  placeholder="Portfolio URL"
                />
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-[#313D6A] mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-[#313D6A]">Skills & Interests</h3>
              <p className="text-gray-600">What are you passionate about?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div className="space-y-3">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    variant="outline"
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
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
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
              <div className="space-y-3">
                <Label>Interests</Label>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddInterest())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddInterest}
                    variant="outline"
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
                        className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
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
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-[#313D6A] mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-[#313D6A]">Preferences</h3>
              <p className="text-gray-600">Customize your experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preferred Learning Time */}
              <div className="space-y-3">
                <Label>Preferred Learning Time</Label>
                <div className="flex gap-2">
                  <Input
                    value={newPreferredTime}
                    onChange={(e) => setNewPreferredTime(e.target.value)}
                    placeholder="e.g., Morning, Evening"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPreferredTime())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddPreferredTime}
                    variant="outline"
                    className="bg-[#313D6A] text-white hover:bg-[#313D6A]/90"
                  >
                    Add
                  </Button>
                </div>
                {preferredLearningTimes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {preferredLearningTimes.map((time) => (
                      <div
                        key={time.id}
                        className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {time.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePreferredTime(time.id)}
                          className="h-4 w-4 p-0 hover:bg-purple-200 ml-1"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Preferences */}
              <div className="space-y-3">
                <Label>Language Preferences</Label>
                <div className="flex gap-2">
                  <Input
                    value={newLanguagePref}
                    onChange={(e) => setNewLanguagePref(e.target.value)}
                    placeholder="e.g., English, Spanish"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguagePref())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddLanguagePref}
                    variant="outline"
                    className="bg-[#313D6A] text-white hover:bg-[#313D6A]/90"
                  >
                    Add
                  </Button>
                </div>
                {languagePrefs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {languagePrefs.map((lang) => (
                      <div
                        key={lang.id}
                        className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                      >
                        {lang.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLanguagePref(lang.id)}
                          className="h-4 w-4 p-0 hover:bg-orange-200 ml-1"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notification Preferences */}
              <div className="space-y-3">
                <Label>Notification Preferences</Label>
                <div className="flex gap-2">
                  <Input
                    value={newNotificationPref}
                    onChange={(e) => setNewNotificationPref(e.target.value)}
                    placeholder="e.g., Email, SMS"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddNotificationPref())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddNotificationPref}
                    variant="outline"
                    className="bg-[#313D6A] text-white hover:bg-[#313D6A]/90"
                  >
                    Add
                  </Button>
                </div>
                {notificationPrefs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {notificationPrefs.map((pref) => (
                      <div
                        key={pref.id}
                        className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                      >
                        {pref.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveNotificationPref(pref.id)}
                          className="h-4 w-4 p-0 hover:bg-yellow-200 ml-1"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <Label>Additional Social Links</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSocialLink}
                    onChange={(e) => setNewSocialLink(e.target.value)}
                    placeholder="e.g., Twitter, Instagram"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSocialLink())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSocialLink}
                    variant="outline"
                    className="bg-[#313D6A] text-white hover:bg-[#313D6A]/90"
                  >
                    Add
                  </Button>
                </div>
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {link.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSocialLink(link.id)}
                          className="h-4 w-4 p-0 hover:bg-indigo-200 ml-1"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="w-12 h-12 text-[#313D6A] mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-[#313D6A]">Document Uploads</h3>
              <p className="text-gray-600">Upload your important documents</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile Picture */}
              <div className="space-y-2">
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#313D6A] transition-colors">
                  <Input
                    id="profile_picture"
                    name="profile_picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profile_picture")}
                    className="hidden"
                  />
                  <label htmlFor="profile_picture" className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{fileNames.profile_picture || "Click to upload"}</p>
                  </label>
                </div>
              </div>

              {/* CNIC or Form B Picture */}
              <div className="space-y-2">
                <Label htmlFor="cnic_or_form_b_picture">CNIC or Form B Picture</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#313D6A] transition-colors">
                  <Input
                    id="cnic_or_form_b_picture"
                    name="cnic_or_form_b_picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cnic_or_form_b_picture")}
                    className="hidden"
                  />
                  <label htmlFor="cnic_or_form_b_picture" className="cursor-pointer">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{fileNames.cnic_or_form_b_picture || "Click to upload"}</p>
                  </label>
                </div>
              </div>

              {/* Degree */}
              <div className="space-y-2">
                <Label htmlFor="degree">Degree Certificate</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#313D6A] transition-colors">
                  <Input
                    id="degree"
                    name="degree"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, "degree")}
                    className="hidden"
                  />
                  <label htmlFor="degree" className="cursor-pointer">
                    <GraduationCap className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{fileNames.degree || "Click to upload"}</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="w-12 h-12 text-[#313D6A] mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-[#313D6A]">Certificates</h3>
              <p className="text-gray-600">Add your professional certificates</p>
            </div>

            {/* Add New Certificate */}
            <div className="flex gap-2">
              <Input
                value={newCertificateName}
                onChange={(e) => setNewCertificateName(e.target.value)}
                placeholder="Certificate name (e.g., 'JavaScript Certification')"
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCertificate())}
              />
              <Button
                type="button"
                onClick={handleAddCertificate}
                className="bg-[#313D6A] text-white hover:bg-[#313D6A]/90"
              >
                Add Certificate
              </Button>
            </div>

            {/* Certificate List */}
            {certificates.length > 0 && (
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-[#313D6A]">{certificate.name}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveCertificate(certificate.id)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#313D6A] transition-colors">
                      <Input
                        id={`certificate-${certificate.id}`}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleCertificateFileChange(certificate.id, e.target.files[0])}
                        className="hidden"
                      />
                      <label htmlFor={`certificate-${certificate.id}`} className="cursor-pointer">
                        <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {certificate.file ? certificate.file.name : "Click to upload certificate"}
                        </p>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-[#313D6A] text-white p-4 sm:p-6">
            <ProgressIndicator />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="min-h-[400px] sm:min-h-[50px]">{renderStepContent()}</div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="flex items-center justify-center gap-2 bg-transparent order-2 sm:order-1 w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="text-sm text-gray-500 text-center order-1 sm:order-2">
                  Step {currentStep} of {steps.length}
                </div>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#313D6A] text-white hover:bg-[#313D6A]/90 flex items-center justify-center gap-2 order-3 w-full sm:w-auto"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#F5BB07] text-black hover:bg-[#F5BB07]/90 font-semibold px-8 order-3 w-full sm:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Complete Registration"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
