"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { X, Phone, MessageSquare, AlertTriangle, Send, User, Bot, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CarrierNode, TranscriptMessage } from "@/lib/types"

interface TakeoverModalProps {
  carrier: CarrierNode
  transcript: TranscriptMessage[]
  humanOverride?: string
  onClose: () => void
  onInjectOverride: (message: string) => void
}

export function TakeoverModal({ carrier, transcript, humanOverride, onClose, onInjectOverride }: TakeoverModalProps) {
  const [overrideText, setOverrideText] = useState("")
  const [localTranscript, setLocalTranscript] = useState<TranscriptMessage[]>(transcript)
  const transcriptRef = useRef<HTMLDivElement>(null)

  // Sync external transcript changes
  useEffect(() => {
    setLocalTranscript(transcript)
  }, [transcript])

  // Auto-fill human override text if provided (typewriter effect)
  useEffect(() => {
    if (humanOverride) {
      setOverrideText("")
      let index = 0
      const interval = setInterval(() => {
        if (index <= humanOverride.length) {
          setOverrideText(humanOverride.slice(0, index))
          index++
        } else {
          clearInterval(interval)
        }
      }, 25)
      return () => clearInterval(interval)
    }
  }, [humanOverride])

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [localTranscript])

  const handleOverride = useCallback(() => {
    if (!overrideText.trim()) return

    // Add the override message as a dark gray "System Override" bubble
    const overrideMessage: TranscriptMessage = {
      sender: "Override",
      message: overrideText,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      isOverride: true,
    }

    setLocalTranscript(prev => [...prev, overrideMessage])
    onInjectOverride(overrideText)
    setOverrideText("")
  }, [overrideText, onInjectOverride])

  const getSentimentLevel = () => {
    switch (carrier.sentiment) {
      case "happy": return 85
      case "neutral": return 50
      case "frustrated": return 15
      default: return 50
    }
  }

  const getSentimentColor = () => {
    switch (carrier.sentiment) {
      case "happy": return "#00ff00"
      case "neutral": return "#ffaa00"
      case "frustrated": return "#ff6b6b"
      default: return "#ffaa00"
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/10 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="h-full w-full max-w-lg border-l border-border bg-card shadow-2xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background">
                {carrier.channel === "phone" ? (
                  <Phone className="h-5 w-5" />
                ) : (
                  <MessageSquare className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="font-bold text-foreground">{carrier.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Current Bid: <span className="font-semibold text-foreground">€{carrier.bid.toLocaleString()}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Sentiment/Patience Level */}
          <div className="border-b border-border p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {carrier.sentiment === "frustrated" && (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm font-medium text-foreground">Patience Level</span>
              </div>
              <span 
                className="text-sm font-bold"
                style={{ color: getSentimentColor() }}
              >
                {carrier.sentiment === "happy" ? "High" : carrier.sentiment === "neutral" ? "Medium" : "Critical"}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: getSentimentColor() }}
                initial={{ width: 0 }}
                animate={{ width: `${getSentimentLevel()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Live Transcript */}
          <div className="flex-1 overflow-hidden">
            <div className="border-b border-border p-4 pb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Live Transcript
              </h3>
            </div>
            <div 
              ref={transcriptRef}
              className="h-[calc(100%-40px)] overflow-y-auto p-4"
            >
              <div className="space-y-3">
                {localTranscript.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`flex gap-3 ${
                      msg.sender === "Human" || msg.isOverride ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      msg.sender === "AI" 
                        ? "bg-foreground text-background"
                        : msg.sender === "Human"
                          ? "bg-accent text-foreground"
                          : msg.isOverride
                            ? "bg-muted-foreground text-background"
                            : msg.sender === "System"
                              ? "bg-secondary text-muted-foreground"
                              : "bg-muted text-foreground"
                    }`}>
                      {msg.sender === "Human" ? (
                        <User className="h-4 w-4" />
                      ) : msg.sender === "AI" ? (
                        <Bot className="h-4 w-4" />
                      ) : msg.isOverride ? (
                        <Terminal className="h-4 w-4" />
                      ) : (
                        msg.sender.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className={`flex-1 ${msg.sender === "Human" || msg.isOverride ? "text-right" : ""}`}>
                      <div className={`mb-0.5 flex items-center gap-2 ${
                        msg.sender === "Human" || msg.isOverride ? "justify-end" : ""
                      }`}>
                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                        <span className={`text-xs font-semibold ${
                          msg.isOverride ? "text-muted-foreground" : "text-foreground"
                        }`}>
                          {msg.isOverride ? "System Override" : msg.sender}
                        </span>
                      </div>
                      <div className={`inline-block rounded-lg px-3 py-2 text-sm ${
                        msg.isOverride
                          ? "bg-muted-foreground/20 text-foreground"
                          : msg.sender === "Human"
                            ? "bg-accent/20 text-foreground"
                            : msg.sender === "System" 
                              ? "bg-secondary text-muted-foreground" 
                              : msg.sender === "AI"
                                ? "bg-foreground/10 text-foreground"
                                : "bg-muted text-foreground"
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Manual Override Input */}
          <div className="border-t border-border p-4">
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Human Override
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={overrideText}
                onChange={(e) => setOverrideText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleOverride()}
                placeholder="Type instruction to override AI agent..."
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
              <Button 
                className="bg-foreground text-background hover:bg-foreground/90"
                onClick={handleOverride}
                disabled={!overrideText.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Override Agent
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
