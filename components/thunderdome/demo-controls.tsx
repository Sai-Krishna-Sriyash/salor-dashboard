"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Zap } from "lucide-react"

interface DemoControlsProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrev: () => void
}

export function DemoControls({ currentStep, totalSteps, onNext, onPrev }: DemoControlsProps) {
  const stepLabels = [
    "Initial Bids",
    "Price Drop #1",
    "Price Drop #2",
    "Human Intervention",
    "Final Decision",
  ]

  return (
    <motion.div
      className="absolute left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-black/10 bg-white/80 px-2 py-1.5 shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-1.5 border-r border-black/10 pr-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-bold tracking-tight text-black">Thunderdome</span>
      </div>

      {/* Previous Button */}
      <button
        onClick={onPrev}
        disabled={currentStep === 0}
        className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-black/5 disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              index === currentStep 
                ? "w-4 bg-black" 
                : index < currentStep 
                  ? "bg-black/40" 
                  : "bg-black/15"
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className="group flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-black/80 disabled:opacity-30"
      >
        <span className="hidden sm:inline">{currentStep === totalSteps - 1 ? "Complete" : "Next"}</span>
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Current Step Label */}
      <div className="hidden border-l border-black/10 pl-3 sm:block">
        <span className="text-xs font-medium text-black/50">
          Step {currentStep + 1}: {stepLabels[currentStep]}
        </span>
      </div>
    </motion.div>
  )
}
