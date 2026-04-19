"use client"

import { Button } from "@/components/ui/button"
import { ChevronRight, Play, Zap } from "lucide-react"

export function TopNav() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="size-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">Thunderdome</span>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Live Auction</span>
        <div className="ml-4 flex items-center gap-2">
          <div className="size-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-600">Live</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
          <span className="text-xs text-muted-foreground">Active Carriers</span>
          <span className="text-sm font-semibold text-foreground">8</span>
        </div>
        <Button className="gap-2">
          <Play className="size-4" />
          Start Auction
        </Button>
      </div>
    </header>
  )
}
