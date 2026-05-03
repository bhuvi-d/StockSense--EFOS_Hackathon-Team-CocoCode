import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type AnalyzeRequestBody = {
  productName: string;
  stock: number;
  reviews: string[];
};

type RiskLabel = "Low" | "Medium" | "High" | "Critical";
type SentimentLabel = "Positive" | "Neutral" | "Negative";

type LlmInsights = {
  sentiment_score: number;
  sentiment_label: SentimentLabel;
  issues: string[];
  strengths: string[];
  improvements: string[];
  confidence: number;
};

type AnalyzeResponse = LlmInsights & {
  demand: number;
  reorder: number;
  risk: RiskLabel;
  email: string;
  restock_plan: string;
  explanation: string;
  daily_burn_rate: number;
  stockout_days: number;
  stockout_date: string;
  sentiment_rank: number;
  sentiment_percentile: number;
  total_products_compared: number;
  email_triggered: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function normalizeInsights(raw: unknown): LlmInsights | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const sentiment_score = typeof obj.sentiment_score === "number" ? obj.sentiment_score : NaN;
  const sentiment_label = obj.sentiment_label;
  const issues = obj.issues;
  const strengths = obj.strengths;
  const improvements = obj.improvements;
  const confidence = typeof obj.confidence === "number" ? obj.confidence : NaN;

  const isValidLabel = (v: unknown): v is SentimentLabel =>
    v === "Positive" || v === "Neutral" || v === "Negative";

  if (!Number.isFinite(sentiment_score)) return null;
  if (!isValidLabel(sentiment_label)) return null;
  if (!isStringArray(issues)) return null;
  if (!isStringArray(strengths)) return null;
  if (!isStringArray(improvements)) return null;
  if (!Number.isFinite(confidence)) return null;

  return {
    sentiment_score: clamp(sentiment_score, -1, 1),
    sentiment_label,
    issues,
    strengths,
    improvements,
    confidence: clamp(confidence, 0, 1),
  };
}

function heuristicInsights(reviews: string[]): LlmInsights {
  const text = reviews.join(" \n").toLowerCase();

  const positiveWords = ["love", "great", "excellent", "amazing", "perfect", "good", "fantastic", "recommend", "value", "satisfied"];
  const negativeWords = ["bad", "terrible", "awful", "poor", "broken", "refund", "return", "disappointed", "hate", "worst", "defective"];

  const pos = positiveWords.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0);
  const neg = negativeWords.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0);
  const rawScore = pos === 0 && neg === 0 ? 0 : (pos - neg) / Math.max(1, pos + neg);

  const sentiment_score = clamp(rawScore, -1, 1);
  const sentiment_label: SentimentLabel =
    sentiment_score > 0.15 ? "Positive" : sentiment_score < -0.15 ? "Negative" : "Neutral";

  const n = reviews.length;
  const confidence = clamp((Math.min(10, n) / 10) * (pos + neg > 0 ? 0.7 : 0.4), 0, 1);

  return {
    sentiment_score,
    sentiment_label,
    issues: neg > 0 ? ["Some customers report quality or reliability concerns."] : [],
    strengths: pos > 0 ? ["Customers highlight overall satisfaction and value."] : [],
    improvements: ["Monitor recurring themes in reviews and address top complaints quickly."],
    confidence,
  };
}

