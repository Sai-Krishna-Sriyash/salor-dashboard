"use client"

import { Truck, Trophy } from "lucide-react"

interface CarrierRanking {
  rank: number
  name: string
  currentBid: number
  trustRating: number
  salesScore: number
}

const leaderboardData: CarrierRanking[] = [
  { rank: 1, name: "EuroHaul", currentBid: 875, trustRating: 5, salesScore: 98 },
  { rank: 2, name: "SwiftLogistics", currentBid: 820, trustRating: 4, salesScore: 94 },
  { rank: 3, name: "CargoMasters", currentBid: 885, trustRating: 4, salesScore: 91 },
  { rank: 4, name: "NordEx", currentBid: 865, trustRating: 5, salesScore: 87 },
  { rank: 5, name: "FastFreight", currentBid: 900, trustRating: 3, salesScore: 82 },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center gap-1.5">
        <Trophy className="size-4 text-amber-500" />
        <span className="font-semibold text-foreground">1</span>
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex items-center gap-1.5">
        <Trophy className="size-4 text-slate-400" />
        <span className="font-semibold text-foreground">2</span>
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="flex items-center gap-1.5">
        <Trophy className="size-4 text-amber-700" />
        <span className="font-semibold text-foreground">3</span>
      </div>
    )
  }
  return <span className="pl-5 font-medium text-muted-foreground">{rank}</span>
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`size-3.5 ${star <= rating ? "text-blue-500" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function CarrierLeaderboard() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Carrier Leaderboard (Top 5)</h3>
        <span className="text-xs text-muted-foreground">Ranked by Sales Score</span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">#</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Carrier Name</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Current Bid</th>
              <th className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">Trust Rating</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground">Sales Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((carrier, index) => (
              <tr
                key={carrier.rank}
                className={`border-b border-border transition-colors last:border-b-0 ${
                  index === 0 ? "bg-blue-50/50" : "hover:bg-muted/20"
                }`}
              >
                <td className="px-4 py-3">
                  <RankBadge rank={carrier.rank} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{carrier.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-foreground">€{carrier.currentBid}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <StarRating rating={carrier.trustRating} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-bold text-foreground">{carrier.salesScore}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
