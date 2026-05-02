import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, PlusCircle } from "lucide-react"

type ActionsCardProps = {
  email: string
  restock_plan: string
}

export function ActionsCard({ email, restock_plan }: ActionsCardProps) {
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    alert("Email copied to clipboard!")
  }

  const handleCopyPlan = () => {
    navigator.clipboard.writeText(restock_plan)
    alert("Restock plan copied to clipboard!")
  }

  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader>
        <CardTitle className="text-lg font-bold">AI Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline" onClick={handleCopyEmail}>
          <Mail className="h-4 w-4 mr-2" />
          Copy Supplier Email
        </Button>
        <Button className="w-full justify-start" variant="outline" onClick={handleCopyPlan}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Copy Restock Plan
        </Button>
      </CardContent>
    </Card>
  )
}
