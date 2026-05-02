import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

export function ExplanationCard() {
  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 col-span-full">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Info className="h-5 w-5 text-indigo-500" />
        <CardTitle className="text-lg font-bold">Why This Decision</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The positive sentiment score (+0.65) combined with a high volume of reviews mentioning 
          "sound quality" and "battery life" suggests strong organic growth. Based on historical 
          patterns for similar electronics, we project a 12% increase in demand over the next 30 days. 
          Given your current stock of 50 units and a lead time of 10 days, we recommend a reorder 
          of 25 units to maintain a safety buffer without overstocking.
        </p>
      </CardContent>
    </Card>
  )
}
