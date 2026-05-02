import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function InsightsCard() {
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
            <li>Excellent sound quality and bass response</li>
            <li>Long battery life (up to 30 hours)</li>
            <li>Comfortable for long wearing sessions</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-orange-600 dark:text-orange-400 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" /> Key Issues
          </h4>
          <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
            <li>Charging cable is too short</li>
            <li>App connectivity can be flaky on Android</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
