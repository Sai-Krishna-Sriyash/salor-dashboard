"use client"

import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Sailboat } from "lucide-react"
import { NetworkGraph } from "@/components/salor/network-graph"
import { FloatingLeaderboard } from "@/components/salor/floating-leaderboard"
import { TakeoverModal } from "@/components/salor/takeover-modal"
import { DemoControls } from "@/components/salor/demo-controls"
import { RightSidebar } from "@/components/salor/right-sidebar"
import type { CarrierNode, DemoState } from "@/lib/types"

// Dummy carriers to populate the canvas
const DUMMY_CARRIERS: CarrierNode[] = [
  { id: "dummy1", name: "TransAlpha Freight", channel: "sms", bid: 0, sentiment: "neutral", status: "pending", isDummy: true },
  { id: "dummy2", name: "Nordic Express", channel: "phone", bid: 0, sentiment: "neutral", status: "pending", isDummy: true },
  { id: "dummy3", name: "MediterraneanLog", channel: "sms", bid: 0, sentiment: "neutral", status: "pending", isDummy: true },
  { id: "dummy4", name: "Baltic Shipping", channel: "phone", bid: 0, sentiment: "neutral", status: "pending", isDummy: true },
  { id: "dummy5", name: "Alpine Cargo", channel: "sms", bid: 0, sentiment: "neutral", status: "pending", isDummy: true },
  { id: "dummy6", name: "Atlantic Movers", channel: "phone", bid: 0, sentiment: "neutral", status: "pending", isDummy: true },
]

// New Ping-Pong Bidding Script (6 states: 0-5)
const DEMO_STATES: DemoState[] = [
  // State 0: Memory Agent idle, only dummy nodes present
  {
    step: 0,
    carriers: [...DUMMY_CARRIERS],
    transcript: [],
  },
  // State 1: SpeedLogistics connects with €1650 (Rank 1)
  {
    step: 1,
    carriers: [
      { id: "speed", name: "SpeedLogistics GmbH", channel: "phone", bid: 1650, sentiment: "happy", status: "active" },
      ...DUMMY_CARRIERS,
    ],
    transcript: [
      { sender: "System", message: "New carrier connected: SpeedLogistics GmbH", time: "10:31:02" },
      { sender: "SpeedLogistics", message: "Opening bid at €1,650", time: "10:31:05" },
    ],
  },
  // State 2: EuroCarrier connects with €1400 (jumps to Rank 1, SpeedLogistics drops to Rank 2)
  {
    step: 2,
    carriers: [
      { id: "speed", name: "SpeedLogistics GmbH", channel: "phone", bid: 1650, sentiment: "neutral", status: "active" },
      { id: "euro", name: "EuroCarrier Solutions", channel: "sms", bid: 1400, sentiment: "happy", status: "active" },
      ...DUMMY_CARRIERS,
    ],
    transcript: [
      { sender: "System", message: "New carrier connected: SpeedLogistics GmbH", time: "10:31:02" },
      { sender: "SpeedLogistics", message: "Opening bid at €1,650", time: "10:31:05" },
      { sender: "System", message: "New carrier connected: EuroCarrier Solutions", time: "10:32:15" },
      { sender: "EuroCarrier", message: "Entering market at €1,400", time: "10:32:18" },
      { sender: "System", message: "EuroCarrier now leads the auction", time: "10:32:19" },
    ],
  },
  // State 3: SpeedLogistics updates to €1350 (jumps back to Rank 1)
  {
    step: 3,
    carriers: [
      { id: "speed", name: "SpeedLogistics GmbH", channel: "phone", bid: 1350, sentiment: "happy", status: "active" },
      { id: "euro", name: "EuroCarrier Solutions", channel: "sms", bid: 1400, sentiment: "neutral", status: "active" },
      ...DUMMY_CARRIERS,
    ],
    transcript: [
      { sender: "System", message: "New carrier connected: SpeedLogistics GmbH", time: "10:31:02" },
      { sender: "SpeedLogistics", message: "Opening bid at €1,650", time: "10:31:05" },
      { sender: "System", message: "New carrier connected: EuroCarrier Solutions", time: "10:32:15" },
      { sender: "EuroCarrier", message: "Entering market at €1,400", time: "10:32:18" },
      { sender: "System", message: "EuroCarrier now leads the auction", time: "10:32:19" },
      { sender: "SpeedLogistics", message: "Dropping to €1,350 to regain lead", time: "10:33:02" },
      { sender: "System", message: "SpeedLogistics now leads the auction", time: "10:33:03" },
    ],
  },
  // State 4: EuroCarrier matches at €1350 (tie)
  {
    step: 4,
    carriers: [
      { id: "speed", name: "SpeedLogistics GmbH", channel: "phone", bid: 1350, sentiment: "neutral", status: "active" },
      { id: "euro", name: "EuroCarrier Solutions", channel: "sms", bid: 1350, sentiment: "happy", status: "active" },
      ...DUMMY_CARRIERS,
    ],
    transcript: [
      { sender: "System", message: "New carrier connected: SpeedLogistics GmbH", time: "10:31:02" },
      { sender: "SpeedLogistics", message: "Opening bid at €1,650", time: "10:31:05" },
      { sender: "System", message: "New carrier connected: EuroCarrier Solutions", time: "10:32:15" },
      { sender: "EuroCarrier", message: "Entering market at €1,400", time: "10:32:18" },
      { sender: "System", message: "EuroCarrier now leads the auction", time: "10:32:19" },
      { sender: "SpeedLogistics", message: "Dropping to €1,350 to regain lead", time: "10:33:02" },
      { sender: "System", message: "SpeedLogistics now leads the auction", time: "10:33:03" },
      { sender: "EuroCarrier", message: "Matching at €1,350", time: "10:33:45" },
      { sender: "System", message: "Tie at €1,350 - evaluating carrier profiles...", time: "10:33:46" },
    ],
  },
  // State 5: EuroCarrier is awarded (green glow), SpeedLogistics dropped (gray + red indicator)
  {
    step: 5,
    carriers: [
      { id: "speed", name: "SpeedLogistics GmbH", channel: "phone", bid: 1350, sentiment: "neutral", status: "dropped" },
      { id: "euro", name: "EuroCarrier Solutions", channel: "sms", bid: 1350, sentiment: "happy", status: "awarded" },
      ...DUMMY_CARRIERS,
    ],
    transcript: [
      { sender: "System", message: "New carrier connected: SpeedLogistics GmbH", time: "10:31:02" },
      { sender: "SpeedLogistics", message: "Opening bid at €1,650", time: "10:31:05" },
      { sender: "System", message: "New carrier connected: EuroCarrier Solutions", time: "10:32:15" },
      { sender: "EuroCarrier", message: "Entering market at €1,400", time: "10:32:18" },
      { sender: "System", message: "EuroCarrier now leads the auction", time: "10:32:19" },
      { sender: "SpeedLogistics", message: "Dropping to €1,350 to regain lead", time: "10:33:02" },
      { sender: "System", message: "SpeedLogistics now leads the auction", time: "10:33:03" },
      { sender: "EuroCarrier", message: "Matching at €1,350", time: "10:33:45" },
      { sender: "System", message: "Tie at €1,350 - evaluating carrier profiles...", time: "10:33:46" },
      { sender: "AI", message: "EuroCarrier selected based on reliability score (98.2%)", time: "10:34:12" },
      { sender: "System", message: "AUCTION COMPLETE: EuroCarrier Solutions awarded at €1,350", time: "10:34:15" },
    ],
  },
]

