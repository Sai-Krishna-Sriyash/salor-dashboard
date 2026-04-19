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

// Positions for all carrier nodes (relative to center)
const CARRIER_POSITIONS: Record<string, { x: number; y: number }> = {
  // Active carriers
  speed: { x: -240, y: -100 },
  euro: { x: 240, y: 100 },
  // Dummy carriers scattered around
  dummy1: { x: -320, y: 60 },
  dummy2: { x: 180, y: -140 },
  dummy3: { x: -120, y: 180 },
  dummy4: { x: 340, y: -40 },
  dummy5: { x: -200, y: -200 },
  dummy6: { x: 80, y: 200 },
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

  // Only draw lines for non-dummy carriers that exist in current state
  const activeCarriers = carriers.filter(c => !c.isDummy)

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
      {/* SVG Connection Lines - Behind nodes, in front of grid */}
      <svg 
        className="absolute inset-0 pointer-events-none" 
        style={{ zIndex: 1 }}
        width={dimensions.width}
        height={dimensions.height}
      >
        <defs>
          {/* CSS Keyframes for flowing blue data lines */}
          <style>
            {`
              @keyframes flowForward {
                from { stroke-dashoffset: 0; }
                to { stroke-dashoffset: -24; }
              }
              @keyframes flowBackward {
                from { stroke-dashoffset: 0; }
                to { stroke-dashoffset: 24; }
              }
              .data-flow {
                animation: flowForward 0.6s linear infinite;
              }
              .data-flow-reverse {
                animation: flowBackward 0.6s linear infinite;
              }
            `}
          </style>
        </defs>

        {/* Faint static lines for dummy/pending nodes */}
        {carriers.filter(c => c.isDummy || c.status === "pending").map((carrier) => {
          const pos = CARRIER_POSITIONS[carrier.id]
          if (!pos || dimensions.width === 0) return null
          
          const startX = centerX
          const startY = centerY
          const endX = centerX + pos.x
          const endY = centerY + pos.y

          return (
            <line
              key={carrier.id}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={1}
              strokeDasharray="4 8"
            />
          )
        })}
        
        {/* Active carrier connection lines */}
        {activeCarriers.map((carrier, index) => {
          const pos = CARRIER_POSITIONS[carrier.id]
          if (!pos || dimensions.width === 0) return null
          
          const startX = centerX
          const startY = centerY
          const endX = centerX + pos.x
          const endY = centerY + pos.y

          const isAwarded = carrier.status === "awarded"
          const isDropped = carrier.status === "dropped"
          const isActive = carrier.status === "active" || carrier.status === "warning"

          // Dropped carriers get faint gray static line
          if (isDropped) {
            return (
              <line
                key={carrier.id}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="rgba(0,0,0,0.12)"
                strokeWidth={1.5}
                strokeDasharray="4 8"
              />
            )
          }

          // Awarded carriers get solid green glowing line
          if (isAwarded) {
            return (
              <g key={carrier.id}>
                {/* Glow layer */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#00ff00"
                  strokeWidth={8}
                  strokeLinecap="round"
                  style={{ filter: "blur(6px)", opacity: 0.5 }}
                />
                {/* Solid green line */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#00ff00"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </g>
            )
          }

          // Active carriers get bright blue flowing dashed line
          if (isActive) {
            return (
              <g key={carrier.id}>
                {/* Subtle blue glow */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#3b82f6"
                  strokeWidth={6}
                  strokeLinecap="round"
                  style={{ filter: "blur(4px)", opacity: 0.3 }}
                />
                {/* Main blue dashed line with marching animation */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                  className={index % 2 === 0 ? "data-flow" : "data-flow-reverse"}
                />
              </g>
            )
          }

          return null
        })}
      </svg>

      {/* Central Memory Agent Node */}
      <motion.div
        className="absolute z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-foreground text-background shadow-2xl"
        style={{
          left: centerX - 56,
          top: centerY - 56,
          boxShadow: "0 0 60px rgba(0,0,0,0.2)",
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
            onClick={() => !carrier.isDummy && onNodeClick(carrier)}
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
  const isDummy = carrier.isDummy
  const isDropped = carrier.status === "dropped"
  const isPending = carrier.status === "pending"
  const isAwarded = carrier.status === "awarded"

  const getSentimentColor = () => {
    if (isAwarded) return "#00ff00"
    if (isDropped || isPending) return "rgba(0,0,0,0.15)"
    switch (carrier.sentiment) {
      case "happy": return "#00ff00"
      case "neutral": return "#ffaa00"
      case "frustrated": return "#ff6b6b"
      default: return "#00ff00"
    }
  }

  const getNodeStyles = (): React.CSSProperties => {
    if (isAwarded) {
      return {
        borderColor: "#00ff00",
        boxShadow: "0 0 30px rgba(0,255,0,0.4), 0 0 60px rgba(0,255,0,0.2)",
      }
    }
    if (isDropped) {
      return {
        borderColor: "rgba(0,0,0,0.1)",
        opacity: 0.5,
      }
    }
    if (isDummy || isPending) {
      return {
        borderColor: "rgba(0,0,0,0.08)",
        opacity: 0.35, // Increased from previous to be more visible
      }
    }
    if (carrier.status === "warning") {
      return {
        borderColor: "#ff6b6b",
        boxShadow: "0 0 20px rgba(255,107,107,0.3)",
      }
    }
    return {
      borderColor: "rgba(0,0,0,0.12)",
    }
  }

  const nodeStyles = getNodeStyles()

  return (
    <motion.div
      className={`absolute z-20 ${isDummy || isDropped || isPending ? "cursor-default" : "cursor-pointer"}`}
      style={{
        left: position.x - 100,
        top: position.y - 50,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      whileHover={{ scale: isDummy || isDropped || isPending ? 1 : 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
    >
      <motion.div
        className="relative flex w-[200px] flex-col gap-2 rounded-xl border-2 bg-card p-4 transition-shadow"
        style={nodeStyles}
        animate={isAwarded ? {
          boxShadow: [
            "0 0 30px rgba(0,255,0,0.4), 0 0 60px rgba(0,255,0,0.2)",
            "0 0 40px rgba(0,255,0,0.6), 0 0 80px rgba(0,255,0,0.3)",
            "0 0 30px rgba(0,255,0,0.4), 0 0 60px rgba(0,255,0,0.2)",
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: isAwarded ? Infinity : 0 }}
      >
        {/* Sentiment Indicator - only for non-dummy active carriers */}
        {!isDummy && !isPending && !isDropped && (
          <motion.div
            className="absolute -right-1 -top-1 h-3 w-3 rounded-full"
            style={{ backgroundColor: getSentimentColor() }}
            animate={carrier.sentiment === "frustrated" ? {
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            } : {}}
            transition={{ duration: 0.8, repeat: carrier.sentiment === "frustrated" ? Infinity : 0 }}
          />
        )}

        {/* Dropped indicator - red dot for dropped carriers */}
        {isDropped && !isDummy && (
          <motion.div
            className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-destructive"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}

        {/* Header */}
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-md ${
            isDummy || isDropped || isPending
              ? "bg-muted text-muted-foreground" 
              : "bg-foreground text-background"
          }`}>
            {carrier.channel === "phone" ? (
              <Phone className="h-3.5 w-3.5" />
            ) : (
              <MessageSquare className="h-3.5 w-3.5" />
            )}
          </div>
          <div className={`flex-1 truncate text-sm font-semibold ${
            isDummy || isDropped || isPending ? "text-muted-foreground" : "text-foreground"
          }`}>
            {carrier.name}
          </div>
        </div>

        {/* Bid */}
        <div className="flex items-baseline gap-1">
          <motion.span
            key={`${carrier.id}-${carrier.bid}-${currentStep}`}
            className={`text-2xl font-bold tabular-nums ${
              isDummy || isPending ? "text-muted-foreground" : isDropped ? "text-muted-foreground line-through" : "text-foreground"
            }`}
            initial={!isDummy && !isPending ? { scale: 1.2, color: "#00ff00" } : {}}
            animate={!isDummy && !isPending ? { scale: 1, color: isDropped ? "var(--muted-foreground)" : "var(--foreground)" } : {}}
            transition={{ duration: 0.4 }}
          >
            {isDummy || isPending ? "—" : `€${carrier.bid.toLocaleString()}`}
          </motion.span>
        </div>

        {/* No status badges for awarded - relying on green glow only */}
        {(isPending || isDummy) && (
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-muted px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Pending
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
