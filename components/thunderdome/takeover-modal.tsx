"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { X, Phone, MessageSquare, AlertTriangle, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CarrierNode, TranscriptMessage } from "@/lib/types"

interface TakeoverModalProps {
  carrier: CarrierNode
  transcript: TranscriptMessage[]
  humanOverride?: string
  onClose: () => void
}

export function TakeoverModal({ carrier, transcript, humanOverride, onClose }: TakeoverModalProps) {
  const [overrideText, setOverrideText] = useState("")
  const transcriptRef = useRef<HTMLDivElement>(null)

  // Auto-fill human override text if provided
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
      }, 30)
      return () => clearInterval(interval)
    }
  }, [humanOverride])

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcript])

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
      case "frustrated": return "#ff0000"
      default: return "#ffaa00"
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="h-full w-full max-w-lg bg-white shadow-2xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                {carrier.channel === "phone" ? (
                  <Phone className="h-5 w-5" />
                ) : (
                  <MessageSquare className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="font-bold text-black">{carrier.name}</h2>
                <p className="text-sm text-black/50">
                  Current Bid: <span className="font-semibold text-black">€{carrier.bid.toLocaleString()}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sentiment Alert */}
          <div className="border-b border-black/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {carrier.sentiment === "frustrated" && (
                  <AlertTriangle className="h-4 w-4 text-[#ff0000]" />
                )}
                <span className="text-sm font-medium text-black">Patience Level</span>
              </div>
              <span 
                className="text-sm font-bold"
                style={{ color: getSentimentColor() }}
              >
                {carrier.sentiment === "happy" ? "High" : carrier.sentiment === "neutral" ? "Medium" : "Critical"}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
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
            <div className="border-b border-black/10 p-4 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-black/50">
                Live Transcript
              </h3>
            </div>
            <div 
              ref={transcriptRef}
              className="h-[calc(100%-40px)] overflow-y-auto p-4"
            >
              <div className="space-y-3">
                {transcript.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${
                      msg.sender === "Human" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      msg.sender === "AI" 
                        ? "bg-black text-white"
                        : msg.sender === "Human"
                          ? "bg-[#00ff00] text-black"
                          : msg.sender === "System"
                            ? "bg-black/10 text-black/60"
                            : "bg-black/20 text-black"
                    }`}>
                      {msg.sender === "Human" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        msg.sender.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className={`flex-1 ${msg.sender === "Human" ? "text-right" : ""}`}>
                      <div className="mb-0.5 flex items-center gap-2">
                        {msg.sender !== "Human" && (
                          <span className="text-xs font-semibold text-black">{msg.sender}</span>
                        )}
                        <span className="text-[10px] text-black/40">{msg.time}</span>
                        {msg.sender === "Human" && (
                          <span className="text-xs font-semibold text-black">{msg.sender}</span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        msg.sender === "System" 
                          ? "font-medium text-black/60" 
                          : "text-black"
                      }`}>
                        {msg.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Manual Override */}
          <div className="border-t border-black/10 p-4">
            <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-black/50">
              Human Override
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={overrideText}
                onChange={(e) => setOverrideText(e.target.value)}
                placeholder="Type instruction to override AI agent..."
                className="flex-1 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/30 focus:border-black focus:outline-none"
              />
              <Button 
                className="bg-black text-white hover:bg-black/80"
                disabled={!overrideText.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Take Over
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
