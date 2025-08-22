"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export const useWebRTC = ({ meetingId, participantName, signalingUrl, turnServers }) => {
  const [participants, setParticipants] = useState([])
  const [localStream, setLocalStream] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [connectionState, setConnectionState] = useState("disconnected")

  const wsRef = useRef(null)
  const peerConnectionsRef = useRef(new Map())
  const dataChannelsRef = useRef(new Map())
  const localStreamRef = useRef(null)
  const reconnectTimerRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)

  const defaultTurnServers = [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:localhost:3478",
      username: "user",
      credential: "pass",
    },
  ]

  const iceServers = turnServers || defaultTurnServers
  const MAX_RECONNECT_ATTEMPTS = 6

  // --- Utilities
  const buildWsUrl = (inputUrl) => {
    if (!inputUrl) {
      // default to same host + port 8080 root (useful for quick local dev)
      return (location.protocol === "https:" ? "wss:" : "ws:") + "//" + location.host.replace(/:\d+$/, ":8080") + "/"
    }
    // If already ws/wss, return as-is
    if (/^wss?:\/\//i.test(inputUrl)) return inputUrl
    // If http/https supplied, convert to ws/wss
    if (/^https?:\/\//i.test(inputUrl)) return inputUrl.replace(/^http/, "ws")
    // Otherwise treat as host/path and add protocol according to current page
    return (location.protocol === "https:" ? "wss:" : "ws:") + "//" + inputUrl
  }

  // Initialize local media stream
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      })
      setLocalStream(stream)
      localStreamRef.current = stream
      return stream
    } catch (error) {
      console.error("[v0] Failed to get user media:", error)
      throw error
    }
  }, [])

  // Create peer connection
  const createPeerConnection = useCallback(
    (participantId) => {
      if (!participantId) throw new Error("participantId required")

      // If already exists, return it
      const existing = peerConnectionsRef.current.get(participantId)
      if (existing) return existing

      const peerConnection = new RTCPeerConnection({ iceServers })

      // Add local stream tracks (if present)
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          try {
            peerConnection.addTrack(track, localStreamRef.current)
          } catch (err) {
            // sometimes addTrack can throw if track already added — ignore safely
          }
        })
      }

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams
        console.log("[v0] Received remote track from:", participantId)
        setParticipants((prev) => prev.map((p) => (p.id === participantId ? { ...p, stream: remoteStream } : p)))
      }

      // Handle incoming data channel (when other side creates it)
      peerConnection.ondatachannel = (event) => {
        const dc = event.channel
        console.log("[v0] Incoming datachannel from", participantId)
        dc.onopen = () => console.log("[v0] Data channel opened (incoming) with:", participantId)
        dc.onmessage = (ev) => {
          try {
            const message = JSON.parse(ev.data)
            setChatMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                participantId,
                participantName: message.senderName,
                message: message.text,
                timestamp: new Date(),
              },
            ])
          } catch (err) {
            console.warn("[v0] Failed to parse datachannel message", err)
          }
        }
        dataChannelsRef.current.set(participantId, dc)
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: event.candidate,
              targetParticipant: participantId,
              fromParticipant: participantName,
            }),
          )
        }
      }

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log("[v0] Connection state with", participantId, ":", peerConnection.connectionState)
        if (peerConnection.connectionState === "failed") {
          setConnectionState("failed")
        }
      }

      // Create data channel for outgoing chat (only create if we are the initiator)
      try {
        const dc = peerConnection.createDataChannel("chat")
        dc.onopen = () => console.log("[v0] Data channel opened with:", participantId)
        dc.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            setChatMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                participantId,
                participantName: message.senderName,
                message: message.text,
                timestamp: new Date(),
              },
            ])
          } catch (err) {
            console.warn("[v0] Failed to parse outgoing channel message", err)
          }
        }
        dataChannelsRef.current.set(participantId, dc)
      } catch (err) {
        // Some browsers may throw if createDataChannel is not allowed at this time; ignore
      }

      peerConnectionsRef.current.set(participantId, peerConnection)
      return peerConnection
    },
    [iceServers, participantName],
  )

  // Send WebSocket message
  const sendMessage = useCallback((message) => {
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message))
      } catch (err) {
        console.error("[v0] Failed to send WS message:", err, message)
      }
    } else {
      console.warn("[v0] WebSocket not open; cannot send message:", message)
    }
  }, [])

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback(
    async (event) => {
      let message
      try {
        message = JSON.parse(event.data)
      } catch (err) {
        console.warn("[v0] Non-JSON WS message:", event.data)
        return
      }

      const type = message.type
      console.log("[v0] Received message:", type, message)

      switch (type) {
        case "participant-joined": {
          const p = message.participant
          setParticipants((prev) => {
            if (prev.find((x) => x.id === p.id)) return prev
            return [...prev, p]
          })

          // Create offer for the new participant (if it's not us)
          if (p.id !== participantName) {
            const pc = createPeerConnection(p.id)
            try {
              const offer = await pc.createOffer()
              await pc.setLocalDescription(offer)
              sendMessage({
                type: "offer",
                offer,
                targetParticipant: p.id,
                fromParticipant: participantName,
              })
            } catch (err) {
              console.error("[v0] Failed to create/send offer:", err)
            }
          }
          break
        }

        case "participant-left": {
          const leavingId = message.participantId
          setParticipants((prev) => prev.filter((p) => p.id !== leavingId))
          const pc = peerConnectionsRef.current.get(leavingId)
          if (pc) {
            try {
              pc.close()
            } catch (e) {}
            peerConnectionsRef.current.delete(leavingId)
            dataChannelsRef.current.delete(leavingId)
          }
          break
        }

        case "offer": {
          const from = message.fromParticipant || message.participant?.id
          if (!from || from === participantName) break

          const pc = createPeerConnection(from)
          try {
            await pc.setRemoteDescription(message.offer)
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            sendMessage({
              type: "answer",
              answer,
              targetParticipant: from,
              fromParticipant: participantName,
            })
          } catch (err) {
            console.error("[v0] Error handling offer:", err)
          }
          break
        }

        case "answer": {
          const from = message.fromParticipant || message.participant?.id
          const pc = peerConnectionsRef.current.get(from)
          if (pc) {
            try {
              await pc.setRemoteDescription(message.answer)
            } catch (err) {
              console.error("[v0] Failed to set remote answer:", err)
            }
          }
          break
        }

        case "ice-candidate": {
          const from = message.fromParticipant || message.participant?.id
          const pc = peerConnectionsRef.current.get(from)
          if (pc && message.candidate) {
            try {
              await pc.addIceCandidate(message.candidate)
            } catch (err) {
              console.warn("[v0] addIceCandidate failed:", err)
            }
          }
          break
        }

        case "participants-list": {
          const others = (message.participants || []).filter((p) => p.id !== participantName)
          setParticipants(message.participants || [])

          // Create peer connections and offers for each other participant
          for (const p of others) {
            try {
              const pc = createPeerConnection(p.id)
              const offer = await pc.createOffer()
              await pc.setLocalDescription(offer)
              sendMessage({
                type: "offer",
                offer,
                targetParticipant: p.id,
                fromParticipant: participantName,
              })
            } catch (err) {
              console.error("[v0] Failed to init offer to", p.id, err)
            }
          }
          break
        }

        default:
          console.warn("[v0] Unhandled WS message type:", type)
      }
    },
    [createPeerConnection, sendMessage, participantName],
  )

  // Reconnect logic
  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.warn("[v0] Max reconnect attempts reached")
      setConnectionState("failed")
      return
    }
    reconnectAttemptsRef.current += 1
    const delay = Math.min(30000, Math.pow(2, reconnectAttemptsRef.current) * 1000) // exponential, capped
    console.log(`[v0] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`)
    reconnectTimerRef.current = setTimeout(() => {
      connect().catch((e) => console.error("[v0] reconnect attempt failed:", e))
    }, delay)
  }, [])

  // Connect to meeting
  const connect = useCallback(async () => {
    try {
      setConnectionState("connecting")
      // clear any scheduled reconnect
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }

      // Initialize media first
      await initializeMedia()

      // Build WS url robustly
      const wsUrl = buildWsUrl(signalingUrl)
      console.log("[v0] Connecting to signaling:", wsUrl)

      // create ws
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log("[v0] WebSocket connected")
        reconnectAttemptsRef.current = 0
        setIsConnected(true)
        setConnectionState("connected")

        // Join meeting
        sendMessage({
          type: "join-meeting",
          meetingId,
          participant: {
            id: participantName,
            name: participantName,
            isHost: false,
            isMuted: false,
            isVideoOff: false,
          },
          fromParticipant: participantName,
        })
      }

      ws.onmessage = handleWebSocketMessage

      ws.onclose = (evt) => {
        console.log("[v0] WebSocket disconnected", evt.code, evt.reason)
        setIsConnected(false)
        setConnectionState("disconnected")

        // close and cleanup peer connections
        // Note: do not automatically fully disconnect; try to reconnect
        peerConnectionsRef.current.forEach((pc) => {
          try {
            pc.close()
          } catch (e) {}
        })
        // Attempt reconnection
        scheduleReconnect()
      }

      ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
        // Let onclose handle reconnect sequence
        setConnectionState("failed")
      }
    } catch (error) {
      console.error("[v0] Failed to connect:", error)
      setConnectionState("failed")
      // Schedule reconnect attempt
      scheduleReconnect()
    }
  }, [signalingUrl, meetingId, participantName, initializeMedia, handleWebSocketMessage, sendMessage, scheduleReconnect])

  // Disconnect from meeting
  const disconnect = useCallback(() => {
    // Stop scheduled reconnects
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    reconnectAttemptsRef.current = 0

    // Close all peer connections
    peerConnectionsRef.current.forEach((pc) => {
      try {
        pc.close()
      } catch (e) {}
    })
    peerConnectionsRef.current.clear()
    dataChannelsRef.current.clear()

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    // Close WebSocket
    if (wsRef.current) {
      try {
        wsRef.current.close()
      } catch (e) {}
      wsRef.current = null
    }

    setIsConnected(false)
    setLocalStream(null)
    setParticipants([])
    setConnectionState("disconnected")
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        const muted = !audioTrack.enabled
        setIsMuted(muted)

        // Notify other participants
        sendMessage({
          type: "participant-update",
          participantId: participantName,
          isMuted: muted,
          fromParticipant: participantName,
        })
      }
    }
  }, [sendMessage, participantName])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        const videoOff = !videoTrack.enabled
        setIsVideoOff(videoOff)

        // Notify other participants
        sendMessage({
          type: "participant-update",
          participantId: participantName,
          isVideoOff: videoOff,
          fromParticipant: participantName,
        })
      }
    }
  }, [sendMessage, participantName])

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      const screenVideoTrack = screenStream.getVideoTracks()[0]
      // Replace video track in all peer connections (senders)
      peerConnectionsRef.current.forEach(async (pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video")
        if (sender) {
          try {
            await sender.replaceTrack(screenVideoTrack)
          } catch (err) {
            console.warn("[v0] replaceTrack failed:", err)
          }
        }
      })

      // Replace local preview stream with screen stream so UI shows shared screen
      localStreamRef.current = screenStream
      setLocalStream(screenStream)
      setIsScreenSharing(true)

      screenVideoTrack.onended = () => {
        // automatic stop when user ends screen share
        stopScreenShare().catch((e) => console.warn("stopScreenShare failed", e))
      }
    } catch (error) {
      console.error("[v0] Failed to start screen share:", error)
    }
  }, [])

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      // Get camera stream back (try to preserve resolution)
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true })
      const cameraVideoTrack = cameraStream.getVideoTracks()[0]

      // Replace screen share track with camera track in all peer connections
      peerConnectionsRef.current.forEach(async (pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video")
        if (sender) {
          try {
            await sender.replaceTrack(cameraVideoTrack)
          } catch (err) {
            console.warn("[v0] replaceTrack (stop screen) failed:", err)
          }
        }
      })

      // Update local preview back to camera stream
      localStreamRef.current = cameraStream
      setLocalStream(cameraStream)
      setIsScreenSharing(false)
    } catch (error) {
      console.error("[v0] Failed to stop screen share:", error)
    }
  }, [])

  // Send chat message
  const sendChatMessage = useCallback(
    (message) => {
      const chatMessage = {
        senderName: participantName,
        text: message,
      }

      // Send to all participants via data channels
      dataChannelsRef.current.forEach((dataChannel) => {
        if (dataChannel.readyState === "open") {
          try {
            dataChannel.send(JSON.stringify(chatMessage))
          } catch (err) {
            console.warn("[v0] failed to send chat via data channel:", err)
          }
        }
      })

      // Add to local chat
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          participantId: participantName,
          participantName,
          message,
          timestamp: new Date(),
        },
      ])
    },
    [participantName],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    // State
    participants,
    localStream,
    isConnected,
    isMuted,
    isVideoOff,
    isScreenSharing,
    chatMessages,
    connectionState,

    // Actions
    connect,
    disconnect,
    toggleMute,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    sendChatMessage,
  }
}
