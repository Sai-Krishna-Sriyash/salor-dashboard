"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Phone, MessageSquare } from "lucide-react"
import type { CarrierNode } from "@/lib/types"

interface FloatingLeaderboardProps {
  carriers: CarrierNode[]
}

export function FloatingLeaderboard({ carriers }: FloatingLeaderboardProps) {
  // Sort carriers by bid (lowest first = best), then by status (winner first)
  const sortedCarriers = [...carriers].sort((a, b) => {
    if (a.status === "winner") return -1
    if (b.status === "winner") return 1
    if (a.status === "dropped") return 1
    if (b.status === "dropped") return -1
    return a.bid - b.bid
  })

  return (
    <motion.div
      className="absolute bottom-6 left-6 z-30 w-80 overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-4 shadow-2xl backdrop-blur-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-black" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-black">
          Live Rankings
        </h3>
      </div>

      {/* Leaderboard Rows */}
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
              className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
                carrier.status === "winner" 
                  ? "bg-[#00ff00]/20" 
                  : carrier.status === "dropped"
                    ? "bg-black/5 opacity-50"
                    : "bg-white/50"
              }`}
            >
              {/* Rank */}
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                index === 0 && carrier.status !== "dropped"
                  ? "bg-black text-white"
                  : "bg-black/10 text-black/60"
              }`}>
                {index + 1}
              </div>

              {/* Channel Icon */}
              <div className={`flex h-7 w-7 items-center justify-center rounded-md ${
                carrier.status === "winner" ? "bg-[#00ff00] text-black" : "bg-black text-white"
              }`}>
                {carrier.channel === "phone" ? (
                  <Phone className="h-3.5 w-3.5" />
                ) : (
                  <MessageSquare className="h-3.5 w-3.5" />
                )}
              </div>

              {/* Name */}
              <div className={`flex-1 truncate text-sm font-medium ${
                carrier.status === "dropped" ? "text-black/40 line-through" : "text-black"
              }`}>
                {carrier.name.split(" ")[0]}
              </div>

              {/* Bid */}
              <motion.div
                key={`${carrier.id}-bid-${carrier.bid}`}
                className={`text-sm font-bold tabular-nums ${
                  carrier.status === "winner" 
                    ? "text-[#00aa00]" 
                    : carrier.status === "dropped"
                      ? "text-black/40"
                      : "text-black"
                }`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                €{carrier.bid.toLocaleString()}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
