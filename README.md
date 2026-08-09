# Cybersecurity Portfolio

A responsive, recruiter-ready homepage for a growing cybersecurity body of work. It is intentionally built with plain HTML, CSS, and JavaScript so it is easy to publish with GitHub Pages and update every week.

The project section is dynamic: it requests the latest public, non-forked, non-archived repositories from the configured GitHub profile and turns them into portfolio cards. It is currently configured for `justo340`; change `GITHUB_USERNAME` in `projects.js` if needed.

## Personalize before publishing

Use Find/Replace in the project for these values:

| Replace this | With your value |
| --- | --- |
| `Your Name` | Your full professional name |
| `YN` | Your initials |
| `you@example.com` | Your contact email |
| `justo340` | Your GitHub username, if different |
| `YOUR-LINKEDIN-HANDLE` | Your LinkedIn public profile handle |

For each repository you want highlighted, add a clear description and a strong README that covers: **goal, method, tools, outcome, and what you learned**. Do not publish credentials, private IP addresses, client data, API keys, exploit instructions, or screenshots containing sensitive information.

## Publish with GitHub Pages

1. Create a new public GitHub repository named `security-portfolio`.
2. Upload these files (or push this folder with Git).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then **Save**.
5. GitHub will publish the site at `https://YOUR-USERNAME.github.io/security-portfolio/`. Wait one or two minutes, then open that URL and confirm it loads.
6. Update all placeholder links and the page title after the address is live.

## Add the site to LinkedIn

1. Open your LinkedIn profile and choose **Add profile section**.
2. Select **Recommended → Add featured**.
3. Choose **Add a link**, paste your live GitHub Pages URL, then save it.
4. Take a screenshot showing the Featured card with the live URL or its site preview. Insert that screenshot into `submission/Security_Portfolio_Submission.docx` and replace the two URL placeholders with the live links.

## Suggested repository structure as your work grows

```text
projects/
  brute-force-detection/
    README.md
    screenshots/
  vulnerability-management/
    README.md
    screenshots/
  network-hardening/
    README.md
    screenshots/
```

For every project README, use this outline:

```md
# Project title
## Objective
## Environment and tools
## Method
## Findings / outcome
## What I learned
## Evidence
```
