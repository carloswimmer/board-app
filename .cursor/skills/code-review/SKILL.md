---
name: code-review
description: Review code changes for correctness, regressions, security, and test coverage. Use when reviewing completed work or before finalizing tasks.
---

# Code Review

## Goal
Find issues before merge.

## Checklist
- Correctness: logic works and edge cases are handled
- Regressions: existing behavior is not broken
- Security: no obvious vulnerabilities or unsafe patterns
- Maintainability: code is readable and consistent
- Tests: changed behavior is covered by tests

## Output Format
- 🔴 Critical: must fix before merge
- 🟡 Warning: should fix soon
- 🔵 Suggestion: optional improvement

If no issues are found, explicitly say: "No blocking issues found."
