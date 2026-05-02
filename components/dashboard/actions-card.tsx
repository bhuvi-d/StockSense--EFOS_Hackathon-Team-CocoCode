import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, PlusCircle } from "lucide-react"

export function ActionsCard() {
  return (
    <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <CardHeader>
        <CardTitle className="text-lg font-bold">AI Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Generate Supplier Email
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Restock Task
        </Button>
      </CardContent>
    </Card>
  )
}
