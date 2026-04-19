"use client"

import { cn } from "@/lib/utils"
import { 
  LayoutGrid, 
  Play, 
  TrendingUp,
  Settings,
  History,
  Users
} from "lucide-react"

interface LeftSidebarProps {
  activeItem: string
  onItemClick: (item: string) => void
}

const navItems = [
  { id: "editor", label: "Editor", icon: LayoutGrid },
  { id: "runs", label: "Runs", icon: Play },
  { id: "active-bids", label: "Active Bids", icon: TrendingUp },
  { id: "carriers", label: "Carriers", icon: Users },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
]

export function LeftSidebar({ activeItem, onItemClick }: LeftSidebarProps) {
  return (
    <aside className="flex w-56 flex-col border-r border-border bg-card">
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                  {item.id === "active-bids" && (
                    <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                      6
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-border p-3">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-foreground">System Status</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">All agents operational</p>
        </div>
      </div>
    </aside>
  )
}
