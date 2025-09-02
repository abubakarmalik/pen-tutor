"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, X, Users, FileText, Calendar, Eye } from "lucide-react"
import Link from "next/link"

export default function StudentJobsPage() {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

    const [jobs, setJobs] = useState([])
    const [loadingJobs, setLoadingJobs] = useState(false)
    const [error, setError] = useState(null)
    const [applicationsMap, setApplicationsMap] = useState({})
    const [openJobId, setOpenJobId] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedApplication, setSelectedApplication] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [toast, setToast] = useState({ show: false, message: "", type: "success" })

    useEffect(() => {
        fetchJobs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const showToast = (message, type = "success", ttl = 3000) => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast((t) => ({ ...t, show: false })), ttl)
    }

    async function fetchJobs() {
        setLoadingJobs(true)
        setError(null)
        try {
            const res = await axios.get(`${API_BASE}/api/job-board/dashboard/student/`, { headers: authHeaders })
            setJobs(res?.data?.jobs?.results ?? [])
        } catch (err) {
            console.error(err)
            setError("Failed to load your jobs")
        } finally {
            setLoadingJobs(false)
        }
    }

    async function fetchApplications(jobId) {
        setApplicationsMap((prev) => ({ ...prev, [jobId]: { ...(prev[jobId] || {}), loading: true } }))
        try {
            const res = await axios.get(`${API_BASE}/api/job-board/jobs/${jobId}/applications/`, { headers: authHeaders })
            setApplicationsMap((prev) => ({ ...prev, [jobId]: { loading: false, results: res?.data?.data?.results ?? [] } }))
        } catch (err) {
            console.error(err)
            setApplicationsMap((prev) => ({ ...prev, [jobId]: { loading: false, results: [] } }))
            showToast("Failed to load applications", "error")
        }
    }

    function openApplicants(jobId) {
        setOpenJobId(jobId)
        if (!applicationsMap[jobId]) fetchApplications(jobId)
    }

    async function patchApplicationStatus(appId, status) {
        if (!token) return showToast("Login required", "error")
        setActionLoading(true)
        try {
            await axios.patch(`${API_BASE}/api/job-board/applications/${appId}/`, { status }, { headers: authHeaders })

            setApplicationsMap((prev) => {
                const newMap = { ...prev }
                for (const jobId in newMap) {
                    if (!newMap[jobId]?.results) continue
                    newMap[jobId] = {
                        ...newMap[jobId],
                        results: newMap[jobId].results.map((a) => (a.id === appId ? { ...a, status } : a)),
                    }
                }
                return newMap
            })

            showToast(status === "accepted" ? "Teacher accepted" : "Application updated")

            if (status === "accepted") {
                let jobIdToPatch = null
                for (const jid in applicationsMap) {
                    const found = (applicationsMap[jid]?.results || []).find((a) => a.id === appId)
                    if (found) jobIdToPatch = jid
                }
                if (!jobIdToPatch && selectedApplication?.job_post?.id) jobIdToPatch = selectedApplication.job_post.id

                if (jobIdToPatch) {
                    try {
                        await axios.patch(`${API_BASE}/api/job-board/jobs/${jobIdToPatch}/`, { status: "accepted" }, { headers: authHeaders })
                        fetchJobs()
                    } catch (err) {
                        console.warn("Could not patch job status", err)
                    }
                }
            }
        } catch (err) {
            console.error(err)
            showToast("Failed to update application", "error")
        } finally {
            setActionLoading(false)
        }
    }

    function openConfirm(app) {
        setSelectedApplication(app)
        setConfirmOpen(true)
    }

    async function acceptSelected() {
        if (!selectedApplication) return
        await patchApplicationStatus(selectedApplication.id, "accepted")
        setConfirmOpen(false)
    }

    async function rejectApplication(appId) {
        if (!confirm("Reject this application?")) return
        await patchApplicationStatus(appId, "rejected")
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* background shapes — z-0 so they're visible behind content */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* left-top */}
                <div style={{ position: "absolute", left: "2.5%", top: "4%", width: "22vw", maxWidth: 220, height: "22vw", maxHeight: 220, borderRadius: "9999px", backgroundColor: "#313D6A", opacity: 0.28, transform: "translateZ(0)", }} />

                {/* left-bottom */}
                <div style={{ position: "absolute", left: "4%", bottom: "12%", width: "26vw", maxWidth: 260, height: "26vw", maxHeight: 260, borderRadius: "9999px", backgroundColor: "#313D6A", opacity: 0.20, transform: "translateZ(0)", }} />

                {/* right-top */}
                <div style={{ position: "absolute", right: "4%", top: "8%", width: "18vw", maxWidth: 180, height: "18vw", maxHeight: 180, borderRadius: "9999px", backgroundColor: "#313D6A", opacity: 0.22, transform: "translateZ(0)", }} />

                {/* right-middle (vertical accent) */}
                <div style={{ position: "absolute", right: "-6%", top: "48%", width: "24vw", maxWidth: 240, height: "24vw", maxHeight: 240, borderRadius: "9999px", backgroundColor: "#313D6A", opacity: 0.14, transform: "translateY(-50%) translateZ(0)", }} />

                {/* small accent near right-bottom */}
                <div style={{ position: "absolute", right: "10%", bottom: "8%", width: "12vw", maxWidth: 120, height: "12vw", maxHeight: 120, borderRadius: "9999px", backgroundColor: "#313D6A", opacity: 0.26, transform: "translateZ(0)", }} />
            </div>

            {/* content (z-10) */}
            <div className="relative z-10 container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 bg-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Job Posts</h1>
                        <p className="text-sm text-gray-600 mt-1">View applicants and select a teacher for each post.</p>
                    </div>

                    <div className="w-full sm:w-auto flex gap-3">
                        <Button onClick={fetchJobs} className="px-4 w-full sm:w-auto" style={{ backgroundColor: "#F5BB07", color: "#1a1a1a" }}>
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* White panel that contains the grid */}
                <div className="bg-white shadow-xl rounded-2xl p-6">
                    {/* Error / Loading */}
                    {loadingJobs && <div className="py-10 text-center">Loading your jobs…</div>}
                    {error && <div className="py-4 text-center text-destructive">{error}</div>}

                    {/* Jobs grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.length === 0 && !loadingJobs && (
                            <div className="col-span-full py-8 text-center text-gray-700">You don't have any job posts yet.</div>
                        )}

                        {jobs.map((job) => (
                            <Card key={job.id} className="overflow-hidden bg-white flex flex-col min-h-[170px]">
                                <CardHeader className="p-4 bg-white">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <CardTitle className="text-lg font-medium truncate">{job.title}</CardTitle>
                                            <div className="text-sm text-gray-600 mt-1 truncate">{job.subject_display} • {job.teaching_mode}</div>
                                            <div className="mt-2 text-sm text-gray-600">Budget: {job.budget_amount} ({job.budget_type})</div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-sm">{job.applications_count} applicants</div>
                                            <div className="text-xs text-gray-600 mt-1">Status: <Badge className="ml-2">{job.status}</Badge></div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-4 flex-1 flex flex-col bg-white">
                                    <p className="text-sm text-gray-700 break-words mb-3">{job.description}</p>

                                    <div className="mt-auto flex items-center gap-2 flex-wrap">
                                        <Button
                                            size="sm"
                                            onClick={() => openApplicants(job.id)}
                                            className="px-3 py-1"
                                            style={{ backgroundColor: "#F5BB07", color: "#1a1a1a" }}
                                        >
                                            View Applicants
                                        </Button>

                                        {job.selected_teacher ? (
                                            <div className="ml-auto text-sm text-gray-700">Selected: <strong>{job.selected_teacher.full_name}</strong></div>
                                        ) : (
                                            <div className="ml-auto text-sm text-gray-700">No teacher selected</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Applicants dialog */}
            <Dialog open={!!openJobId} onOpenChange={(open) => { if (!open) setOpenJobId(null) }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Applicants</DialogTitle>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-y-auto space-y-4 py-2">
                        {openJobId && applicationsMap[openJobId]?.loading && <div className="py-6 text-center">Loading applicants…</div>}

                        {openJobId && (applicationsMap[openJobId]?.results || []).length === 0 && !applicationsMap[openJobId]?.loading && (
                            <div className="py-6 text-center text-gray-600">No applicants yet.</div>
                        )}

                        {openJobId && (applicationsMap[openJobId]?.results || []).map((app) => (
                            <div key={app.id} className="p-4 border rounded-lg bg-white">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-medium text-gray-800">{app.teacher?.full_name ?? app.teacher?.username}</div>
                                        <div className="text-sm text-gray-600">{app.teacher?.profile_picture ? <span className="text-xs">Has profile pic</span> : <span className="text-xs">No avatar</span>}</div>
                                        <div className="text-sm mt-2 text-gray-600">Applied: {new Date(app.applied_at).toLocaleString()}</div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-sm">Status: <strong>{app.status}</strong></div>
                                        <div className="text-sm mt-2">Rate: {app.proposed_rate ?? "—"}</div>
                                    </div>
                                </div>

                                <div className="mt-3 text-sm text-gray-700 break-words">{app.cover_letter}</div>

                                <div className="mt-4 flex items-center gap-2 flex-wrap">
                                    {app.status !== "accepted" && (
                                        <Button size="sm" onClick={() => openConfirm(app)} className="px-3 py-1" style={{ backgroundColor: "#34D399", color: "#fff" }}>
                                            Accept
                                        </Button>
                                    )}

                                    {app.status !== "rejected" && (
                                        <Button size="sm" variant="outline" onClick={() => rejectApplication(app.id)} className="border-muted/20">Reject</Button>
                                    )}
                                    <span className="ml-auto flex items-center gap-2 border-2 border-gray-200 p-2 rounded text-sm text-gray-600">
                                        <Eye className="w-4 h-4" />
                                        <Link href={`/our-tutors/tutor/${app.teacher.id}`} className="ml-auto text-sm text-gray-600">View Profile</Link>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setOpenJobId(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm accept dialog */}
            <Dialog open={confirmOpen} onOpenChange={(open) => { if (!open) setConfirmOpen(false) }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm selection</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <div>
                            <div className="text-sm">Are you sure you want to select <strong>{selectedApplication?.teacher?.full_name}</strong> for this job?</div>
                        </div>

                        <div className="text-sm text-gray-600">Selecting a teacher will mark their application as <em>accepted</em> and set the job status to <em>accepted</em>.</div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={acceptSelected} disabled={actionLoading} className="px-4" style={{ backgroundColor: "#F5BB07", color: "#1a1a1a" }}>
                            {actionLoading ? "Selecting..." : "Select teacher"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* toast */}
            <div className="fixed top-6 right-6 z-50">
                {toast.show && (
                    <div className={`rounded-md px-4 py-2 shadow ${toast.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                        {toast.message}
                    </div>
                )}
            </div>
        </div>
    )
}
