# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions of **ResuMesh**:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

We take the security of ResuMesh seriously. If you believe you have discovered a security vulnerability in this project, please report it to us as described below.

### How to Report

**Please DO NOT open a public GitHub issue for security vulnerabilities.**

Instead, report the security issue privately by emailing our team at:

📧 **atacanymc@gmail.com**

Please include as much of the following information as possible to help us understand and resolve the issue quickly:

- **Type of Issue**: (e.g., SQL Injection, Cross-Site Scripting (XSS), Authentication Bypass, Remote Code Execution)
- **Affected Component**: (e.g., Frontend, Backend, Admin Panel, Scraper Service, API Route)
- **Steps to Reproduce**: Detailed steps, proof-of-concept (PoC) scripts, or requests demonstrating the vulnerability
- **Potential Impact**: Description of how an attacker could exploit this vulnerability
- **Suggested Fix**: (Optional) Any recommendations or patches you might have

---

## Response & Disclosure Process

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within **48 hours**.
2. **Investigation**: Our team will investigate and verify the report. We may reach out to you for additional information if needed.
3. **Fix & Patch**: If confirmed, we will work on a fix and release a security patch as soon as possible.
4. **Public Disclosure**: Once the vulnerability is patched, we will coordinate public disclosure with you (giving credit if desired) and publish advisory details in our release notes.

---

## Security Best Practices for Self-Hosting / Deploying

When deploying ResuMesh in a production environment, please ensure you follow these security recommendations:

- **Secrets & API Keys**: Store all credentials (JWT secrets, Supabase keys, API keys) in environment variables or secret managers, never commit `.env` files to source control.
- **CORS & Origins**: Configure `CORS_ALLOWED_ORIGINS` to strictly match your frontend domain in production.
- **HTTPS**: Always serve both Frontend and Backend applications behind valid SSL/TLS certificates (e.g., via Nginx, Caddy, Vercel, or Render).
- **Database Access**: Ensure database ports (PostgreSQL/Supabase) are protected with strong passwords and restricted network firewall rules.

Thank you for helping keep ResuMesh and our community safe! 🔒
