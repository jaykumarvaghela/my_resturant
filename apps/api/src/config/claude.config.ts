export const claudeConfig = {
  model: process.env.CLAUDE_MODEL ?? "claude-sonnet-4-20250514",
  maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS ?? "4096"),
  temperature: 0.7,
  cacheEnabled: process.env.NODE_ENV === "production",
  cacheTTLMs: 5 * 60 * 1000, // 5 minutes
};
