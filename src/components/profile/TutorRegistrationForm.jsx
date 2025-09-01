"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  User,
  GraduationCap,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  BookOpen,
  Clock,
  Heart,
  Send,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import Loader from "@/components/shared/Loader"
import { useAuth } from "../auth/AuthContext"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Label } from "../ui/label"

const steps = [
  {
    id: 1,
    title: "Personal Details",
    icon: User,
    description: "Tell us about yourself",
    color: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "Professional Background",
    icon: Briefcase,
    description: "Your expertise & experience",
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 3,
    title: "Qualifications",
    icon: GraduationCap,
    description: "Education & certifications",
    color: "from-pink-500 to-red-600",
  },
  {
    id: 4,
    title: "Teaching Preferences",
    icon: BookOpen,
    description: "How you like to teach",
    color: "from-red-500 to-orange-600",
  },
  {
    id: 5,
    title: "Availability & Links",
    icon: Calendar,
    description: "Schedule & social profiles",
    color: "from-orange-500 to-yellow-600",
  },
  {
    id: 6,
    title: "Final Setup",
    icon: Star,
    description: "Documents & preferences",
    color: "from-yellow-500 to-green-600",
  },
]

const ProgressIndicator = ({ currentStep, totalSteps, onStepClick }) => {
  return (
    <div className="w-full mb-8">
      {/* Mobile Progress Bar */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#313D6A] flex items-center justify-center">
              <span className="text-white text-sm font-bold">{currentStep}</span>
            </div>
            <div>
              <p className="text-base font-semibold text-[#313D6A]">{steps[currentStep - 1]?.title}</p>
              <p className="text-sm text-gray-500">{steps[currentStep - 1]?.description}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {currentStep}/{totalSteps}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#313D6A] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            const IconComponent = step.icon

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  <button
                    onClick={() => onStepClick(step.id)}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 border-2
                      ${isCompleted
                        ? "bg-[#313D6A] border-[#313D6A] text-white shadow-md"
                        : isCurrent
                          ? "bg-white border-[#F5BB07] text-[#313D6A] shadow-md"
                          : "bg-white border-gray-300 text-gray-400 hover:border-gray-400"
                      }
                    `}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                      flex-1 h-0.5 mx-4 rounded transition-all duration-500
                      ${isCompleted ? "bg-[#313D6A]" : "bg-gray-300"}
                    `}
                    />
                  )}
                </div>
                <div className="mt-3 text-center max-w-24">
                  <p className={`text-xs font-medium leading-tight ${isCurrent ? "text-[#313D6A]" : "text-gray-500"}`}>
                    {step.title}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function TutorRegistrationForm() {
  const { user, refetchUser } = useAuth()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    // Base Information
    full_name: "",
    email: "",
    age: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    bio: "",
    profile_picture: null,

    // Professional Information
    headline: "",
    expertise_areas: [],
    expertise_level: "expert",
    years_of_experience: 0,
    employment_type: "part_time",
    department: "",
    hourly_rate: "",

    // Documents
    resume: null,
    degree_certificates: null,
    id_proof: null,

    // Qualifications (JSON arrays)
    education: [],
    certifications: [],
    awards: [],
    publications: [],

    // Course-Related
    teaching_style: "",
    languages_spoken: [],

    // Professional Links
    linkedin_profile: "",
    github_profile: "",
    personal_website: "",
    youtube_channel: "",
    social_links: {},

    // Availability & Preferences (JSON objects)
    availability_schedule: {},
    preferred_teaching_methods: [],
    course_categories: [],
    notification_preferences: { email: true, sms: false },

    // Legacy fields to maintain compatibility
    mobile_number_1: "",
    mobile_number_2: "",
    area: "",
    location: "",
    organization_name: "",
    designation: "",
    level: "",
    member_since: "",
    salary_package: "",
    timings_required: "",
    experience: "",
    areas_to_teach: "",
    can_teach_online: false,
    minimum_qualification_required: "",
    experience_required: "",
    subjects: [],
    qualifications: [],
    cnic: "",
    cnic_front: null,
    cnic_back: null,
    degree_image: null,
  })

  const [fileNames, setFileNames] = useState({
    profile_picture: "",
    resume: "",
    degree_certificates: "",
    id_proof: "",
    cnic_front: "",
    cnic_back: "",
    degree_image: "",
  })

  const [educationEntries, setEducationEntries] = useState([{ institution: "", degree: "", year: "" }])
  const [certificationEntries, setCertificationEntries] = useState([{ name: "", year: "" }])
  const [awardEntries, setAwardEntries] = useState([{ title: "", year: "", description: "" }])
  const [publicationEntries, setPublicationEntries] = useState([{ title: "", year: "", journal: "" }])
  const [socialLinksEntries, setSocialLinksEntries] = useState({ twitter: "", facebook: "", instagram: "" })

  const [availableSubjects, setAvailableSubjects] = useState([
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Chemistry" },
    { id: 4, name: "Biology" },
    { id: 5, name: "English" },
    { id: 6, name: "Computer Science" },
  ])

  const [availableQualifications, setAvailableQualifications] = useState([
    { id: 1, name: "Bachelor's Degree" },
    { id: 2, name: "Master's Degree" },
    { id: 3, name: "PhD" },
    { id: 4, name: "Teaching Certificate" },
  ])

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ]

  const expertiseLevelOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" },
    { value: "master", label: "Master" },
  ]

  const employmentTypeOptions = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
  ]

  const teachingMethodOptions = [
    "video_lectures",
    "live_qna",
    "interactive_sessions",
    "assignments",
    "group_discussions",
    "one_on_one",
    "workshops",
    "practical_demos",
  ]

  const courseCategoryOptions = [
    "programming",
    "science",
    "mathematics",
    "languages",
    "business",
    "arts",
    "music",
    "sports",
    "technology",
    "design",
  ]

  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Arabic",
    "Hindi",
    "Portuguese",
    "Russian",
    "Italian",
    "Korean",
  ]

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const timezoneOptions = [
    { value: "GMT-12:00", label: "GMT-12:00 (Baker Island)" },
    { value: "GMT-11:00", label: "GMT-11:00 (American Samoa)" },
    { value: "GMT-10:00", label: "GMT-10:00 (Hawaii)" },
    { value: "GMT-09:00", label: "GMT-09:00 (Alaska)" },
    { value: "GMT-08:00", label: "GMT-08:00 (Pacific Time)" },
    { value: "GMT-07:00", label: "GMT-07:00 (Mountain Time)" },
    { value: "GMT-06:00", label: "GMT-06:00 (Central Time)" },
    { value: "GMT-05:00", label: "GMT-05:00 (Eastern Time)" },
    { value: "GMT-04:00", label: "GMT-04:00 (Atlantic Time)" },
    { value: "GMT-03:00", label: "GMT-03:00 (Brazil)" },
    { value: "GMT-02:00", label: "GMT-02:00 (Mid-Atlantic)" },
    { value: "GMT-01:00", label: "GMT-01:00 (Azores)" },
    { value: "GMT+00:00", label: "GMT+00:00 (London, Dublin)" },
    { value: "GMT+01:00", label: "GMT+01:00 (Paris, Berlin)" },
    { value: "GMT+02:00", label: "GMT+02:00 (Cairo, Athens)" },
    { value: "GMT+03:00", label: "GMT+03:00 (Moscow, Nairobi)" },
    { value: "GMT+04:00", label: "GMT+04:00 (Dubai, Baku)" },
    { value: "GMT+05:00", label: "GMT+05:00 (Karachi, Tashkent)" },
    { value: "GMT+05:30", label: "GMT+05:30 (India, Sri Lanka)" },
    { value: "GMT+06:00", label: "GMT+06:00 (Dhaka, Almaty)" },
    { value: "GMT+07:00", label: "GMT+07:00 (Bangkok, Jakarta)" },
    { value: "GMT+08:00", label: "GMT+08:00 (Beijing, Singapore)" },
    { value: "GMT+09:00", label: "GMT+09:00 (Tokyo, Seoul)" },
    { value: "GMT+10:00", label: "GMT+10:00 (Sydney, Melbourne)" },
    { value: "GMT+11:00", label: "GMT+11:00 (Solomon Islands)" },
    { value: "GMT+12:00", label: "GMT+12:00 (New Zealand)" },
  ]

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      // Save progress to localStorage
      localStorage.setItem("tutorFormProgress", JSON.stringify({ step: currentStep + 1, formData }))
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepNumber) => {
    if (stepNumber >= 1 && stepNumber <= currentStep) {
      setCurrentStep(stepNumber)
    }
  }

  useEffect(() => {
    const savedProgress = localStorage.getItem("tutorFormProgress")
    if (savedProgress) {
      try {
        const { step, formData: savedFormData } = JSON.parse(savedProgress)
        if (step && savedFormData) {
          setCurrentStep(step)
          setFormData((prev) => ({ ...prev, ...savedFormData }))
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  const validateCNIC = (cnic) => {
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/
    return cnicPattern.test(cnic)
  }

  // validate on blur instead of every keystroke
  const handleCNICBlur = (e) => {
    const { value } = e.target
    if (value && !validateCNIC(value)) {
      toast.error("CNIC format should be xxxxx-xxxxxxx-x")
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Array.isArray(value) ? value : [value],
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Auto-save progress
    localStorage.setItem(
      "tutorFormProgress",
      JSON.stringify({ step: currentStep, formData: { ...formData, [name]: value } }),
    )
  }

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }))
      setFileNames((prev) => ({ ...prev, [fieldName]: file.name }))
    }
  }

  const handleArrayFieldToggle = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]:
        prev[fieldName] && Array.isArray(prev[fieldName])
          ? prev[fieldName].includes(value)
            ? prev[fieldName].filter((item) => item !== value)
            : [...prev[fieldName], value]
          : [value],
    }))
  }

  const handleScheduleChange = (day, timeSlots) => {
    setFormData((prev) => ({
      ...prev,
      availability_schedule: {
        ...prev.availability_schedule,
        [day]: timeSlots
          .split(",")
          .map((slot) => slot.trim())
          .filter((slot) => slot),
      },
    }))
  }

  // more robust dynamic handlers (explicit field name)
  const handleDynamicArrayChange = (fieldName, entries, setEntries, index, field, value) => {
    const newEntries = [...entries]
    newEntries[index] = { ...newEntries[index], [field]: value }
    setEntries(newEntries)

    setFormData((prev) => ({ ...prev, [fieldName]: newEntries }))
  }

  const addDynamicEntry = (fieldName, entries, setEntries, template) => {
    const newEntries = [...entries, template]
    setEntries(newEntries)
    setFormData((prev) => ({ ...prev, [fieldName]: newEntries }))
  }

  const removeDynamicEntry = (fieldName, entries, setEntries, index) => {
    const newEntries = entries.filter((_, i) => i !== index)
    setEntries(newEntries)
    setFormData((prev) => ({ ...prev, [fieldName]: newEntries }))
  }

  const handleSubjectToggle = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects:
        prev.subjects && Array.isArray(prev.subjects)
          ? prev.subjects.includes(subjectId)
            ? prev.subjects.filter((id) => id !== subjectId)
            : [...prev.subjects, subjectId]
          : [subjectId],
    }))
  }

  const handleQualificationToggle = (qualificationId) => {
    setFormData((prev) => ({
      ...prev,
      qualifications:
        prev.qualifications && Array.isArray(prev.qualifications)
          ? prev.qualifications.includes(qualificationId)
            ? prev.qualifications.filter((id) => id !== qualificationId)
            : [...prev.qualifications, qualificationId]
          : [qualificationId],
    }))
  }

  const appendIf = (form, key, value) => {
    if (value === null || value === undefined) return
    // Files
    if (typeof File !== "undefined" && value instanceof File) {
      form.append(key, value)
      return
    }
    // FileList
    if (typeof FileList !== "undefined" && value instanceof FileList) {
      Array.from(value).forEach((f) => form.append(key, f))
      return
    }
    // Arrays
    if (Array.isArray(value)) {
      if (value.length) form.append(key, JSON.stringify(value))
      return
    }
    // Objects -> stringify if not empty
    if (typeof value === "object") {
      if (Object.keys(value).length) form.append(key, JSON.stringify(value))
      return
    }
    // booleans & primitives
    form.append(key, String(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axios.post("/api/tutors/register/", formData)
      toast.success("Registration completed successfully!")
      router.push("/success?type=tutor")
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    const currentStepData = steps[currentStep - 1]

    switch (currentStep) {
      case 1: // Personal Details (combines old steps 1-2)
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#313D6A] flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#313D6A] mb-2">Personal Information</h2>
              <p className="text-gray-600 max-w-md mx-auto">Tell us about yourself and where you're located</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="full_name" className="text-sm font-medium text-[#313D6A] mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 border-2 border-gray-200 focus:border-[#313D6A] focus:ring-0 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-[#313D6A] mb-2 block">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      className="h-12 border-2 border-gray-200 focus:border-[#313D6A] focus:ring-0 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-[#313D6A] mb-2 block">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="h-12 border-2 border-gray-200 focus:border-[#313D6A] focus:ring-0 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="date_of_birth" className="text-sm font-medium text-[#313D6A] mb-2 block">
                      Date of Birth *
                    </Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-[#313D6A] focus:ring-0 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Gender *</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Male", "Female", "Other"].map((gender) => (
                        <label
                          key={gender}
                          className={`
                            flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${formData.gender === gender.toLowerCase()
                              ? "border-[#313D6A] bg-[#313D6A]/5 text-[#313D6A]"
                              : "border-gray-200 hover:border-gray-300"
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={gender.toLowerCase()}
                            checked={formData.gender === gender.toLowerCase()}
                            onChange={(e) => handleInputChange("gender", e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium">{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-[#313D6A] mb-2 block">
                      Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your full address"
                      className="min-h-[80px] border-2 border-gray-200 focus:border-[#313D6A] focus:ring-0 transition-colors resize-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2: // Professional Background (combines old steps 3-4)
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#313D6A] to-[#F5BB07] flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#313D6A] mb-2">Your Professional Journey</h2>
              <p className="text-gray-600">Share your expertise and experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="headline" className="text-sm font-medium text-[#313D6A]">
                    Professional Headline *
                  </Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => handleInputChange("headline", e.target.value)}
                    placeholder="e.g., Expert Math Tutor with 5+ Years Experience"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expertise_level" className="text-sm font-medium text-[#313D6A]">
                    Expertise Level
                  </Label>
                  <Select
                    value={formData.expertise_level}
                    onValueChange={(value) => handleInputChange("expertise_level", value)}
                  >
                    <SelectTrigger className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="years_of_experience" className="text-sm font-medium text-[#313D6A]">
                    Years of Experience
                  </Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    value={formData.years_of_experience}
                    onChange={(e) => handleInputChange("years_of_experience", Number.parseInt(e.target.value) || 0)}
                    placeholder="5"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>

                <div>
                  <Label htmlFor="employment_type" className="text-sm font-medium text-[#313D6A]">
                    Employment Type
                  </Label>
                  <Select
                    value={formData.employment_type}
                    onValueChange={(value) => handleInputChange("employment_type", value)}
                  >
                    <SelectTrigger className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time">Part Time</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="department" className="text-sm font-medium text-[#313D6A]">
                    Department/Field
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    placeholder="e.g., Mathematics, Computer Science"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>

                <div>
                  <Label htmlFor="hourly_rate" className="text-sm font-medium text-[#313D6A]">
                    Hourly Rate ($)
                  </Label>
                  <Input
                    id="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={(e) => handleInputChange("hourly_rate", e.target.value)}
                    placeholder="50"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>

                <div>
                  <Label htmlFor="organization_name" className="text-sm font-medium text-[#313D6A]">
                    Current Organization
                  </Label>
                  <Input
                    id="organization_name"
                    value={formData.organization_name}
                    onChange={(e) => handleInputChange("organization_name", e.target.value)}
                    placeholder="University/Company name"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>

                <div>
                  <Label htmlFor="designation" className="text-sm font-medium text-[#313D6A]">
                    Current Designation
                  </Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    placeholder="Professor, Senior Developer, etc."
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="expertise_areas" className="text-sm font-medium text-[#313D6A]">
                Areas of Expertise
              </Label>
              <Textarea
                id="expertise_areas"
                value={
                  Array.isArray(formData.expertise_areas)
                    ? formData.expertise_areas.join(", ")
                    : formData.expertise_areas
                }
                onChange={(e) =>
                  handleArrayChange(
                    "expertise_areas",
                    e.target.value.split(",").map((item) => item.trim()),
                  )
                }
                placeholder="Mathematics, Physics, Programming, Data Science (separate with commas)"
                className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                rows={3}
              />
            </div>
          </div>
        )

      case 3: // Qualifications (old step 5 + education)
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#313D6A] to-[#F5BB07] flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#313D6A] mb-2">Your Qualifications</h2>
              <p className="text-gray-600">Education, certifications, and achievements</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Education Background</Label>
                <Textarea
                  value={Array.isArray(formData.education) ? formData.education.join("\n") : ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      e.target.value.split("\n").filter((item) => item.trim()),
                    )
                  }
                  placeholder="PhD in Mathematics - Harvard University (2018)&#10;MS in Computer Science - MIT (2015)&#10;BS in Mathematics - Stanford University (2013)"
                  className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">Enter each degree on a new line</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Certifications</Label>
                <Textarea
                  value={Array.isArray(formData.certifications) ? formData.certifications.join("\n") : ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "certifications",
                      e.target.value.split("\n").filter((item) => item.trim()),
                    )
                  }
                  placeholder="AWS Certified Solutions Architect (2023)&#10;Google Cloud Professional (2022)&#10;Teaching Excellence Certificate (2021)"
                  className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">Enter each certification on a new line</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Awards & Recognition (Optional)</Label>
                <Textarea
                  value={Array.isArray(formData.awards) ? formData.awards.join("\n") : ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "awards",
                      e.target.value.split("\n").filter((item) => item.trim()),
                    )
                  }
                  placeholder="Best Teacher Award 2023&#10;Research Excellence Award 2022&#10;Dean's List 2020"
                  className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Enter each award on a new line</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Publications (Optional)</Label>
                <Textarea
                  value={Array.isArray(formData.publications) ? formData.publications.join("\n") : ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "publications",
                      e.target.value.split("\n").filter((item) => item.trim()),
                    )
                  }
                  placeholder="Advanced Machine Learning Techniques - IEEE 2023&#10;Teaching Methods in STEM - Education Journal 2022"
                  className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Enter each publication on a new line</p>
              </div>
            </div>
          </div>
        )

      case 4: // Teaching Preferences (old step 6)
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#313D6A] to-[#F5BB07] flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#313D6A] mb-2">Teaching Style & Preferences</h2>
              <p className="text-gray-600">How do you like to teach and connect with students?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="teaching_style" className="text-sm font-medium text-[#313D6A]">
                    Teaching Style
                  </Label>
                  <Textarea
                    id="teaching_style"
                    value={formData.teaching_style}
                    onChange={(e) => handleInputChange("teaching_style", e.target.value)}
                    placeholder="Describe your teaching approach, methodology, and what makes your teaching unique..."
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Languages You Speak</Label>
                  <Input
                    value={Array.isArray(formData.languages_spoken) ? formData.languages_spoken.join(", ") : ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "languages_spoken",
                        e.target.value.split(",").map((item) => item.trim()),
                      )
                    }
                    placeholder="English, Spanish, French (separate with commas)"
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Subjects You Can Teach</Label>
                  <Textarea
                    value={Array.isArray(formData.subjects) ? formData.subjects.join(", ") : ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "subjects",
                        e.target.value.split(",").map((item) => item.trim()),
                      )
                    }
                    placeholder="Mathematics, Physics, Programming, Data Science (separate with commas)"
                    className="border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Preferred Teaching Methods</Label>
                  <div className="space-y-2">
                    {[
                      "Interactive Sessions",
                      "Visual Learning",
                      "Hands-on Practice",
                      "Problem Solving",
                      "Group Discussions",
                      "One-on-One Mentoring",
                    ].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method}
                          checked={formData.preferred_teaching_methods.includes(method)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleArrayChange("preferred_teaching_methods", [
                                ...formData.preferred_teaching_methods,
                                method,
                              ])
                            } else {
                              handleArrayChange(
                                "preferred_teaching_methods",
                                formData.preferred_teaching_methods.filter((m) => m !== method),
                              )
                            }
                          }}
                        />
                        <Label htmlFor={method} className="text-sm">
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Course Categories</Label>
                  <div className="space-y-2">
                    {["STEM", "Languages", "Arts", "Business", "Technology", "Test Prep"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={formData.course_categories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleArrayChange("course_categories", [...formData.course_categories, category])
                            } else {
                              handleArrayChange(
                                "course_categories",
                                formData.course_categories.filter((c) => c !== category),
                              )
                            }
                          }}
                        />
                        <Label htmlFor={category} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-[#FFFCE0] rounded-lg border border-[#F5BB07]/30">
                  <Checkbox
                    id="can_teach_online"
                    checked={formData.can_teach_online}
                    onCheckedChange={(checked) => handleInputChange("can_teach_online", checked)}
                  />
                  <Label htmlFor="can_teach_online" className="text-sm font-medium text-[#313D6A]">
                    Available for Online Teaching
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )

      case 5: // Availability & Links (combines old steps 7, 8)
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#313D6A] to-[#F5BB07] flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#313D6A] mb-2">Schedule & Social Presence</h2>
              <p className="text-gray-600">When are you available and where can students find you?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="timings_required" className="text-sm font-medium text-[#313D6A]">
                    Preferred Teaching Hours
                  </Label>
                  <Input
                    id="timings_required"
                    value={formData.timings_required}
                    onChange={(e) => handleInputChange("timings_required", e.target.value)}
                    placeholder="e.g., Weekdays 9 AM - 5 PM, Weekends flexible"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin_profile" className="text-sm font-medium text-[#313D6A]">
                    LinkedIn Profile
                  </Label>
                  <Input
                    id="linkedin_profile"
                    value={formData.linkedin_profile}
                    onChange={(e) => handleInputChange("linkedin_profile", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>

                <div>
                  <Label htmlFor="github_profile" className="text-sm font-medium text-[#313D6A]">
                    GitHub Profile (Optional)
                  </Label>
                  <Input
                    id="github_profile"
                    value={formData.github_profile}
                    onChange={(e) => handleInputChange("github_profile", e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="personal_website" className="text-sm font-medium text-[#313D6A]">
                    Personal Website (Optional)
                  </Label>
                  <Input
                    id="personal_website"
                    value={formData.personal_website}
                    onChange={(e) => handleInputChange("personal_website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>

                <div>
                  <Label htmlFor="youtube_channel" className="text-sm font-medium text-[#313D6A]">
                    YouTube Channel (Optional)
                  </Label>
                  <Input
                    id="youtube_channel"
                    value={formData.youtube_channel}
                    onChange={(e) => handleInputChange("youtube_channel", e.target.value)}
                    placeholder="https://youtube.com/c/yourchannel"
                    className="mt-1 border-2 border-gray-200 focus:border-[#F5BB07] transition-colors"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Notification Preferences</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email_notifications"
                        checked={formData.notification_preferences.email}
                        onCheckedChange={(checked) =>
                          handleInputChange("notification_preferences", {
                            ...formData.notification_preferences,
                            email: checked,
                          })
                        }
                      />
                      <Label htmlFor="email_notifications" className="text-sm">
                        Email notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sms_notifications"
                        checked={formData.notification_preferences.sms}
                        onCheckedChange={(checked) =>
                          handleInputChange("notification_preferences", {
                            ...formData.notification_preferences,
                            sms: checked,
                          })
                        }
                      />
                      <Label htmlFor="sms_notifications" className="text-sm">
                        SMS notifications
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 6: // Final Setup (combines old steps 9, 10)
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#313D6A] to-[#F5BB07] flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#313D6A] mb-2">Almost Done!</h2>
              <p className="text-gray-600">Upload your documents and set final preferences</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Resume/CV *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#313D6A] transition-colors cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-[#313D6A] mb-3 block">
                      Degree Certificates (Optional)
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#313D6A] transition-colors cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">Upload your certificates</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-[#313D6A] mb-3 block">ID Proof *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#313D6A] transition-colors cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">Upload government ID</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-[#313D6A] mb-3 block">Profile Picture (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#313D6A] transition-colors cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">Upload your photo</p>
                      <p className="text-xs text-gray-500">JPG, PNG (Max 2MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#F5BB07] flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#313D6A] mb-2">Ready to inspire students?</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      You're about to join our community of amazing tutors! Your profile will be reviewed and activated
                      within 24 hours.
                    </p>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="terms_agreement" required className="mt-0.5" />
                      <Label htmlFor="terms_agreement" className="text-sm text-gray-600 leading-relaxed">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
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

  if (loading) {
    return <Loader text="Loading Profile..." />
  }

  return (
    <div className="min-h-screen relative bg-primary/10 overflow-hidden rounded-lg py-8 px-4 sm:px-6 lg:px-8">
      {/* Decorative background circles */}
      <div className="absolute z-0 inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 border-[10px] border-[#313D6A]/60 rounded-full " />
        <div className="absolute top-20 right-9 w-24 h-24 rounded-full opacity-60 bg-[#313D6A]" />
        <div className="absolute bottom-32 left-16 w-40 h-40 rounded-full opacity-25 bg-[#313D6A]" />
        <div className="absolute bottom-20 right-32 w-28 h-28 border-[10px] border-[#313D6A]/60 rounded-full opacity-60" />
        <div className="absolute top-1/2 left-0 w-36 h-36 rounded-full opacity-50 -translate-x-1/2 bg-[#313D6A]" />
        <div className="absolute top-1/3 right-0 w-32 h-32 border-[10px] border-[#313D6A]/60 rounded-full opacity-60 translate-x-1/2" />
      </div>
      <div className="max-w-5xl mx-auto ">


        <Card className="shadow-lg  relative z-10 pt-0 overflow-hidden border-0 bg-white">
          <CardHeader className="bg-[#313D6A] text-white">
            <div className="text-center py-6">
              <CardTitle className="text-3xl font-bold mb-2">Tutor Registration</CardTitle>
              <p className="text-blue-100 text-lg">Join our community of amazing educators</p>
              <div className="flex items-center justify-center mt-4 space-x-2 text-blue-200">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Takes about 10 minutes</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <ProgressIndicator currentStep={currentStep} totalSteps={steps.length} onStepClick={goToStep} />

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-lg p-8 border border-gray-200">{renderStepContent()}</div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto order-2 sm:order-1 h-12 px-8 border-2 border-[#313D6A] text-[#313D6A] hover:bg-[#313D6A] hover:text-white transition-all duration-300 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="text-sm text-gray-500 order-1 sm:order-2 font-medium bg-gray-100 px-4 py-2 rounded-full">
                  Step {currentStep} of {steps.length}
                </div>

                <Button
                  type={currentStep === steps.length ? "submit" : "button"}
                  onClick={currentStep === steps.length ? undefined : nextStep}
                  disabled={isLoading}
                  className="w-full sm:w-auto order-3 h-12 px-8 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] font-semibold transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : currentStep === steps.length ? (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Registration
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
