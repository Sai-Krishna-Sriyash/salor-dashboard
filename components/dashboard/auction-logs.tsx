"use client"

import { useEffect, useRef } from "react"

type EventType = "BID UPDATE" | "CARRIER DROPPED" | "SYSTEM WHISPER"

interface LogEntry {
  id: string
  timestamp: string
  event: EventType
  message: string
}

const dummyLogs: LogEntry[] = [
  { id: "1", timestamp: "14:32:07", event: "SYSTEM WHISPER", message: "Auction started for Route #4821 (Berlin → Madrid)" },
  { id: "2", timestamp: "14:32:12", event: "BID UPDATE", message: "Carrier 'EuroHaul' submitted initial bid of €950" },
  { id: "3", timestamp: "14:32:18", event: "BID UPDATE", message: "Carrier 'SwiftLogistics' submitted bid of €920" },
  { id: "4", timestamp: "14:32:24", event: "BID UPDATE", message: "Carrier 'FastFreight' dropped bid to €900" },
  { id: "5", timestamp: "14:32:31", event: "SYSTEM WHISPER", message: "Whisper alert sent to all active agents" },
  { id: "6", timestamp: "14:32:38", event: "BID UPDATE", message: "Carrier 'CargoMasters' submitted bid of €885" },
  { id: "7", timestamp: "14:32:45", event: "BID UPDATE", message: "Carrier 'EuroHaul' lowered bid to €875" },
  { id: "8", timestamp: "14:32:52", event: "CARRIER DROPPED", message: "Carrier 'Atlas Transport' withdrew from auction" },
  { id: "9", timestamp: "14:32:59", event: "BID UPDATE", message: "Carrier 'NordEx' submitted bid of €865" },
  { id: "10", timestamp: "14:33:05", event: "SYSTEM WHISPER", message: "Price floor approaching - 3 carriers within range" },
  { id: "11", timestamp: "14:33:12", event: "BID UPDATE", message: "Carrier 'PrimeShip' submitted bid of €840" },
  { id: "12", timestamp: "14:33:19", event: "BID UPDATE", message: "Carrier 'SwiftLogistics' dropped bid to €820" },
  { id: "13", timestamp: "14:33:26", event: "SYSTEM WHISPER", message: "Memory Agent analyzing bid patterns..." },
]

function getEventColor(event: EventType): string {
  switch (event) {
    case "BID UPDATE":
      return "text-green-600"
    case "CARRIER DROPPED":
      return "text-red-600"
    case "SYSTEM WHISPER":
      return "text-blue-600"
    default:
      return "text-muted-foreground"
  }
}

export function AuctionLogs() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Live Auction Logs</h3>
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto bg-slate-100/50 p-3 font-mono text-xs"
      >
        <div className="space-y-1.5">
          {dummyLogs.map((log) => (
            <div key={log.id} className="flex gap-2">
              <span className="shrink-0 text-muted-foreground">[{log.timestamp}]</span>
              <span className={`shrink-0 font-semibold ${getEventColor(log.event)}`}>
                [{log.event}]
              </span>
              <span className="text-foreground">- {log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
