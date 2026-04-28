# Practice Planner — Claude Code Context

## Project
Vite + React practice planning app for Utah Ultimate.
Deployed on Vercel from the `main` branch.

## Workflow
- **Plan first:** For anything beyond a tiny tweak, describe the plan before coding.
- **Keep coach workflow simple:** fast to use, readable on phones, print-friendly.
- **Verify your work:** Run `npm run build` before declaring done.

## Product Rules
- This app is for real practice use, not a demo.
- Changes should help planning, not add busywork.
- Preserve mobile usability, print/PDF friendliness, and fast interaction.
- Do not add backend complexity unless explicitly asked.

## Architecture Notes
- Vite + React app
- Focus areas, drills, and plan generation live in local app code
- Auto-deploys from GitHub/Vercel, so keep the app production-ready

## Verification
- `npm run build`
- If you change planning logic, verify a practice plan still generates correctly
- If you change layout, keep print output readable

## Finish
After finishing, summarize what changed and append a short note to `~/.openclaw/workspace/agents/dev/memory/YYYY-MM-DD.md`
