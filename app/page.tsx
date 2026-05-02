import { InputForm } from "@/components/input-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 sm:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-zinc-50 to-zinc-50 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950">
      <div className="w-full max-w-4xl space-y-8 text-center mb-8">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          StockSense <span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          The intelligent inventory agent that listens to your customers. 
          Upload reviews and get instant inventory recommendations.
        </p>
      </div>
      
      <InputForm />
      
      <div className="mt-12 text-sm text-zinc-500 dark:text-zinc-500">
        Phase 1 • AI-Powered Inventory Intelligence
      </div>
    </main>
  )
}
