"use client"

import * as React from "react"

export type SentimentLabel = "Positive" | "Neutral" | "Negative"
export type RiskLabel = "Low" | "Medium" | "High" | "Critical"

export interface AnalysisData {
  productName: string
  sentiment_score: number
  sentiment_label: SentimentLabel
  issues: string[]
  strengths: string[]
  improvements: string[]
  confidence: number
  demand: number
  reorder: number
  risk: RiskLabel
  email: string
  restock_plan: string
  explanation: string
}

interface AnalysisContextType {
  data: AnalysisData | null
  setData: (data: AnalysisData | null) => void
}

const AnalysisContext = React.createContext<AnalysisContextType | undefined>(undefined)

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<AnalysisData | null>(null)

  return (
    <AnalysisContext.Provider value={{ data, setData }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const context = React.useContext(AnalysisContext)
  if (context === undefined) {
    throw new Error("useAnalysis must be used within an AnalysisProvider")
  }
  return context
}
