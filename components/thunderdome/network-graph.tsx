"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Phone, MessageSquare } from "lucide-react"
import type { CarrierNode } from "@/lib/types"

interface NetworkGraphProps {
  carriers: CarrierNode[]
  onNodeClick: (carrier: CarrierNode) => void
  currentStep: number
}

const CARRIER_POSITIONS: Record<string, { x: number; y: number }> = {
  speed: { x: -220, y: -80 },
  euro: { x: 220, y: 80 },
}

export function NetworkGraph({ carriers, onNodeClick, currentStep }: NetworkGraphProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const centerX = dimensions.width / 2
  const centerY = dimensions.height / 2

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
      {/* SVG Connection Lines */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {carriers.map((carrier) => {
          const pos = CARRIER_POSITIONS[carrier.id]
          if (!pos || carrier.status === "dropped") return null
          
          const startX = centerX
          const startY = centerY
          const endX = centerX + pos.x
          const endY = centerY + pos.y
          
          const controlX1 = startX + (endX - startX) * 0.5
          const controlY1 = startY
          const controlX2 = startX + (endX - startX) * 0.5
          const controlY2 = endY

          const strokeColor = carrier.status === "winner" 
            ? "#00ff00" 
            : carrier.status === "warning" 
              ? "#ffaa00" 
              : "rgba(0,0,0,0.15)"

          return (
            <motion.path
              key={carrier.id}
              d={`M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={carrier.status === "winner" ? 3 : 2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          )
        })}
      </svg>

      {/* Central Memory Agent Node */}
      <motion.div
        className="absolute z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-black text-white shadow-2xl"
        style={{
          left: centerX - 56,
          top: centerY - 56,
          boxShadow: "0 0 60px rgba(0,0,0,0.3)",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="text-[10px] font-medium uppercase tracking-widest opacity-60">Memory</div>
        <div className="text-sm font-bold">Agent</div>
      </motion.div>

      {/* Carrier Nodes */}
      {carriers.map((carrier) => {
        const pos = CARRIER_POSITIONS[carrier.id]
        if (!pos) return null

        return (
          <CarrierNodeComponent
            key={carrier.id}
            carrier={carrier}
            position={{ x: centerX + pos.x, y: centerY + pos.y }}
            onClick={() => onNodeClick(carrier)}
            currentStep={currentStep}
          />
        )
      })}
    </div>
  )
}

interface CarrierNodeComponentProps {
  carrier: CarrierNode
  position: { x: number; y: number }
  onClick: () => void
  currentStep: number
}

function CarrierNodeComponent({ carrier, position, onClick, currentStep }: CarrierNodeComponentProps) {
  const getSentimentColor = () => {
    if (carrier.status === "winner") return "#00ff00"
    if (carrier.status === "dropped") return "rgba(0,0,0,0.2)"
    switch (carrier.sentiment) {
      case "happy": return "#00ff00"
      case "neutral": return "#ffaa00"
      case "frustrated": return "#ff0000"
      default: return "#00ff00"
    }
  }

  const getNodeStyles = () => {
    if (carrier.status === "winner") {
      return {
        borderColor: "#00ff00",
        boxShadow: "0 0 30px rgba(0,255,0,0.5), 0 0 60px rgba(0,255,0,0.3)",
      }
    }
    if (carrier.status === "dropped") {
      return {
        borderColor: "rgba(0,0,0,0.1)",
        opacity: 0.4,
      }
    }
    if (carrier.status === "warning") {
      return {
        borderColor: "#ffaa00",
        boxShadow: "0 0 20px rgba(255,170,0,0.4)",
      }
    }
    return {
      borderColor: "rgba(0,0,0,0.1)",
    }
  }

  const nodeStyles = getNodeStyles()

  return (
    <motion.div
      className="absolute z-20 cursor-pointer"
      style={{
        left: position.x - 100,
        top: position.y - 50,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: carrier.status === "dropped" ? 0.4 : 1, 
        scale: 1,
      }}
      whileHover={{ scale: carrier.status === "dropped" ? 1 : 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
    >
      <motion.div
        className="relative flex w-[200px] flex-col gap-2 rounded-xl border-2 bg-white p-4 transition-shadow"
        style={nodeStyles}
        animate={carrier.status === "winner" ? {
          boxShadow: [
            "0 0 30px rgba(0,255,0,0.5), 0 0 60px rgba(0,255,0,0.3)",
            "0 0 40px rgba(0,255,0,0.7), 0 0 80px rgba(0,255,0,0.4)",
            "0 0 30px rgba(0,255,0,0.5), 0 0 60px rgba(0,255,0,0.3)",
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: carrier.status === "winner" ? Infinity : 0 }}
      >
        {/* Sentiment Indicator */}
        <motion.div
          className="absolute -right-1 -top-1 h-3 w-3 rounded-full"
          style={{ backgroundColor: getSentimentColor() }}
          animate={carrier.sentiment === "frustrated" ? {
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1],
          } : {}}
          transition={{ duration: 0.8, repeat: carrier.sentiment === "frustrated" ? Infinity : 0 }}
        />

        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white">
            {carrier.channel === "phone" ? (
              <Phone className="h-3.5 w-3.5" />
            ) : (
              <MessageSquare className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="flex-1 truncate text-sm font-semibold text-black">
            {carrier.name}
          </div>
        </div>

        {/* Bid */}
        <div className="flex items-baseline gap-1">
          <motion.span
            key={`${carrier.id}-${carrier.bid}-${currentStep}`}
            className="text-2xl font-bold tabular-nums text-black"
            initial={{ scale: 1.2, color: "#00ff00" }}
            animate={{ scale: 1, color: "#000000" }}
            transition={{ duration: 0.4 }}
          >
            €{carrier.bid.toLocaleString()}
          </motion.span>
        </div>

        {/* Status Badge */}
        {carrier.status === "winner" && (
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[#00ff00] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Winner
          </motion.div>
        )}
        {carrier.status === "dropped" && (
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Dropped
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
