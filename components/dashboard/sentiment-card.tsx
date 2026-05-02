import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

type SentimentCardProps = {
  sentiment_score: number
  sentiment_label: "Positive" | "Neutral" | "Negative"
}

export function SentimentCard({ sentiment_score, sentiment_label }: SentimentCardProps) {
  const score = sentiment_score >= 0 ? `+${sentiment_score.toFixed(2)}` : sentiment_score.toFixed(2)
  const color =
    sentiment_label === "Positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : sentiment_label === "Negative"
        ? "text-red-600 dark:text-red-400"
        : "text-zinc-600 dark:text-zinc-400"
  const icon =
    sentiment_label === "Positive" ? (
      <TrendingUp className="h-4 w-4 text-emerald-500" />
    ) : sentiment_label === "Negative" ? (
      <TrendingDown className="h-4 w-4 text-red-500" />
    ) : (
      <Minus className="h-4 w-4 text-zinc-500" />
    )

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{score}</div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{sentiment_label}</p>
      </CardContent>
    </Card>
  )
}
