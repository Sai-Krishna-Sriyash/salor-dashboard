"use client"

import { motion } from "framer-motion"
import { Sailboat } from "lucide-react"

interface DemoControlsProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
}

export function DemoControls({ currentStep, totalSteps, onNext }: DemoControlsProps) {
  return (
    <>
      {/* Clean Top Brand Bar */}
      <motion.div
        className="absolute left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 shadow-lg backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground">
          <Sailboat className="h-4 w-4 text-background" />
        </div>
        <span className="text-sm font-bold tracking-tight text-foreground">Salor</span>
      </motion.div>

      {/* Stealth Clicker - Tiny Invisible Dot Bottom Right */}
      <button
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className="fixed bottom-4 right-4 z-[100] h-3 w-3 rounded-full bg-black/10 transition-all hover:bg-black/20 disabled:opacity-0"
        style={{ cursor: currentStep === totalSteps - 1 ? 'default' : 'pointer' }}
        aria-label="Advance demo"
      />
    </>
  )
}