export default function SalorAuction() {
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierNode | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [agentAggression, setAgentAggression] = useState(65)
  const [priceFloorTolerance, setPriceFloorTolerance] = useState(40)

  const currentState = DEMO_STATES[currentStep]

  const handleBeginAuction = useCallback(() => {
    setIsOnboarded(true)
  }, [])

  const handleNextStep = useCallback(() => {
    const nextStep = Math.min(currentStep + 1, DEMO_STATES.length - 1)
    setCurrentStep(nextStep)
    
    const nextState = DEMO_STATES[nextStep]
    if (nextState.autoOpenModal) {
      const carrier = nextState.carriers.find(c => c.id === nextState.autoOpenModal)
      if (carrier) {
        setSelectedCarrier(carrier)
        setIsModalOpen(true)
      }
    }
  }, [currentStep])

  const handleNodeClick = useCallback((carrier: CarrierNode) => {
    if (carrier.isDummy) return
    setSelectedCarrier(carrier)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedCarrier(null)
  }, [])

  const handleInjectOverride = useCallback((message: string) => {
    console.log("[Salor] Human override injected:", message)
  }, [])

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-background">
      {/* Pre-Analysis Onboarding Overlay */}
      <AnimatePresence>
        {!isOnboarded && (
          <>
            {/* Blur overlay for entire dashboard */}
            <motion.div
              className="absolute inset-0 z-40 backdrop-blur-md bg-white/30"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Glassmorphism Popup */}
            <motion.div
              className="absolute inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative max-w-lg mx-4 p-8 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Salor Branding */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Sailboat className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                  <span className="text-xl font-medium tracking-tight text-foreground">SALOR</span>
                </div>
                
                {/* Pre-Analysis Briefing */}
                <div className="space-y-4 mb-8">
                  <h2 className="text-sm font-medium tracking-widest text-muted-foreground text-center">
                    PRE-ANALYSIS BRIEFING
                  </h2>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 flex-shrink-0" />
                      <span>Initializing AI memory engines.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 flex-shrink-0" />
                      <span>Synthesizing data graph from designated provider networks.</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 flex-shrink-0" />
                      <span>Assessing optimal carrier profiles for route parameters.</span>
                    </p>
                  </div>
                </div>
                
                {/* Begin Button */}
                <button
                  onClick={handleBeginAuction}
                  className="w-full py-3 px-6 rounded-lg bg-foreground text-background font-medium text-sm tracking-wide hover:bg-foreground/90 transition-colors"
                >
                  BEGIN AUCTION ORCHESTRATION
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Canvas Area */}
      <div className="relative flex-1">
        {/* Dotted Grid Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Demo Controls - Top Center Brand + Stealth Clicker */}
        <DemoControls 
          currentStep={currentStep}
          totalSteps={DEMO_STATES.length}
          onNext={handleNextStep}
        />

        {/* Main Network Graph */}
        <NetworkGraph 
          carriers={currentState.carriers}
          onNodeClick={handleNodeClick}
          currentStep={currentStep}
        />

        {/* Floating Active Market Bids - Bottom Left */}
        <FloatingLeaderboard carriers={currentState.carriers} />
      </div>

      {/* Right Sidebar - Engine Configuration */}
      <RightSidebar
        agentAggression={agentAggression}
        onAggressionChange={setAgentAggression}
        priceFloorTolerance={priceFloorTolerance}
        onPriceFloorToleranceChange={setPriceFloorTolerance}
        carriers={currentState.carriers}
      />

      {/* Takeover Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCarrier && (
          <TakeoverModal
            carrier={selectedCarrier}
            transcript={currentState.transcript}
            humanOverride={currentState.humanOverride}
            onClose={handleCloseModal}
            onInjectOverride={handleInjectOverride}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
