# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in HouseHold Hero V2, please report it to us responsibly. We take security seriously and appreciate your help in keeping our project safe.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please send an email to: **security@householdhero.com**

### What to Include

When reporting a vulnerability, please include:

- A description of the vulnerability
- Steps to reproduce the issue
- Affected versions
- Any potential impact
- If available, a suggested fix or workaround

### Response Timeline

We aim to respond to security reports within **48 hours** of receipt. You can expect:

1. **Initial Response**: Within 48 hours - Acknowledgment of your report
2. **Investigation**: Within 7 days - Analysis and validation of the vulnerability
3. **Resolution**: Within 14 days (or based on severity) - Patch release and security advisory

### Severity Levels

We classify vulnerabilities using the following severity levels:

| Severity | Response Time | Example |
|----------|---------------|---------|
| Critical | 48-72 hours | Remote code execution, authentication bypass |
| High | 7 days | SQL injection, privilege escalation |
| Medium | 14 days | XSS, CSRF, data exposure |
| Low | 30 days | Information disclosure, minor security issues |

### Disclosure Policy

We follow a **coordinated disclosure** approach:

1. Acknowledge the vulnerability report
2. Validate and investigate the issue
3. Develop and test a fix
4. Coordinate with you on a disclosure timeline
5. Release a security advisory with credit to you
6. Disclose the vulnerability publicly after a reasonable patching period

### Security Best Practices

When developing or contributing to HouseHold Hero V2:

- Never commit secrets or sensitive data (API keys, passwords, tokens)
- Use environment variables for all configuration
- Follow OWASP Top 10 security guidelines
- Implement proper input validation and sanitization
- Use dependency scanning tools regularly
- Keep dependencies up to date
- Implement proper authentication and authorization
- Use HTTPS for all communications
- Validate and sanitize all user inputs
- Implement rate limiting and brute force protection

### Dependency Security

We use automated tools to monitor dependencies for vulnerabilities:

- **npm audit** - Scans for known vulnerabilities in dependencies
- **Dependabot** - Automated dependency updates and security alerts
- **Snyk** (recommended) - Continuous vulnerability scanning

Run security checks locally:

```bash
npm audit
npm audit fix
```

### Security Features

HouseHold Hero V2 implements the following security measures:

- Password strength requirements (8+ chars, uppercase, lowercase, numbers)
- Role-based access control (RBAC)
- Input validation using Zod schemas
- Type safety with TypeScript strict mode
- Protected routes with role checks
- JWT-based authentication (backend planned)
- Session management with timeout support
- Two-factor authentication support (UI implemented, backend planned)

### Known Security Considerations

This project is currently in **early development** with a frontend-first approach:

- Authentication is mocked (backend not yet implemented)
- No server-side validation yet
- Session management uses localStorage (will migrate to httpOnly cookies)
- No rate limiting implemented (will be added in backend phase)
- File upload validation is client-side only (will add server-side validation)

These will be addressed in the backend implementation phase (Weeks 11-16).

### Getting Help

If you have questions about security practices or need guidance:

- Review our [Security Report](./SECURITY_REPORT.md) for detailed findings
- Check our [Contributing Guidelines](./CONTRIBUTING.md) for development practices
- Open a GitHub Discussion for general security questions
- For critical issues, email security@householdhero.com

### Credit

We recognize and credit security researchers who help make HouseHold Hero V2 safer. When vulnerabilities are disclosed, we will:

- Mention your name in the security advisory
- Link to your website or social media (if desired)
- Add you to our Security Hall of Fame (in the future)

---

Thank you for helping keep HouseHold Hero V2 safe! 🛡️
