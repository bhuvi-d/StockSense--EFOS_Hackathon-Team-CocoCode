import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Lightbulb } from "lucide-react"

type InsightsCardProps = {
  issues: string[]
  strengths: string[]
  improvements: string[]
}

export function InsightsCard({ issues, strengths, improvements }: InsightsCardProps) {
  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Customer Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Strengths
          </h4>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
            {strengths.length > 0 ? (
              strengths.map((strength, i) => <li key={i}>{strength}</li>)
            ) : (
              <li>No specific strengths identified</li>
            )}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-orange-600 dark:text-orange-400 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" /> Key Issues
          </h4>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
            {issues.length > 0 ? (
              issues.map((issue, i) => <li key={i}>{issue}</li>)
            ) : (
              <li>No specific issues identified</li>
            )}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" /> Improvements
          </h4>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
            {improvements.length > 0 ? (
              improvements.map((improvement, i) => <li key={i}>{improvement}</li>)
            ) : (
              <li>No specific improvements suggested</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
