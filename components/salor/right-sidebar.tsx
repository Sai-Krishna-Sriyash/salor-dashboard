"use client"

import { motion } from "framer-motion"
import { Settings2, Activity, Gauge, TrendingDown, Wifi, WifiOff } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import type { CarrierNode } from "@/lib/types"

interface RightSidebarProps {
  agentAggression: number
  onAggressionChange: (value: number) => void
  priceFloorTolerance: number
  onPriceFloorToleranceChange: (value: number) => void
  carriers: CarrierNode[]
}

export function RightSidebar({
  agentAggression,
  onAggressionChange,
  priceFloorTolerance,
  onPriceFloorToleranceChange,
  carriers,
}: RightSidebarProps) {
  const activeCarriers = carriers.filter(c => c.status === "active" || c.status === "warning" || c.status === "awarded")
  const droppedCarriers = carriers.filter(c => c.status === "dropped" || c.status === "pending")

  return (
    <motion.div
      className="flex h-full w-72 flex-col border-l border-border bg-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Settings2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">Engine Configuration</span>
      </div>

      {/* Sliders Section */}
      <div className="flex flex-col gap-6 p-4">
        {/* Agent Aggression */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Agent Aggression</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{agentAggression}%</span>
          </div>
          <Slider
            value={[agentAggression]}
            onValueChange={(v) => onAggressionChange(v[0])}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
        </div>

        {/* Price Floor Tolerance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Price Floor Tolerance</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{priceFloorTolerance}%</span>
          </div>
          <Slider
            value={[priceFloorTolerance]}
            onValueChange={(v) => onPriceFloorToleranceChange(v[0])}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Strict</span>
            <span>Flexible</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-border" />

      {/* Active Network Status */}
      <div className="flex-1 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Active Network Status</span>
        </div>

        <div className="space-y-2">
          {/* Connected Carriers */}
          <div className="rounded-lg border border-border bg-secondary/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Connected Carriers</span>
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3 text-accent" />
                <span className="text-xs font-mono text-accent">{activeCarriers.length}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {activeCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    carrier.status === "awarded"
                      ? "bg-accent/20 text-accent"
                      : carrier.status === "warning"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-foreground/10 text-foreground"
                  }`}
                >
                  {carrier.name.split(" ")[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Inactive/Pending */}
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Inactive / Pending</span>
              <div className="flex items-center gap-1">
                <WifiOff className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">{droppedCarriers.length}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {droppedCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {carrier.name.split(" ")[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-border p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-secondary/30 p-2 text-center">
            <div className="text-lg font-bold tabular-nums text-foreground">
              {carriers.filter(c => c.status !== "pending" && c.status !== "dropped").reduce((min, c) => Math.min(min, c.bid), Infinity).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground">Current Low</div>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-2 text-center">
            <div className="text-lg font-bold tabular-nums text-foreground">
              {carriers.length}
            </div>
            <div className="text-[10px] text-muted-foreground">Total Nodes</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
