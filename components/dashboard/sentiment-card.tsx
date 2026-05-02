import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function SentimentCard() {
  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
        <TrendingUp className="h-4 w-4 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">+0.65</div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Positive</p>
      </CardContent>
    </Card>
  )
}
