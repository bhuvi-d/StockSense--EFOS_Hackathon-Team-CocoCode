"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import { useAnalysis } from "@/context/analysis-context"

export function ExplanationCard() {
  const { data } = useAnalysis()
  
  const explanation = data?.explanation ?? "Analysis in progress or data unavailable."

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 col-span-full">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Info className="h-5 w-5 text-indigo-500" />
        <CardTitle className="text-lg font-bold">Why This Decision</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
          "{explanation}"
        </p>
      </CardContent>
    </Card>
  )
}
