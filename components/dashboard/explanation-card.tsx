import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

type ExplanationCardProps = {
  explanation: string
}

export function ExplanationCard({ explanation }: ExplanationCardProps) {
  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 col-span-full">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Info className="h-5 w-5 text-indigo-500" />
        <CardTitle className="text-lg font-bold">Why This Decision</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {explanation}
        </p>
      </CardContent>
    </Card>
  )
}
