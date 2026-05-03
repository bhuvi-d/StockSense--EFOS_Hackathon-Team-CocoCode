import { InputForm } from "@/components/input-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Database, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100 via-zinc-50 to-zinc-50 dark:from-orange-950/20 dark:via-zinc-950 dark:to-zinc-950">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-4xl space-y-8 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          Intelligent Inventory Management
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          StockSense <span className="text-orange-600 dark:text-orange-400">AI</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          The intelligent inventory agent that listens to your customers. 
          Select from our <span className="text-orange-600 dark:text-orange-400 font-bold">product catalog</span> or analyze your own data instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/products">
            <Button size="lg" className="h-14 px-8 text-lg font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95">
              <Database className="mr-2 h-5 w-5" />
              Browse Product Database
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="w-full max-w-5xl mx-auto relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur opacity-20 dark:opacity-40 animate-tilt"></div>
        <Suspense fallback={
          <div className="w-full h-96 bg-white dark:bg-zinc-950 rounded-3xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        }>
          <InputForm />
        </Suspense>
      </div>
      
      <div className="mt-12 text-sm text-zinc-500 dark:text-zinc-500 flex items-center gap-4">
        <span>Production Grade UI</span>
      </div>
    </main>
  )
}
