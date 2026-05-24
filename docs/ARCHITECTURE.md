# Cloud Restaurant — Architecture

## Overview
Turborepo monorepo with React frontend, Node.js API, Go worker, and Claude AI.

## Apps
| App     | Tech          | Port  | Purpose              |
|---------|---------------|-------|----------------------|
| web     | React + Vite  | 5173  | Customer frontend    |
| admin   | React + Vite  | 5174  | Staff dashboard      |
| api     | Node.js       | 3001  | REST + WebSocket API |
| worker  | Go            | -     | Background jobs      |

## Data Flow
Customer → Web (React) → API (Express) → PostgreSQL/Redis
                                       ↓
                                  Claude AI (Anthropic)

## Key Decisions
- See CLAUDE_INTEGRATION.md for all AI architecture decisions
