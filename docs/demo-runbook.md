# Demo Runbook

> Fill in your demo steps before the hackathon presentation.

## Prerequisites

- [ ] Vercel deployment is live and healthy
- [ ] Supabase project is set up with seed data
- [ ] Demo account credentials are ready (if auth is required)
- [ ] Browser is logged out / in a clean state

## Environment Setup

```bash
# Verify local environment is working before the demo
bun install
bun dev
# Open http://localhost:3000 and confirm it loads correctly
```

## Demo Steps

1. <!-- Step 1: Open the app / landing page -->
2. <!-- Step 2: Walk through the primary user flow -->
3. <!-- Step 3: Show a key feature in action -->
4. <!-- Step 4: Demonstrate data being saved/retrieved -->
5. <!-- Step 5: Show any secondary features -->

## Demo Script

<!-- Talking points for each step. Keep it concise — judges have limited time. -->

**Opening (30 sec)**
> "We built [project name] to solve [problem]. Here's how it works in 2 minutes."

**Feature walkthrough (90 sec)**
> <!-- Describe what you'll say while clicking through the demo. -->

**Closing (30 sec)**
> "In summary, [project name] [one-sentence value proposition]. We'd love your feedback."

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Page won't load | Check Vercel deployment status; try the backup URL |
| Database error | Verify Supabase project is active (free tier pauses after 1 week of inactivity) |
| Auth not working | Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel env vars |
| Slow first load | Cold start — refresh once and it will be faster |
