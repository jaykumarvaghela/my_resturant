// Per-user AI token budget: 50,000 tokens/hour
const userTokenBudget = new Map<string, { tokens: number; resetAt: number }>();
const HOURLY_BUDGET = 50_000;

export function aiRateLimit(req: any, res: any, next: any) {
  const userId = req.user?.id ?? req.ip;
  const now = Date.now();
  const entry = userTokenBudget.get(userId);

  if (!entry || now > entry.resetAt) {
    userTokenBudget.set(userId, { tokens: 0, resetAt: now + 3_600_000 });
    return next();
  }

  if (entry.tokens >= HOURLY_BUDGET) {
    return res.status(429).json({ error: "AI rate limit exceeded. Try again later." });
  }

  next();
}
