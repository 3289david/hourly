# Security Policy

## Reporting a Vulnerability

If you find a security vulnerability in Hourly, please report it privately.

**Do not open a public GitHub issue for security vulnerabilities.**

Email: security@hourly.dev (or open a [GitHub private vulnerability report](https://github.com/3289david/hourly/security/advisories/new))

Include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

You can expect an acknowledgment within 48 hours and a resolution timeline within 7 days for critical issues.

## Scope

In scope:
- License key bypass or session forgery
- Path traversal in workspace file operations
- Authentication/authorization bypasses
- Remote code execution beyond the intended terminal sandbox
- Exposure of user API keys (BYOK)

Out of scope:
- Rate limiting bypass (by design, mitigated at nginx layer)
- Social engineering
- Issues in third-party dependencies (report to them directly)

## Supported Versions

Only the latest release on `main` is supported.
