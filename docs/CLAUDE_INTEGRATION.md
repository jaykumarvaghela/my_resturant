# Claude AI Integration Guide

## Architecture Principle
Claude is integrated at the architecture level, not bolted on.

## Integration Points
| File | Role |
|------|------|
| packages/claude-sdk | Shared Claude utilities |
| apps/api/src/ai/claude.service.ts | Core AI service |
| apps/api/src/ai/claude.guard.ts | Safety & PII filter |
| apps/api/src/ai/claude.cache.ts | Response caching |
| apps/api/src/ai/claude.logger.ts | Cost & audit logging |
| apps/api/src/ai/agents/ | Agentic workflows |

## Prompt Versioning
All prompts live in `/prompts/*.md` files.
Changes are reviewable via git diff.
CI runs evals on prompt changes (.github/workflows/ai-eval.yml).

## Safety Layers
1. Input sanitization (claude.guard.ts)
2. Token budget per user (aiRateLimit.middleware.ts)
3. Output validation
4. Full audit logging

## Cost Controls
- Response caching: 5min TTL for repeated queries
- Token budget: 50k tokens/user/hour
- Model: claude-sonnet-4 (cost-efficient)
- Logging: every call logs estimated USD cost
