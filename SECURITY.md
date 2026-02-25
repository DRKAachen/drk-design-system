# Security Policy

## Supported Versions

Security updates are provided for the latest published major version of `@drk/design-system`.

| Version | Supported |
| --- | --- |
| Latest major | yes |
| Older majors | no |

## Reporting a Vulnerability

Please do **not** open public GitHub issues for security vulnerabilities.

- Report by email to: `security@drk.example` (replace with your real security mailbox).
- Include:
  - affected package version
  - clear reproduction steps or proof-of-concept
  - impact assessment (confidentiality/integrity/availability)
  - suggested fix (optional)

## Response Targets

- Initial acknowledgement: within **2 business days**
- Triage + severity classification: within **5 business days**
- Target patch for high/critical issues: within **14 business days**

## Disclosure Process

- We validate and reproduce the report.
- A fix is prepared and reviewed privately.
- A patched version is published.
- A coordinated disclosure note is published after remediation.

## Security Baseline

- CI runs type checks, tests, and dependency audits.
- HTML sanitization uses a maintained library with allowlist configuration.
- Cookie consent supports client + server-side enforcement paths.
