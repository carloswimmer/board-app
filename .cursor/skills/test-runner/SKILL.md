---
name: test-runner
description: Run project validation commands and report pass/fail with failing commands and key error output. Use after implementation is complete.
---

# Test Runner

## Goal
Validate changes before final output.

## Commands
Run in this order:
1. `pnpm lint`
2. `pnpm test:run`

## Reporting
- If all pass: report success briefly
- If any fail: report failing command first, then key error lines
- Do not claim success when a command fails
