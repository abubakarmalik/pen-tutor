"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Upload,
  User,
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  CalendarIcon,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react"
import { toast } from "sonner"
import Loader from "@/components/shared/Loader"
import { useAuth } from "../auth/AuthContext"
import axios from "axios"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for qualifications and subjects - replace with actual API data
const QUALIFICATIONS = [
  { id: 1, name: "Matric" },
  { id: 2, name: "Intermediate" },
  { id: 3, name: "Bachelor's" },
  { id: 4, name: "Master's" },
  { id: 5, name: "PhD" },
]

const SUBJECTS = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Physics" },
  { id: 3, name: "Chemistry" },
  { id: 4, name: "Biology" },
  { id: 5, name: "English" },
  { id: 6, name: "Computer Science" },
]

export default function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    // Personal Information
    full_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    cnic: "",
    gender: "", // New field

    // Location
    country: "Pakistan",
    city: "",
    area: "",
    timezone: "",

    // Academic Information
    highest_qualification: "",
    education_level: "", // New field
    qualifications: [], // Array of IDs
    subjects: [], // Array of IDs
    institute: "",
    employment_status: "", // New field

    // Study Preferences
    preffered_method: "", // Note: double 'f' as requested
    days_to_study: "",
    timing_to_study: "",

    // File uploads
    profile_picture: null,
    cnic_or_form_b_picture: null,
    degree: null,
    certificates: [], // Change from {} to []
  })

  const [certificates, setCertificates] = useState([])
  const [newCertificateName, setNewCertificateName] = useState("")

  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState(null)
  const [fileNames, setFileNames] = useState({
    profile_picture: "",
    cnic_or_form_b_picture: "",
    degree: "",
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          toast.error("Authentication required.")
          return
        }

        const response = await axios.get(`${API_BASE}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 200) {
          const { data } = response.data
          setFormData({
            full_name: data.name || data.full_name || "",
            first_name: data.first_name || data.user?.first_name || "",
            last_name: data.last_name || data.user?.last_name || "",
            email: data.email || data.user?.email || "",
            phone: data.phone || "",
            date_of_birth: data.date_of_birth || "",
            cnic: data.cnic || "",
            gender: data.gender || data.user?.gender || "",
            country: data.country || data.user?.country || "Pakistan",
            city: data.city || data.user?.city || "",
            area: data.profile?.area || "",
            timezone: data.profile?.timezone || "",
            highest_qualification: data.profile?.highest_qualification || "",
            education_level: data.education_level || "",
            qualifications: data.profile?.qualifications || [],
            subjects: data.profile?.subjects || [],
            institute: data.institution || data.profile?.institute || "",
            employment_status: data.employment_status || "",
            preffered_method: data.profile?.preffered_method || "",
            days_to_study: data.profile?.days_to_study || "",
            timing_to_study: data.profile?.timing_to_study || "",
            profile_picture: null,
            cnic_or_form_b_picture: null,
            degree: null,
            certificates: [], // Always initialize as array
          })

          if (data.date_of_birth) {
            setDateOfBirth(new Date(data.date_of_birth))
          }

          // Initialize certificates array if data exists
          if (data.certificates) {
            let certArray = []
            if (Array.isArray(data.certificates)) {
              certArray = data.certificates.map((cert, index) => ({
                id: Date.now() + index,
                name: cert.name || `Certificate ${index + 1}`,
                file: null,
                uploaded_file_url: cert.file_url || null,
              }))
            }
            setCertificates(certArray)
          }
        } else {
          toast.error("Failed to load profile data.")
        }
      } catch (error) {
        toast.error("An error occurred while fetching your profile.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [user?.id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (name, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value),
    }))
  }

  const handleDateChange = (date) => {
    setDateOfBirth(date)
    setFormData((prev) => ({
      ...prev,
      date_of_birth: date ? format(date, "yyyy-MM-dd") : "",
    }))
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }))
      setFileNames((prev) => ({ ...prev, [fieldName]: file.name }))
    }
  }

  const handleAddCertificate = () => {
    if (newCertificateName.trim()) {
      const newCertificate = {
        id: Date.now(),
        name: newCertificateName.trim(),
        file: null,
        uploaded_file_url: null, // For storing the uploaded file URL
      }
      setCertificates([...certificates, newCertificate])
      setNewCertificateName("")
    }
  }

  const handleCertificateFileChange = (certificateId, file) => {
    setCertificates(certificates.map((cert) => (cert.id === certificateId ? { ...cert, file } : cert)))
  }

  const handleRemoveCertificate = (certificateId) => {
    setCertificates(certificates.filter((cert) => cert.id !== certificateId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("access_token")
      const data = new FormData()

      // Add all regular form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "certificates" && formData[key] !== null && formData[key] !== "") {
          if (Array.isArray(formData[key])) {
            // Handle arrays by appending each item
            formData[key].forEach((item) => {
              data.append(`${key}[]`, item)
            })
          } else {
            data.append(key, formData[key])
          }
        }
      })

      // Prepare certificates metadata and files
      const certificatesMetadata = []
      certificates.forEach((cert, index) => {
        // Add certificate file if exists
        if (cert.file) {
          data.append(`certificate_file_${index}`, cert.file)
        }

        // Add certificate metadata
        certificatesMetadata.push({
          name: cert.name,
          file_index: cert.file ? index : null,
          uploaded_at: new Date().toISOString(),
        })
      })

      // Add certificates metadata as JSON
      data.append("certificates", JSON.stringify(certificatesMetadata))

      // Submit the form
      const response = await fetch(`${API_BASE}/api/auth/profile/update/`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      })

      if (response.ok) {
        toast.success("Profile updated successfully!")
      } else {
        const errorData = await response.json()
        toast.error(`Failed to update profile: ${JSON.stringify(errorData)}`)
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <Loader text="Loading Profile..." />
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Student Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
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
                <Label htmlFor="first_name">First Name</Label>
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
                <Label htmlFor="last_name">Last Name</Label>
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
                  Email
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
                  Phone
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
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnic" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  CNIC
                </Label>
                <Input
                  id="cnic"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  placeholder="CNIC Number"
                  required
                />
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
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Area/Locality"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select onValueChange={(value) => handleSelectChange("timezone", value)} value={formData.timezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GMT-12:00">GMT-12:00</SelectItem>
                    <SelectItem value="GMT-11:00">GMT-11:00</SelectItem>
                    <SelectItem value="GMT-10:00">GMT-10:00</SelectItem>
                    <SelectItem value="GMT-09:00">GMT-09:00</SelectItem>
                    <SelectItem value="GMT-08:00">GMT-08:00</SelectItem>
                    <SelectItem value="GMT-07:00">GMT-07:00</SelectItem>
                    <SelectItem value="GMT-06:00">GMT-06:00</SelectItem>
                    <SelectItem value="GMT-05:00">GMT-05:00</SelectItem>
                    <SelectItem value="GMT-04:00">GMT-04:00</SelectItem>
                    <SelectItem value="GMT-03:00">GMT-03:00</SelectItem>
                    <SelectItem value="GMT-02:00">GMT-02:00</SelectItem>
                    <SelectItem value="GMT-01:00">GMT-01:00</SelectItem>
                    <SelectItem value="GMT+00:00">GMT+00:00</SelectItem>
                    <SelectItem value="GMT+01:00">GMT+01:00</SelectItem>
                    <SelectItem value="GMT+02:00">GMT+02:00</SelectItem>
                    <SelectItem value="GMT+03:00">GMT+03:00</SelectItem>
                    <SelectItem value="GMT+04:00">GMT+04:00</SelectItem>
                    <SelectItem value="GMT+05:00">GMT+05:00</SelectItem>
                    <SelectItem value="GMT+05:30">GMT+05:30</SelectItem>
                    <SelectItem value="GMT+06:00">GMT+06:00</SelectItem>
                    <SelectItem value="GMT+07:00">GMT+07:00</SelectItem>
                    <SelectItem value="GMT+08:00">GMT+08:00</SelectItem>
                    <SelectItem value="GMT+09:00">GMT+09:00</SelectItem>
                    <SelectItem value="GMT+10:00">GMT+10:00</SelectItem>
                    <SelectItem value="GMT+11:00">GMT+11:00</SelectItem>
                    <SelectItem value="GMT+12:00">GMT+12:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="highest_qualification">Highest Qualification</Label>
                <Input
                  id="highest_qualification"
                  name="highest_qualification"
                  value={formData.highest_qualification}
                  onChange={handleInputChange}
                  placeholder="Highest Qualification"
                />
              </div>
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
                <Label htmlFor="institute">Institute/University</Label>
                <Input
                  id="institute"
                  name="institute"
                  value={formData.institute}
                  onChange={handleInputChange}
                  placeholder="Institute/University"
                />
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Qualifications</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {QUALIFICATIONS.map((qual) => (
                    <div key={qual.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`qual-${qual.id}`}
                        checked={formData.qualifications.includes(qual.id)}
                        onCheckedChange={(checked) => handleArrayChange("qualifications", qual.id, checked)}
                      />
                      <Label htmlFor={`qual-${qual.id}`} className="text-sm font-normal">
                        {qual.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Subjects</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {SUBJECTS.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subject-${subject.id}`}
                        checked={formData.subjects.includes(subject.id)}
                        onCheckedChange={(checked) => handleArrayChange("subjects", subject.id, checked)}
                      />
                      <Label htmlFor={`subject-${subject.id}`} className="text-sm font-normal">
                        {subject.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Study Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preffered_method">Preferred Method</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("preffered_method", value)}
                  value={formData.preffered_method}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="days_to_study">Days to Study</Label>
                <Input
                  id="days_to_study"
                  name="days_to_study"
                  value={formData.days_to_study}
                  onChange={handleInputChange}
                  placeholder="e.g., Monday, Wednesday, Friday"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timing_to_study">Timing to Study</Label>
                <Input
                  id="timing_to_study"
                  name="timing_to_study"
                  value={formData.timing_to_study}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 11:00 AM"
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Document Uploads
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile Picture */}
              <div className="space-y-2">
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
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

          {/* Certificates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Certificates
            </h3>

            {/* Add New Certificate */}
            <div className="flex gap-2">
              <Input
                value={newCertificateName}
                onChange={(e) => setNewCertificateName(e.target.value)}
                placeholder="Certificate name (e.g., 'JavaScript Certification')"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddCertificate} variant="outline">
                Add Certificate
              </Button>
            </div>

            {/* Certificate List */}
            {certificates.length > 0 && (
              <div className="space-y-3">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{certificate.name}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveCertificate(certificate.id)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
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

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader text="Saving..." /> : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
