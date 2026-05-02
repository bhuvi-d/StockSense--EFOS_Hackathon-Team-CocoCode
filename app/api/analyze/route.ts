import { NextResponse } from "next/server";

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

  const positiveWords = [
    "love",
    "great",
    "excellent",
    "amazing",
    "perfect",
    "good",
    "fantastic",
    "recommend",
    "value",
    "satisfied",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "poor",
    "broken",
    "refund",
    "return",
    "disappointed",
    "hate",
    "worst",
    "defective",
  ];

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
    "You are an expert product review analyst. Analyze ALL reviews together and output ONLY valid JSON matching this exact schema with no extra keys:\n" +
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
    "- confidence MUST be between 0 and 1, based on number of reviews and consistency.\n" +
    "- Use concise strings.\n" +
    "- Output ONLY JSON (no markdown, no commentary).\n\n" +
    `Product: ${params.productName}\n\nReviews:\n${params.reviews
      .map((r, i) => `${i + 1}. ${r}`)
      .join("\n")}`;

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

      if (!res.ok) {
        throw new Error(`Groq API error: ${res.status}`);
      }

      const data = (await res.json()) as any;
      const content: unknown = data?.choices?.[0]?.message?.content;
      if (typeof content !== "string") {
        throw new Error("Groq response missing content");
      }

      const parsed = safeJsonParse(content);
      const normalized = normalizeInsights(parsed);
      if (!normalized) {
        throw new Error("Invalid JSON contract from LLM");
      }
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
  const demand = base_demand * (1 + 0.2 * clamp(sentimentScore, -1, 1));
  return Math.round(demand);
}

function calculateInventory(demand: number, stock: number): { reorder: number; risk: RiskLabel } {
  if (demand > stock) {
    const reorder = demand - stock;
    const risk: RiskLabel = demand >= stock * 2 && reorder >= 50 ? "Critical" : "High";
    return { reorder, risk };
  }
  if (demand === stock) {
    return { reorder: 10, risk: "Medium" };
  }
  return { reorder: 0, risk: "Low" };
}

function generateSupplierEmail(params: {
  productName: string;
  reorder: number;
  risk: RiskLabel;
}) {
  const urgency =
    params.risk === "Critical"
      ? "URGENT"
      : params.risk === "High"
        ? "High Priority"
        : params.risk === "Medium"
          ? "Priority"
          : "Standard";

  const subject = `${urgency}: Restock Request — ${params.productName} (${params.reorder} units)`;
  const tone =
    params.risk === "Critical" || params.risk === "High"
      ? "We are experiencing elevated demand and need an expedited restock."
      : "Please process the following restock request.";

  return [
    `Subject: ${subject}`,
    "",
    "Hello Supplier Team,",
    "",
    `${tone}`,
    "",
    `Product: ${params.productName}`,
    `Quantity: ${params.reorder}`,
    `Urgency: ${params.risk}`,
    "",
    "Please confirm availability and estimated delivery timeline.",
    "",
    "Regards,",
    "Inventory Team",
  ].join("\n");
}

function generateRestockPlan(params: { reorder: number; risk: RiskLabel }) {
  const timeline =
    params.risk === "Critical"
      ? "within 24 hours"
      : params.risk === "High"
        ? "within 2 days"
        : params.risk === "Medium"
          ? "within 5 days"
          : "as needed";

  return [
    `Reorder ${params.reorder} units ${timeline}.`,
    "Monitor demand trend daily and reassess stock weekly.",
    "Set a reorder point alert to prevent future stock-outs.",
  ].join(" ");
}

function generateExplanation(params: {
  sentiment_score: number;
  demand: number;
  stock: number;
  reorder: number;
  risk: RiskLabel;
}) {
  const score = clamp(params.sentiment_score, -1, 1);
  const scoreStr = score.toFixed(2);
  if (params.reorder > 0) {
    return `Sentiment is ${scoreStr} driving estimated demand of ${params.demand} vs current stock ${params.stock}. Stock is insufficient, so a reorder of ${params.reorder} units is recommended (risk: ${params.risk}).`;
  }
  return `Sentiment is ${scoreStr} driving estimated demand of ${params.demand} vs current stock ${params.stock}. Current stock is sufficient, so no reorder is required (risk: ${params.risk}).`;
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

  if (!isNonEmptyString(productName)) {
    return NextResponse.json({ error: "productName is required" }, { status: 400 });
  }
  if (typeof stock !== "number" || Number.isNaN(stock) || stock < 0) {
    return NextResponse.json({ error: "stock must be a non-negative number" }, { status: 400 });
  }
  if (!isStringArray(reviews) || reviews.length === 0 || reviews.every((r) => !isNonEmptyString(r))) {
    return NextResponse.json({ error: "reviews must be a non-empty array" }, { status: 400 });
  }

  const cleanReviews = reviews.map((r) => r.trim()).filter((r) => r.length > 0);
  if (cleanReviews.length === 0) {
    return NextResponse.json({ error: "reviews must be a non-empty array" }, { status: 400 });
  }

  const insights = await callGroqForInsights({
    productName,
    reviews: cleanReviews,
    timeoutMs: 5000,
  });

  const demand = calculateDemand(insights.sentiment_score);
  const { reorder, risk } = calculateInventory(demand, stock);

  const email = generateSupplierEmail({ productName, reorder, risk });
  const restock_plan = generateRestockPlan({ reorder, risk });
  const explanation = generateExplanation({
    sentiment_score: insights.sentiment_score,
    demand,
    stock,
    reorder,
    risk,
  });

  const response: AnalyzeResponse = {
    sentiment_score: clamp(insights.sentiment_score, -1, 1),
    sentiment_label: insights.sentiment_label,
    issues: insights.issues,
    strengths: insights.strengths,
    improvements: insights.improvements,
    confidence: clamp(insights.confidence, 0, 1),
    demand,
    reorder,
    risk,
    email,
    restock_plan,
    explanation,
  };

  return NextResponse.json(response);
}
