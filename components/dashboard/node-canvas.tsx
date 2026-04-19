"use client"

import { useMemo } from "react"
import { CarrierNode, MemoryNode } from "./agent-node"

interface NodePosition {
  x: number
  y: number
}

interface CarrierData {
  id: string
  name: string
  bid: number
  status: "active" | "selected" | "warning" | "dropped"
  position: NodePosition
}

const carriers: CarrierData[] = [
  { id: "1", name: "FastFreight", bid: 900, status: "active", position: { x: 15, y: 20 } },
  { id: "2", name: "EuroHaul", bid: 875, status: "selected", position: { x: 75, y: 15 } },
  { id: "3", name: "SwiftLogistics", bid: 820, status: "selected", position: { x: 85, y: 45 } },
  { id: "4", name: "TransConnect", bid: 950, status: "warning", position: { x: 80, y: 75 } },
  { id: "5", name: "CargoMasters", bid: 885, status: "active", position: { x: 20, y: 75 } },
  { id: "6", name: "PrimeShip", bid: 840, status: "active", position: { x: 10, y: 50 } },
  { id: "7", name: "Atlas Transport", bid: 0, status: "dropped", position: { x: 25, y: 45 } },
  { id: "8", name: "NordEx", bid: 865, status: "active", position: { x: 70, y: 85 } },
]

const centerPosition = { x: 50, y: 50 }

function generateBezierPath(from: NodePosition, to: NodePosition): string {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const cx1 = from.x + dx * 0.4
  const cy1 = from.y
  const cx2 = to.x - dx * 0.4
  const cy2 = to.y
  
  return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`
}

export function NodeCanvas() {
  const connections = useMemo(() => {
    return carriers
      .filter(c => c.status !== "dropped")
      .map(carrier => ({
        id: carrier.id,
        path: generateBezierPath(carrier.position, centerPosition),
        isActive: carrier.status === "selected",
      }))
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {/* Dotted Grid Pattern */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-border" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>

      {/* Connection Lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {connections.map(conn => (
          <path
            key={conn.id}
            d={conn.path}
            fill="none"
            stroke={conn.isActive ? "oklch(0.62 0.18 250)" : "oklch(0.85 0.01 250)"}
            strokeWidth={conn.isActive ? "0.15" : "0.1"}
            strokeDasharray={conn.isActive ? "none" : "0.5 0.3"}
            className="transition-all duration-300"
          />
        ))}
      </svg>

      {/* Center Memory Agent Node */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 10 }}
      >
        <MemoryNode />
      </div>

      {/* Carrier Nodes */}
      {carriers.map(carrier => (
        <div
          key={carrier.id}
          className="absolute"
          style={{
            left: `${carrier.position.x}%`,
            top: `${carrier.position.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <CarrierNode
            name={carrier.name}
            bid={carrier.bid}
            status={carrier.status}
          />
        </div>
      ))}

      {/* Canvas Labels */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full border-2 border-accent bg-accent/20" />
          <span className="text-xs text-muted-foreground">Active Bid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full border-2 border-amber-400 bg-amber-50" />
          <span className="text-xs text-muted-foreground">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full border-2 border-destructive bg-destructive/20" />
          <span className="text-xs text-muted-foreground">Dropped</span>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground">
          <span className="text-lg leading-none">+</span>
        </button>
        <button className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground">
          <span className="text-lg leading-none">−</span>
        </button>
      </div>
    </div>
  )
}
