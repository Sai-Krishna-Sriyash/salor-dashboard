"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Phone, MessageSquare } from "lucide-react"
import type { CarrierNode } from "@/lib/types"

interface FloatingLeaderboardProps {
  carriers: CarrierNode[]
}

export function FloatingLeaderboard({ carriers }: FloatingLeaderboardProps) {
  // Filter out dummy/pending carriers and sort by bid (lowest first = best)
  const activeCarriers = carriers.filter(c => !c.isDummy && c.status !== "pending")
  const sortedCarriers = [...activeCarriers].sort((a, b) => {
    // Awarded always first
    if (a.status === "awarded") return -1
    if (b.status === "awarded") return 1
    // Dropped always last
    if (a.status === "dropped") return 1
    if (b.status === "dropped") return -1
    // Sort by lowest bid
    return a.bid - b.bid
  })

  if (sortedCarriers.length === 0) {
    return (
      <motion.div
        className="absolute bottom-6 left-6 z-30 w-80 overflow-hidden rounded-xl border border-border bg-card/80 p-4 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Active Market Bids</h3>
        </div>
        <div className="py-6 text-center text-sm text-muted-foreground">
          Waiting for carriers to connect...
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="absolute bottom-6 left-6 z-30 w-80 overflow-hidden rounded-xl border border-border bg-card/80 p-4 shadow-2xl backdrop-blur-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">
          Active Market Bids
        </h3>
      </div>

      {/* Carrier Index Rows */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedCarriers.map((carrier, index) => (
            <motion.div
              key={carrier.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ 
                layout: { type: "spring", stiffness: 500, damping: 35 },
                opacity: { duration: 0.2 }
              }}
              className={`flex items-center gap-3 rounded-lg p-2.5 transition-colors ${
                carrier.status === "awarded" 
                  ? "bg-accent/15 ring-1 ring-accent/30" 
                  : carrier.status === "dropped"
                    ? "bg-muted/50 opacity-50"
                    : "bg-secondary/50"
              }`}
            >
              {/* Rank */}
              <div className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                index === 0 && carrier.status !== "dropped"
                  ? "bg-foreground text-background"
                  : "bg-border text-muted-foreground"
              }`}>
                {index + 1}
              </div>

              {/* Channel Icon */}
              <div className={`flex h-7 w-7 items-center justify-center rounded-md ${
                carrier.status === "awarded" 
                  ? "bg-accent text-foreground" 
                  : "bg-foreground text-background"
              }`}>
                {carrier.channel === "phone" ? (
                  <Phone className="h-3.5 w-3.5" />
                ) : (
                  <MessageSquare className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Name */}
              <div className={`flex-1 truncate text-sm font-medium ${
                carrier.status === "dropped" ? "text-muted-foreground line-through" : "text-foreground"
              }`}>
                {carrier.name.split(" ")[0]}
              </div>

              {/* Bid */}
              <motion.div
                key={`${carrier.id}-bid-${carrier.bid}`}
                className={`text-sm font-bold tabular-nums ${
                  carrier.status === "awarded" 
                    ? "text-accent" 
                    : carrier.status === "dropped"
                      ? "text-muted-foreground"
                      : "text-foreground"
                }`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                €{carrier.bid.toLocaleString()}
              </motion.div>

              {/* Status Badge - Only for Awarded */}
              {carrier.status === "awarded" && (
                <motion.span
                  className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-foreground"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Awarded
                </motion.span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-3 border-t border-border pt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Carrier Index</span>
          <span className="font-mono">{sortedCarriers.length} active</span>
        </div>
      </div>
    </motion.div>
  )
}
