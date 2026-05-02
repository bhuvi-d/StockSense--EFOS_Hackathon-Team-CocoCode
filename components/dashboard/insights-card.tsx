"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Lightbulb } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"

export function InsightsCard() {
  const { data } = useAnalysis()
  
  const strengths = data?.strengths ?? []
  const issues = data?.issues ?? []
  const improvements = data?.improvements ?? []

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Customer Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Key Strengths
          </h4>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5 pl-6 list-disc">
            {strengths.length > 0 ? strengths.map((s, i) => (
              <li key={i}>{s}</li>
            )) : <li>No significant strengths identified yet.</li>}
          </ul>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-orange-600 dark:text-orange-400 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" /> Top Issues
          </h4>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5 pl-6 list-disc">
            {issues.length > 0 ? issues.map((s, i) => (
              <li key={i}>{s}</li>
            )) : <li>No major issues detected in the reviews.</li>}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" /> Recommended Improvements
          </h4>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1.5 pl-6 list-disc">
            {improvements.length > 0 ? improvements.map((s, i) => (
              <li key={i}>{s}</li>
            )) : <li>Monitor feedback for future optimization opportunities.</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
