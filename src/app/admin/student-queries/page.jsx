"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Check, X, Eye, User, Mail, MapPin, Calendar, Clock, BookOpen, Users, GraduationCap, MessageCircle, RefreshCcw } from "lucide-react"

export default function StudentQueries() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? ""
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [editingQuery, setEditingQuery] = useState(null)
  const [adminNotesInput, setAdminNotesInput] = useState("")
  const [patching, setPatching] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    fetchQueries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showToast = (message, type = "success", ttl = 3000) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), ttl)
  }

  const fetchQueries = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get(`${API_BASE}/api/admin-portal/student-queries/`, { headers: authHeaders })
      setQueries(res?.data?.data ?? [])
    } catch (err) {
      console.error("Error fetching queries:", err)
      setError("Failed to load queries.")
    } finally {
      setLoading(false)
    }
  }

  // Function to sanitize and format phone number for WhatsApp
  const formatPhoneNumberForWhatsApp = (phoneNumber) => {
    if (!phoneNumber) return null;
    
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if number starts with country code
    if (cleaned.startsWith('0')) {
      // Replace leading 0 with country code for Pakistan (92)
      cleaned = '92' + cleaned.substring(1);
    } else if (!cleaned.startsWith('92') && cleaned.length === 10) {
      // Add country code if it's a 10-digit number without country code
      cleaned = '92' + cleaned;
    }
    
    return cleaned;
  };

  // Function to open WhatsApp chat
  const openWhatsApp = (query) => {
    if (!query.contact_no) {
      showToast("No phone number available for this student", "error");
      return;
    }
    
    const formattedNumber = formatPhoneNumberForWhatsApp(query.contact_no);
    
    if (!formattedNumber) {
      showToast("Invalid phone number format", "error");
      return;
    }
    
    // Create a default message
    const studentName = query.name || "Student";
    const defaultMessage = `Hello ${studentName}, I'm contacting you from the academy regarding your query.`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(defaultMessage);
    
    // Open WhatsApp
    window.open(`https://wa.me/${formattedNumber}?text=${encodedMessage}`, '_blank');
  };

  const updateLocalQuery = (id, patch) => setQueries((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)))

  const patchQuery = async (id, payload, optimisticPatch = null) => {
    if (!token) {
      showToast("No access token found. Please login.", "error")
      return
    }
    try {
      if (optimisticPatch) updateLocalQuery(id, optimisticPatch)
      const res = await axios.patch(`${API_BASE}/api/admin-portal/student-queries/${id}/`, payload, {
        headers: authHeaders,
      })
      const returned = res?.data?.data ?? res?.data
      if (returned && typeof returned === "object") updateLocalQuery(id, returned)
      else fetchQueries()
      return res
    } catch (err) {
      console.error("Error patching query:", err)
      showToast("Failed to update.", "error")
      fetchQueries()
      throw err
    }
  }

  const toggleProcessed = (query) => {
    const newVal = !query.is_processed
    patchQuery(query.id, { is_processed: newVal }, { is_processed: newVal })
      .then(() => showToast(newVal ? "Marked processed" : "Marked unprocessed"))
      .catch(() => {})
  }

  const markRegistered = (query) => {
    if (query.is_registered) return
    patchQuery(query.id, { is_registered: true }, { is_registered: true })
      .then(() => showToast("Marked as registered"))
      .catch(() => {})
  }

  const openEditNotes = (query) => {
    setEditingQuery(query)
    setAdminNotesInput(query?.admin_notes ?? "")
  }

  const closeEditNotes = () => {
    setEditingQuery(null)
    setAdminNotesInput("")
  }

  const saveAdminNotes = async () => {
    if (!editingQuery) return
    setPatching(true)
    try {
      await patchQuery(editingQuery.id, { admin_notes: adminNotesInput }, { admin_notes: adminNotesInput })
      showToast("Notes saved.")
      closeEditNotes()
    } catch (err) {
      // handled in patchQuery
    } finally {
      setPatching(false)
    }
  }

  const formatDate = (iso) => {
    try {
      const d = new Date(iso)
      return d.toLocaleString("en-PK", { timeZone: "Asia/Karachi" })
    } catch {
      return iso
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#313D6A] to-[#4A5A8A] rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f172a] mb-2">Student Query Management</h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Manage and track student inquiries with our dashboard</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-white/50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#F5BB07]" />
                <span className="text-sm font-medium text-gray-700">Total Queries: {queries.length}</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-white/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F5BB07]" />
                <span className="text-sm font-medium text-gray-700">Pending: {queries.filter((q) => !q.is_processed).length}</span>
              </div>
            </div>
          </div>

          <div className="ml-auto">
            <Button
              onClick={fetchQueries}
              className="bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] hover:from-[#2b3558] hover:to-[#3f4f78] text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-4 py-2"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-[#313D6A] rounded-full mx-auto mb-3"></div>
              <p className="text-gray-600 text-center">Loading queries…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {!loading && queries.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 max-w-md mx-auto">
              <div className="w-14 h-14 bg-gradient-to-br from-[#313D6A] to-[#4A5A8A] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#313D6A] mb-2">No Queries Found</h3>
              <p className="text-sm text-gray-600">There are no student queries to display at the moment.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {queries.map((q) => (
            <Card
              key={q?.id}
              className="bg-white/95 backdrop-blur-sm border pt-0 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group hover:-translate-y-1"
            >
              <CardHeader className="bg-gradient-to-r from-[#F5BB07]/10 to-[#F5BB07]/5 border-b border-[#F5BB07]/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-3 text-base sm:text-lg font-semibold text-[#0f172a] truncate">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#313D6A] to-[#4A5A8A] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate">{q?.name ?? "—"}</div>
                        <div className="mt-1">
                          <Badge className="mt-1 bg-[#F5BB07] text-white border-0 text-xs px-2 py-1">{q?.current_class ?? "—"}</Badge>
                        </div>
                      </div>
                    </CardTitle>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 truncate">
                      <Mail className="w-4 h-4 text-[#313D6A] flex-shrink-0" />
                      <span className="truncate">{q?.email}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    {q?.is_registered ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 text-xs shadow-sm px-2 py-1">
                        <Check className="w-3 h-3" /> Registered
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-gray-300 text-gray-600 flex items-center gap-1 text-xs px-2 py-1">
                        <X className="w-3 h-3" /> Not Registered
                      </Badge>
                    )}

                    {q?.is_processed ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1 text-xs px-2 py-1">
                        <Check className="w-3 h-3" /> Processed
                      </Badge>
                    ) : (
                      <Badge className="bg-[#F5BB07]/10 text-[#F5BB07] border-[#F5BB07]/20 flex items-center gap-1 text-xs px-2 py-1 animate-pulse">
                        <Clock className="w-3 h-3" /> New
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="bg-[#F5BB07]/10 rounded-xl p-3 border border-[#F5BB07]/20">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-[#F5BB07] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm mb-1">Subjects</p>
                        <p className="text-gray-700 text-sm line-clamp-3">{q?.subjects ?? "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-[#313D6A]" />
                      <span className="truncate">{q?.area ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-[#313D6A]" />
                      <span>{formatDate(q?.created_at)}</span>
                    </div>
                  </div>

                  {q?.special_requirements && (
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-xs font-medium text-gray-700 mb-1">Special Requirements</p>
                      <p className="text-sm text-gray-600 line-clamp-3">{q.special_requirements}</p>
                    </div>
                  )}

                  {q?.admin_notes && (
                    <div className="bg-[#E6F6F0] rounded-xl p-3 border border-emerald-100">
                      <p className="text-xs font-medium text-emerald-700 mb-1">Admin Notes</p>
                      <p className="text-sm text-emerald-700 line-clamp-3">{q.admin_notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                    className="border-[#313D6A]/20 text-[#313D6A] hover:bg-[#313D6A]/5 rounded-lg"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {expandedId === q.id ? "Hide" : "Details"}
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => openWhatsApp(q)}
                    className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-lg shadow-sm"
                    title="Contact via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => toggleProcessed(q)}
                    className={
                      q?.is_processed
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg"
                        : "bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] text-white rounded-lg shadow-sm"
                    }
                  >
                    {q?.is_processed ? (
                      <>
                        <X className="w-4 h-4 mr-1" /> Unmark
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" /> Process
                      </>
                    )}
                  </Button>

                  {!q?.is_registered && (
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!confirm(`Mark ${q?.name} as registered?`)) return
                        markRegistered(q)
                      }}
                      className="bg-gradient-to-r from-[#10B981] to-[#10A86A] text-white rounded-lg shadow-sm"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Register
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditNotes(q)}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Edit Notes
                  </Button>
                </div>

                {expandedId === q.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Contact Number</p>
                        <p className="text-sm text-gray-800">{q?.contact_no ?? "—"}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Linked User Email</p>
                        <p className="text-sm text-gray-800">{q?.linked_user_email ?? "—"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={!!editingQuery}
        onOpenChange={(open) => {
          if (!open) closeEditNotes()
        }}
      >
        <DialogContent className="bg-white/95 backdrop-blur-sm border-white/50 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#313D6A] to-[#4A5A8A] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              Edit Admin Notes
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Student Name</Label>
              <Input value={editingQuery?.name ?? ""} readOnly className="mt-1 bg-gray-50 border-gray-200 rounded-lg" />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Admin Notes</Label>
              <Textarea
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="Add admin notes here..."
                rows={6}
                className="mt-1 border-gray-200 rounded-lg focus:border-[#F5BB07]/40 focus:ring-[#F5BB07]/20"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={closeEditNotes}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={saveAdminNotes}
              disabled={patching}
              className="bg-gradient-to-r from-[#313D6A] to-[#4A5A8A] text-white rounded-lg shadow-sm"
            >
              {patching ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="fixed top-6 right-6 z-50">
        {toast.show && (
          <div
            role="status"
            className={`max-w-sm px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm border text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
              toast.type === "success" ? "bg-emerald-50/90 text-emerald-800 border-emerald-200" : "bg-red-50/90 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-600" />}
              {toast.message}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}