async function callGroqForInsights(params: {
  productName: string;
  reviews: string[];
  timeoutMs: number;
}): Promise<LlmInsights> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return heuristicInsights(params.reviews);
  }

  const prompt =
    "You are an expert e-commerce product review analyst. These are real customer reviews from an online marketplace. Analyze ALL reviews together and output ONLY valid JSON matching this exact schema with no extra keys:\n" +
    "{\n" +
    "  \"sentiment_score\": number,\n" +
    "  \"sentiment_label\": \"Positive\"|\"Neutral\"|\"Negative\",\n" +
    "  \"issues\": string[],\n" +
    "  \"strengths\": string[],\n" +
    "  \"improvements\": string[],\n" +
    "  \"confidence\": number\n" +
    "}\n\n" +
    "Rules:\n" +
    "- sentiment_score MUST be between -1 and +1.\n" +
    "- confidence MUST be between 0 and 1.\n" +
    "- Use concise, specific strings.\n" +
    "- Output ONLY JSON.\n\n" +
    `Product: ${params.productName}\nReal Customer Reviews:\n${params.reviews.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;

  const body = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_tokens: 800,
    messages: [
      { role: "system", content: "Return only strict JSON." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  };

  const doFetchOnce = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), params.timeoutMs);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`Groq API error: ${res.status}`);

      const data = (await res.json()) as any;
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== "string") throw new Error("Groq response missing content");

      const parsed = safeJsonParse(content);
      const normalized = normalizeInsights(parsed);
      if (!normalized) throw new Error("Invalid JSON contract from LLM");
      return normalized;
    } finally {
      clearTimeout(timeout);
    }
  };

  try {
    return await doFetchOnce();
  } catch {
    try {
      return await doFetchOnce();
    } catch {
      return heuristicInsights(params.reviews);
    }
  }
}

function calculateDemand(sentimentScore: number) {
  const base_demand = 50;
  const demand = base_demand * (1 + 0.3 * clamp(sentimentScore, -1, 1));
  return Math.round(demand);
}

function calculateInventory(demand: number, stock: number): { reorder: number; risk: RiskLabel } {
  if (demand > stock) {
    const reorder = demand - stock;
    const risk: RiskLabel = demand >= stock * 2 && reorder >= 40 ? "Critical" : "High";
    return { reorder, risk };
  }
  if (demand >= stock * 0.8) {
    return { reorder: Math.round(demand * 0.5), risk: "Medium" };
  }
  return { reorder: 0, risk: "Low" };
}

function generateSupplierEmail(params: {
  productName: string;
  reorder: number;
  risk: RiskLabel;
}) {
  const urgency = params.risk === "Critical" ? "URGENT" : params.risk === "High" ? "High Priority" : "Standard";
  const body = `Hello Supplier Team,\n\nWe require an immediate restock of ${params.reorder} units for ${params.productName} due to ${params.risk.toLowerCase()} inventory risk levels. Please confirm delivery by the earliest possible date.\n\nRegards,\nInventory Management`;
  return `mailto:supplier@example.com?subject=${encodeURIComponent(`${urgency}: Restock Order - ${params.productName}`)}&body=${encodeURIComponent(body)}`;
}

async function sendProcurementEmail({
  productName,
  reorder,
  risk,
  sentiment_score,
}: {
  productName: string;
  reorder: number;
  risk: string;
  sentiment_score: number;
}) {
  await resend.emails.send({
    from: "StockSense AI <onboarding@resend.dev>",
    to: "bhuvaneshwaritbsm@gmail.com",
    subject: `Stock Alert: Reorder Required for ${productName}`,
    html: `
      <h2>Procurement Alert</h2>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>Sentiment Score:</strong> ${sentiment_score}</p>
      <p><strong>Risk Level:</strong> ${risk}</p>
      <p><strong>Recommended Reorder:</strong> ${reorder} units</p>
      <p>Based on strong customer sentiment and current stock risk, immediate restocking is recommended.</p>
    `,
  });
}

function generateRestockPlan(params: { reorder: number; risk: RiskLabel; productName: string; stockout_days: number }) {
  if (params.reorder === 0) {
    return "Inventory levels are currently stable; maintain standard monitoring and reassess in 7 days.";
  }
  
  const timeline = params.risk === "Critical" ? "within 24 hours" : params.risk === "High" ? "within 48 hours" : "this week";
  const action = params.risk === "Critical" ? "expedited air freight" : "standard ground shipping";
  
  return `Initiate ${action} for ${params.reorder} units of ${params.productName} ${timeline} to mitigate the projected stockout in ${params.stockout_days} days.`;
}

function generateExplanation(params: {
  sentiment_score: number;
  demand: number;
  stock: number;
  reorder: number;
  risk: RiskLabel;
}) {
  const sentimentDesc = params.sentiment_score > 0.4 ? "exceptionally positive" : params.sentiment_score > 0.1 ? "generally positive" : params.sentiment_score > -0.1 ? "neutral" : "concerning";
  const gap = params.demand - params.stock;
  
  if (params.reorder > 0) {
    return `Based on ${sentimentDesc} customer sentiment, we project a demand of ${params.demand} units, creating a deficit of ${gap} units against current stock. A reorder is necessary to maintain service levels.`;
  }
  return `Current stock of ${params.stock} units effectively covers the projected demand of ${params.demand} units derived from ${sentimentDesc} customer feedback.`;
}

function calculateStockout(demand: number, stock: number): { daily_burn_rate: number; stockout_days: number; stockout_date: string } {
  const daily_burn_rate = Math.max(0.1, demand / 30);
  const stockout_days = Math.floor(stock / daily_burn_rate);
  const stockoutDate = new Date();
  stockoutDate.setDate(stockoutDate.getDate() + stockout_days);
  return {
    daily_burn_rate: Math.round(daily_burn_rate * 10) / 10,
    stockout_days,
    stockout_date: stockoutDate.toISOString().split("T")[0],
  };
}

function calculateBenchmark(sentimentScore: number): { sentiment_rank: number; sentiment_percentile: number; total_products_compared: number } {
  const referenceScores = [0.95, 0.85, 0.80, 0.75, 0.70, 0.65, 0.60, 0.55, 0.50, 0.45, 0.40, 0.35, 0.30, 0.25, 0.20, 0.15, 0.10, 0.05, 0.0, -0.05, -0.10, -0.15, -0.20, -0.30, -0.40, -0.50, -0.60, -0.70, -0.80, -0.90];
  const allScores = [...referenceScores, sentimentScore].sort((a, b) => b - a);
  const rank = allScores.indexOf(sentimentScore) + 1;
  const total = allScores.length;
  const percentile = Math.round(((total - rank) / (total - 1)) * 100);
  return { sentiment_rank: rank, sentiment_percentile: percentile, total_products_compared: total };
}

export async function POST(req: Request) {
  let body: AnalyzeRequestBody;
  try {
    body = (await req.json()) as AnalyzeRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const productName = body?.productName;
  const stock = body?.stock;
  const reviews = body?.reviews;

  if (!isNonEmptyString(productName)) return NextResponse.json({ error: "productName required" }, { status: 400 });
  if (typeof stock !== "number" || stock < 0) return NextResponse.json({ error: "invalid stock" }, { status: 400 });
  if (!isStringArray(reviews) || reviews.length === 0) return NextResponse.json({ error: "reviews required" }, { status: 400 });

  const cleanReviews = reviews.map(r => r.trim()).filter(r => r.length > 0);
  const insights = await callGroqForInsights({ productName, reviews: cleanReviews.slice(0, 10), timeoutMs: 5000 });

  const demand = calculateDemand(insights.sentiment_score);
  const { reorder, risk } = calculateInventory(demand, stock);
  const stockout = calculateStockout(demand, stock);
  const benchmark = calculateBenchmark(insights.sentiment_score);

  const email = generateSupplierEmail({ productName, reorder, risk });
  const restock_plan = generateRestockPlan({ reorder, risk, productName, stockout_days: stockout.stockout_days });
  const explanation = generateExplanation({ sentiment_score: insights.sentiment_score, demand, stock, reorder, risk });

  const response: AnalyzeResponse = {
    ...insights,
    demand,
    reorder,
    risk,
    email,
    restock_plan,
    explanation,
    daily_burn_rate: stockout.daily_burn_rate,
    stockout_days: stockout.stockout_days,
    stockout_date: stockout.stockout_date,
    sentiment_rank: benchmark.sentiment_rank,
    sentiment_percentile: benchmark.sentiment_percentile,
    total_products_compared: benchmark.total_products_compared,
    email_triggered: false,
  };

  if (insights.sentiment_score > 0.5 && (risk === "High" || risk === "Critical")) {
    try {
      await sendProcurementEmail({
        productName,
        reorder,
        risk,
        sentiment_score: insights.sentiment_score,
      });
      response.email_triggered = true;
    } catch (error) {
      console.error("Email send failed:", error);
    }
  }

  return NextResponse.json(response);
}
