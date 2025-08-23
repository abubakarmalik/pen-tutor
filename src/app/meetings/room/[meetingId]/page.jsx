"use client"

import React, { Suspense, useEffect, useState } from "react"
import MeetingRoom from "./RoomClient"

export default function Page({ params, searchParams }) {
  const { meetingId } = React.use(params)   // ✅ unwrap params
  const { host } = React.use(searchParams)  // ✅ unwrap searchParams

  const isHost = host === "1"

  console.log("meetingId:", meetingId, "host:", host)

  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allowed, setAllowed] = useState(false)
  const [participantName, setParticipantName] = useState("")

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_ORIGIN}/api/meetings/${meetingId}/`, { credentials: "include" })
      .then(r => r.json())
      .then(console.log)
      .catch(console.error)
  }, [])

  useEffect(() => {
    async function init() {
      try {
        // 1. Fetch meeting details
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/meetings/${meetingId}/`,
          { credentials: "include" }
        )
        if (!res.ok) throw new Error("Failed to fetch meeting")
        const data = await res.json()
        setMeeting(data)

        // 2. Join meeting (password if required)
        let body = { meeting_id: meetingId }
        if (data.is_password_required) {
          const pwd = prompt("This meeting requires a password:")
          body.password = pwd
        }

        const joinRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_ORIGIN}/api/meetings/join/${meetingId}/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(body),
          }
        )
        if (!joinRes.ok) throw new Error("Unable to join meeting")

        setAllowed(true)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (meetingId) init()
  }, [meetingId])

  // Ask user name once
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlName = new URL(window.location.href).searchParams.get("name")
      if (urlName) {
        setParticipantName(urlName)
      } else {
        const entered = prompt("Enter your display name:")
        setParticipantName(entered || "Guest")
      }
    }
  }, [])

  if (loading) return <div className="p-8 text-center">Loading meeting…</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>
  if (!allowed) return <div className="p-8">Not allowed to join this meeting.</div>

  // 3. Build ws signaling endpoint
  const signalingUrl = `${process.env.NEXT_PUBLIC_SIGNALING_ORIGIN.replace(/\/$/, "")}/ws/meeting/${meetingId}/`

  return (
    <Suspense>
      <MeetingRoom
        meetingId={meetingId}
        participantName={participantName}
        isHost={isHost}
        signalingUrl={signalingUrl}
      />
    </Suspense>
  )
}
