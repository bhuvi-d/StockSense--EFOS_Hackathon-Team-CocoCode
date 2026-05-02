"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"

export function SentimentCard() {
  const { data } = useAnalysis()
  
  const score = data?.sentiment_score ?? 0
  const label = data?.sentiment_label ?? "Neutral"
  const confidence = data?.confidence ?? 0
  const reviewCount = data?.reviewCount ?? 0
  
  const Icon = score > 0.15 ? TrendingUp : score < -0.15 ? TrendingDown : Minus
  const colorClass = score > 0.15 ? "text-emerald-500" : score < -0.15 ? "text-red-500" : "text-zinc-500"
  const scoreColorClass = score > 0.15 ? "text-emerald-600 dark:text-emerald-400" : score < -0.15 ? "text-red-600 dark:text-red-400" : "text-zinc-600 dark:text-zinc-400"
  const barColor = score > 0.15 ? "bg-emerald-500" : score < -0.15 ? "bg-red-500" : "bg-zinc-500"

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
        <Icon className={`h-4 w-4 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${scoreColorClass}`}>
          {score > 0 ? "+" : ""}{score.toFixed(2)}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
            <span>Confidence</span>
            <span>{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${confidence * 100}%` }} />
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Based on {reviewCount} customer review{reviewCount !== 1 ? "s" : ""}</p>
        </div>
      </CardContent>
    </Card>
  )
}
