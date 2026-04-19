"use client"

import { cn } from "@/lib/utils"
import { AlertTriangle, Brain, Truck, XCircle } from "lucide-react"

interface CarrierNodeProps {
  name: string
  bid: number
  status: "active" | "selected" | "warning" | "dropped"
}

export function CarrierNode({ name, bid, status }: CarrierNodeProps) {
  const isDropped = status === "dropped"
  const isSelected = status === "selected"
  const isWarning = status === "warning"

  return (
    <div
      className={cn(
        "group relative flex min-w-[140px] flex-col rounded-lg border bg-card p-3 shadow-sm transition-all duration-200",
        isSelected && "border-accent bg-accent/5 shadow-md shadow-accent/10",
        isWarning && "border-amber-400 bg-amber-50",
        isDropped && "border-destructive/50 bg-destructive/5 opacity-60",
        !isSelected && !isWarning && !isDropped && "border-border hover:shadow-md"
      )}
    >
      {/* Warning Icon */}
      {isWarning && (
        <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-amber-500 text-white">
          <AlertTriangle className="size-3" />
        </div>
      )}

      {/* Dropped Icon */}
      {isDropped && (
        <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-white">
          <XCircle className="size-3" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-md",
            isSelected && "bg-accent text-accent-foreground",
            isWarning && "bg-amber-500 text-white",
            isDropped && "bg-muted text-muted-foreground",
            !isSelected && !isWarning && !isDropped && "bg-muted text-muted-foreground"
          )}
        >
          <Truck className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "text-xs font-medium",
            isDropped ? "text-muted-foreground line-through" : "text-foreground"
          )}>
            {name}
          </span>
          <span className="text-[10px] text-muted-foreground">Carrier Agent</span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {isDropped ? "Dropped" : "Current Bid"}
        </span>
        <span
          className={cn(
            "text-sm font-semibold",
            isSelected && "text-accent",
            isWarning && "text-amber-600",
            isDropped && "text-destructive",
            !isSelected && !isWarning && !isDropped && "text-foreground"
          )}
        >
          {isDropped ? "—" : `€${bid}`}
        </span>
      </div>

      {/* Active Pulse Indicator */}
      {isSelected && (
        <div className="absolute -left-1 top-1/2 -translate-y-1/2">
          <div className="size-2 animate-pulse rounded-full bg-accent" />
        </div>
      )}
    </div>
  )
}

export function MemoryNode() {
  return (
    <div className="relative flex min-w-[180px] flex-col rounded-xl border-2 border-primary bg-card p-4 shadow-lg">
      {/* Glow Effect */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-primary/10 blur-xl" />
      
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Brain className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Memory Agent</span>
          <span className="text-xs text-muted-foreground">Central Orchestrator</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-muted p-2">
          <p className="text-[10px] text-muted-foreground">Processing</p>
          <p className="text-sm font-semibold text-foreground">8 Bids</p>
        </div>
        <div className="rounded-md bg-muted p-2">
          <p className="text-[10px] text-muted-foreground">Round</p>
          <p className="text-sm font-semibold text-foreground">#3</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-md bg-emerald-50 px-2 py-1.5">
        <div className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
        <span className="text-xs font-medium text-emerald-700">Auction Active</span>
      </div>
    </div>
  )
}
