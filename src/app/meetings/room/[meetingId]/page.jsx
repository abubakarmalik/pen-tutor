"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useWebRTC } from "@/hooks/useWebRTC"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, Monitor, MessageCircle, User } from "lucide-react"

/**
 * MeetingRoom component
 * Props:
 * - meetingId (string)
 * - participantName (string)
 * - isHost (boolean)
 * - signalingUrl (string) optional, defaults to NEXT_PUBLIC_SIGNALING_SERVER
 */
export default function MeetingRoom({ meetingId, participantName, isHost = false, signalingUrl }) {
  const router = useRouter()
  const resolvedSignalingUrl = signalingUrl || process.env.NEXT_PUBLIC_SIGNALING_SERVER || "ws://localhost:8080/ws"

  const {
    participants,
    localStream,
    isConnected,
    isMuted,
    isVideoOff,
    isScreenSharing,
    chatMessages,
    connectionState,
    connect,
    disconnect,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    sendChatMessage,
  } = useWebRTC({ meetingId, participantName, signalingUrl: resolvedSignalingUrl })

  const localVideoRef = useRef(null)
  const participantVideoRefs = useRef(new Map())
  const [chatInput, setChatInput] = useState("")
  const [showChat, setShowChat] = useState(false)

  // Attach local stream to its video element
  useEffect(() => {
    if (localVideoRef.current) {
      if (localStream) {
        try {
          localVideoRef.current.srcObject = localStream
        } catch (err) {
          console.warn("Failed to attach local stream to video element", err)
        }
      } else {
        localVideoRef.current.srcObject = null
      }
    }
  }, [localStream])

  // Attach participant streams when they change
  useEffect(() => {
    participants.forEach((p) => {
      const ref = participantVideoRefs.current.get(p.id)
      if (ref && ref.current) {
        if (p.stream) {
          try {
            ref.current.srcObject = p.stream
          } catch (err) {
            console.warn(`Failed to attach remote stream for ${p.id}`, err)
          }
        } else {
          ref.current.srcObject = null
        }
      }
    })
  }, [participants])

  // Create refs for participants dynamically
  const ensureParticipantRef = (id) => {
    if (!participantVideoRefs.current.has(id)) {
      participantVideoRefs.current.set(id, React.createRef())
    }
    return participantVideoRefs.current.get(id)
  }

  // Auto-connect when the component mounts
  useEffect(() => {
    connect().catch((e) => console.error("connect failed", e))
    return () => {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    sendChatMessage(chatInput.trim())
    setChatInput("")
  }

  const handleLeave = () => {
    try {
      disconnect()
    } finally {
      router.push("/meetings")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101226] to-[#0b1230] text-white p-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video area (left + center) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local video */}
            <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover bg-black"
              />

              <div className="absolute left-2 top-2 bg-black/40 rounded-md px-2 py-1 text-sm flex items-center gap-2">
                <span className="font-semibold">You</span>
                <span className="text-xs text-white/80">{participantName}</span>
              </div>

              <div className="absolute right-2 bottom-2 flex gap-2">
                <button
                  onClick={toggleMute}
                  className="bg-white/8 hover:bg-white/12 rounded-md p-2 flex items-center gap-2"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleVideo}
                  className="bg-white/8 hover:bg-white/12 rounded-md p-2 flex items-center gap-2"
                  title={isVideoOff ? "Turn video on" : "Turn video off"}
                >
                  {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => (isScreenSharing ? stopScreenShare() : startScreenShare())}
                  className="bg-white/8 hover:bg-white/12 rounded-md p-2 flex items-center gap-2"
                  title={isScreenSharing ? "Stop sharing" : "Share screen"}
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Remote participants grid (show first N participants) */}
            <div className="grid grid-cols-1 gap-4">
              {participants && participants.length > 0 ? (
                participants.map((p) => (
                  <div key={p.id} className="relative bg-black rounded-lg overflow-hidden shadow-lg">
                    <video
                      ref={ensureParticipantRef(p.id)}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover bg-black"
                    />

                    <div className="absolute left-2 top-2 bg-black/40 rounded-md px-2 py-1 text-sm flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-semibold">{p.name ?? p.id}</span>
                    </div>
                  </div>
                ))
              ) : (
                <Card className="p-4 flex items-center justify-center">
                  <div className="text-center text-sm text-white/70">No other participants yet</div>
                </Card>
              )}
            </div>
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="text-sm text-white/80">Status: </div>
              <div className="px-2 py-1 bg-white/6 rounded">{connectionState}</div>
              <div className="px-2 py-1 bg-white/6 rounded">{isConnected ? "Connected" : "Disconnected"}</div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => setShowChat((s) => !s)} variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>

              <Button onClick={handleLeave} variant="destructive" className="bg-red-600 hover:bg-red-700">
                Leave
              </Button>
            </div>
          </div>
        </div>

        {/* Right sidebar — participants list + chat */}
        <aside className="space-y-4">
          <div className="bg-white/6 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Participants</div>
            </div>

            <div className="space-y-2 max-h-48 overflow-auto">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center">{participantName?.charAt(0)?.toUpperCase()}</div>
                <div className="text-sm">{participantName} (You)</div>
              </div>

              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center">{p.name?.charAt(0)?.toUpperCase() ?? p.id?.charAt(0)}</div>
                  <div className="text-sm">{p.name ?? p.id}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat panel */}
          {showChat && (
            <div className="bg-white/6 rounded-lg p-3 flex flex-col h-96">
              <div className="flex-1 overflow-auto space-y-2 mb-3">
                {chatMessages.length === 0 ? (
                  <div className="text-sm text-white/60">No messages yet</div>
                ) : (
                  chatMessages.map((m) => (
                    <div key={m.id} className={`p-2 rounded ${m.participantId === participantName ? "bg-white/10 self-end" : "bg-white/4 self-start"}`}>
                      <div className="text-xs text-white/60">{m.participantName}</div>
                      <div className="text-sm">{m.message}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendChat()
                  }}
                />
                <Button onClick={handleSendChat}>Send</Button>
              </div>
            </div>
          )}

          {/* Small help / tips */}
          <div className="bg-white/4 rounded-lg p-3 text-sm text-white/80">
            <div className="font-semibold mb-1">Quick tips</div>
            <ul className="list-disc ml-5 space-y-1">
              <li>Allow camera & microphone access when prompted.</li>
              <li>Use the screen share button to share your screen.</li>
              <li>Close this tab to leave the meeting if the Leave button fails.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
