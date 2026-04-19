"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowDownCircle, Gauge, TrendingDown } from "lucide-react"

interface RightSidebarProps {
  agentAggression: number
  onAggressionChange: (value: number) => void
  marketFloor: string
  onMarketFloorChange: (value: string) => void
}

export function RightSidebar({
  agentAggression,
  onAggressionChange,
  marketFloor,
  onMarketFloorChange,
}: RightSidebarProps) {
  return (
    <aside className="flex w-72 flex-col border-l border-border bg-card">
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">Auction Controls</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Manage auction parameters</p>
      </div>
      
      <div className="flex-1 space-y-6 p-4">
        {/* Agent Aggression Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="size-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">
                Agent Aggression
              </label>
            </div>
            <span className="text-sm font-semibold text-accent">{agentAggression}%</span>
          </div>
          <Slider
            value={[agentAggression]}
            onValueChange={(value) => onAggressionChange(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Higher values make agents bid more aggressively
          </p>
        </div>

        {/* Market Floor Dropdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="size-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              Market Floor
            </label>
          </div>
          <Select value={marketFloor} onValueChange={onMarketFloorChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select floor type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dynamic">Dynamic Floor</SelectItem>
              <SelectItem value="fixed">Fixed Floor (€750)</SelectItem>
              <SelectItem value="aggressive">Aggressive (€600)</SelectItem>
              <SelectItem value="conservative">Conservative (€900)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Minimum acceptable bid threshold
          </p>
        </div>

        {/* Price Drop Timer */}
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Next Price Drop</span>
            <span className="text-sm font-semibold text-foreground">0:12</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full w-4/5 rounded-full bg-accent transition-all" />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Round Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Lowest Bid</p>
              <p className="text-lg font-semibold text-foreground">€820</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Avg Bid</p>
              <p className="text-lg font-semibold text-foreground">€892</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-semibold text-emerald-600">6</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-xs text-muted-foreground">Dropped</p>
              <p className="text-lg font-semibold text-destructive">2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <Button variant="outline" className="w-full gap-2">
          <ArrowDownCircle className="size-4" />
          Force Drop
        </Button>
      </div>
    </aside>
  )
}
