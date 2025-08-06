# XSS Vulnerability Analysis - Cybersecurity 0x0

## Usage

### Prerequisites

- Docker installed and running
- Terminal/Command line access
- Web browser (Chrome, Firefox, Safari, or Edge)

### Setup Instructions

1. **Start the Vulnerable Application**

   ```bash
   cd cyber0x0.1.00/ex00/; ./start.sh
   ```

   Expected output:

   ```bash
   Cleaning Docker...
   Creation of the website.
   [+] Building 0.6s (9/9) FINISHED
   [...]
   You can connect on this website:
   http://localhost:8000/
   ```

2. **Access the Application**
   - Open your web browser
   - Navigate to: `http://localhost:8000/`
   - You should see the vulnerable XSS application

### Testing the Payloads

#### Method 1: DOM Manipulation

1. Enter in the text field: `document.getElementById('cookieOutput').innerHTML = 'Cookie value: '+document.cookie`
2. Click "Submit"
3. Expected result: Cookie value displayed in the page

#### Method 2: Basic Cookie Extraction

1. Enter in the text field: `alert(document.cookie)`
2. Click "Submit"
3. Expected result: Alert popup with cookie content

#### Method 3: HTML Injection

1. Enter in the text field: `<img src=x onerror=alert(document.cookie)>`
2. Click "Submit"
3. Expected result: Alert popup with cookie content

### Stopping the Application

```bash
# To stop the Docker container
docker kill cyber0x0100-web-1
```

### Troubleshooting

- **Port 8000 already in use**: Stop other services using port 8000
- **Docker not found**: Install Docker and ensure it's running
- **Permission denied on start.sh**: Run `chmod +x start.sh`
- **Cannot access localhost:8000**: Check firewall settings and Docker configuration

## Executive Summary

This document analyzes a Cross-Site Scripting (XSS) vulnerability identified in a web application running at `http://localhost:8000/`. The vulnerability allows arbitrary JavaScript execution through unsanitized user input processing.

## Vulnerability Classification

### OWASP Classification

- **OWASP Top 10**: A03:2021 - Injection
- **CWE Classification**: CWE-79 - Cross-site Scripting (XSS)
- **Vulnerability Type**: DOM-based XSS
- **Severity**: Critical (CVSS 3.1 Base Score: 8.8)

## Technical Description

### What is Cross-Site Scripting (XSS)?

Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web applications. When other users access the compromised application, these scripts execute in their browsers, potentially:

- Stealing sensitive information (cookies, session tokens)
- Performing unauthorized actions on behalf of the user
- Redirecting users to malicious websites
- Accessing sensitive application data

### DOM-based XSS Specifics

DOM-based XSS occurs when client-side JavaScript processes user input and dynamically modifies the Document Object Model (DOM) without proper sanitization. Unlike traditional XSS:

- The malicious payload never reaches the server
- Exploitation occurs entirely within the browser
- The vulnerability exists in client-side code logic
- Traditional server-side filtering is ineffective

## Vulnerability Analysis

### Code Review Findings

The vulnerable application contains two critical security flaws:

1. **Unsafe innerHTML Manipulation**:

   ```javascript
   document.getElementById("output").innerHTML = "<b>" + userInput + "</b>";
   ```

   Direct concatenation of user input into innerHTML allows HTML/JavaScript injection.

2. **Dynamic Script Element Creation**:

   ```javascript
   var script = document.createElement("script");
   script.textContent = userInput;
   document.body.appendChild(script);
   ```

   Directly executes user-provided content as JavaScript code.

### Attack Surface

- **Entry Point**: Text input field in web form
- **Execution Context**: Client-side DOM manipulation
- **User Interaction Required**: Form submission via button click
- **Persistence**: Non-persistent (reflected in current session)

## Impact Assessment

### Immediate Risks

- **Session Hijacking**: Theft of authentication cookies
- **Data Exfiltration**: Access to sensitive application data
- **User Impersonation**: Unauthorized actions performed as victim
- **Phishing Attacks**: Redirection to malicious domains

### Business Impact

- **Confidentiality**: High - Sensitive data exposure
- **Integrity**: Medium - Potential data modification
- **Availability**: Low - Limited service disruption
- **Compliance**: Potential GDPR, PCI DSS violations

## Real-World Attack Scenarios

### Scenario 1: Corporate Data Breach

An attacker sends a crafted URL to company employees containing XSS payload. When clicked, the script:

- Steals corporate session cookies
- Accesses internal company data
- Exfiltrates information to external servers

### Scenario 2: Social Engineering Campaign

Malicious actor embeds XSS payload in social media posts or emails:

- Victims visit the vulnerable application
- Script executes, redirecting to fake login pages
- Credentials harvested for further attacks

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CWE-79: Cross-site Scripting](https://cwe.mitre.org/data/definitions/79.html)
- [OWASP Top 10 2021 - A03 Injection](https://owasp.org/Top10/A03_2021-Injection/)
- [DOM-based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)
