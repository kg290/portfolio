# Karnajeet Gosavi — Portfolio

<p align="center">
  <strong>An interactive portfolio for applied AI/ML engineering, full-stack systems, and research-led projects.</strong><br />
  Built as a motion-rich React experience with a production contact pipeline.
</p>

<p align="center">
  <a href="https://portfolio-kg290s-projects.vercel.app/"><img src="https://img.shields.io/badge/live_portfolio-visit-111111?style=flat-square&logo=vercel&logoColor=white" alt="Live portfolio" /></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=111111" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-111111?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

## Overview

This portfolio is designed as a focused product rather than a static résumé page. It combines a dark editorial visual system with interactive motion, project exploration, publications, certifications, downloadable resumes, and a persistent contact form.

The experience is built for three audiences:

- **Recruiters** scanning skills, experience signals, publications, and resumes quickly.
- **Engineering teams** evaluating selected projects and implementation depth.
- **Collaborators** looking for a direct, reliable way to get in touch.

## What the site communicates

| Visitor need | Portfolio experience |
| --- | --- |
| Understand the profile quickly | Hero section with role, CGPA, social links, résumé actions, and key metrics |
| Scan technical breadth | Grouped programming, frontend, backend, database, cloud, and operating-system skills |
| Explore real work | Scroll-stacked project cards with technology tags and GitHub links |
| Validate technical depth | Publications, certifications, hackathon results, and project previews |
| Start a conversation | Validated contact form backed by a Vercel serverless API and PostgreSQL |

## Experience map

```text
Hero
 ├── Profile card, introduction, KPIs, social links
 ├── Interactive terminal panel
 ├── Resume selector
 └── Certifications and GitHub contribution visual

Tech Stack
 └── Grouped skills for recruiter-friendly scanning

Projects
 └── ScrollStack cards with previews, descriptions, and external links

Achievements
 ├── Hackathon highlights and event photography
 └── Publications with venue links and hover previews

Contact
 ├── Animated visual backdrop
 ├── Validated contact form
 └── GitHub, LinkedIn, and email actions
```

## Highlights

### Interactive visual system

- Particle-text preloader
- Framer Motion reveal and stagger animations
- Smooth scroll progress indicator
- Staggered mobile navigation and gooey section navigation
- Target cursor interactions for buttons, cards, and links
- Magnetic buttons and animated borders
- Scroll-stacked projects
- Hover previews for publications and credentials
- Spline 3D decorative environment
- Responsive layouts for desktop and mobile

### Profile and content

- AI/ML engineering profile focused on applied systems
- CGPA, publication, and certification KPI cards
- Full-stack and agentic-Python résumé downloads
- GitHub and LinkedIn entry points
- Technical stack grouped by capability instead of an unstructured list
- Hackathon highlights with supporting images

### Projects represented

| Project | Focus |
| --- | --- |
| Offroad Terrain Segmentation System | DeepLabV3+, ResNet-101, semantic segmentation, computer vision |
| Narrative Consistency Verification System | Retrieval, rules, LLM reasoning, evidence-backed NLP |
| Real-Time GPU Visualization and Orbit Sonification | GPU rendering, visualization, realtime audio |
| SAP CI Technical Specification Generator | SAP CPI, BPMN/XML parsing, Gemini summaries, DOCX generation |
| Anti-Fingerprint Instruction Shuffler | C++17, compiler IR, CFG analysis, semantic equivalence |

### Research and achievements

- IEEE publication on machine-learning benchmarking for weather prediction across India
- Research on smart retail shelf inventory management
- IEEE publication on perspective-powered personalized news aggregation
- Hackathon finalist and qualification highlights
- Oracle Cloud Infrastructure and IBM professional certifications

## Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                         React + Vite                         │
│  Animated UI · content sections · project navigation         │
└──────────────┬───────────────────────┬───────────────────────┘
               │ static assets          │ POST /api/contact
               ▼                        ▼
┌────────────────────────┐   ┌────────────────────────────────┐
│ Vercel static deployment│   │ Vercel serverless function      │
│ dist/ + public assets   │   │ api/contact.js                  │
└────────────────────────┘   └───────────────┬────────────────┘
                                             │ postgres client
                                             ▼
                               ┌──────────────────────────────┐
                               │ PostgreSQL                     │
                               │ contact_submissions table     │
                               └──────────────────────────────┘
```

### Runtime responsibilities

| Layer | Responsibility |
| --- | --- |
| React | Composition, interaction state, navigation, animation, and content rendering |
| Vite | Development server and optimized production bundle |
| Vercel | Static hosting, deployment, and serverless API execution |
| `api/contact.js` | Request validation, honeypot handling, schema initialization, and persistence |
| PostgreSQL | Durable contact-submission storage |
| Vercel Analytics | Product analytics integration |

## Tech stack

| Area | Technology | Role |
| --- | --- | --- |
| UI | React 19 | Component-based portfolio interface |
| Build | Vite 6 | Development and production bundling |
| Motion | Framer Motion, GSAP, Lenis | Reveal animations, smooth scrolling, and interaction polish |
| 3D / graphics | Three.js, React Three Fiber, Drei, Spline | Decorative 3D and GPU-driven visuals |
| Styling | CSS modules-by-convention and global CSS | Dark visual system and responsive layout |
| Icons | React Icons | Consistent social and feature iconography |
| Hosting | Vercel | Frontend deployment and serverless functions |
| Data | PostgreSQL via `postgres` | Contact form persistence |
| Analytics | `@vercel/analytics` | Web analytics |

## Project structure

```text
portfolio/
├── api/
│   └── contact.js                         # Vercel contact endpoint
├── public/
│   ├── previews/                          # Project, publication, and credential previews
│   ├── resume/                            # Downloadable résumé PDFs
│   ├── profile-picture.jpg                # Profile image
│   ├── sitemap.xml                        # Search crawler sitemap
│   └── robots.txt                         # Crawler policy
├── githubimages/                          # README project screenshots
├── src/
│   ├── App.jsx                            # Portfolio composition and content data
│   ├── App.css                            # Application visual system
│   ├── index.css                          # Global document styles
│   ├── main.jsx                           # React entry point
│   ├── components/                        # Reusable motion and visual components
│   └── lib/                               # Shared helpers
├── index.html                             # SEO metadata, Open Graph, JSON-LD
├── vercel.json                            # Vercel build and security configuration
├── vite.config.js                         # Vite configuration
└── package.json                            # Scripts and dependencies
```

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+
- A PostgreSQL connection string for the contact API

### Install dependencies

```bash
git clone https://github.com/kg290/portfolio.git
cd portfolio
npm ci
```

### Run the frontend locally

```bash
npm run dev
```

The Vite development server will print the local URL, usually `http://localhost:5173`.

### Run the Vercel API locally

The contact endpoint is designed for Vercel’s serverless runtime. To exercise the frontend and API together locally, use the Vercel CLI and provide the database variable:

```bash
npm install --global vercel
vercel dev
```

Set one of these environment variables in the Vercel project or local environment:

```text
POSTGRES_URL=postgresql://...
# or
DATABASE_URL=postgresql://...
```

### Validate and build

```bash
npm run lint
npm run build
npm run preview
```

## Contact API

`POST /api/contact` accepts:

```json
{
  "name": "Your name",
  "email": "you@example.com",
  "message": "A message with at least 10 characters",
  "source": "portfolio-contact-form"
}
```

The endpoint:

- Accepts `POST` and CORS preflight `OPTIONS`
- Rejects unsupported methods
- Validates and length-limits name, email, and message fields
- Uses a honeypot field to discard simple bot submissions
- Creates `contact_submissions` on first use
- Stores IP and user-agent metadata for submission context
- Uses PostgreSQL SSL connections through the `postgres` client

## Deployment

The repository is configured for Vercel:

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Required environment variable | `POSTGRES_URL` or `DATABASE_URL` |

Deploy through the Vercel dashboard or CLI:

```bash
vercel
vercel --prod
```

## SEO and discoverability

The HTML shell includes:

- Canonical URL
- Open Graph title and description
- Twitter card metadata
- Author and keyword metadata
- Person JSON-LD with GitHub and LinkedIn profiles
- `robots.txt` and `sitemap.xml`

Update the canonical URL and social metadata in `index.html` when deploying to a different domain.

## Security and operational notes

- Never commit `POSTGRES_URL`, `DATABASE_URL`, or database credentials.
- Keep database credentials in Vercel environment variables.
- The API normalizes and length-limits user input before persistence.
- The contact endpoint uses parameterized tagged-template queries through `postgres`.
- Add rate limiting and abuse monitoring before exposing the contact endpoint to significant traffic.
- Keep large 3D and media assets lazy-loaded where possible to protect initial load performance.
- Test the contact API against the production database connection before announcing the live site.

## Roadmap

- Add automated CI for lint and production builds
- Add API rate limiting and contact-submission alerting
- Add a dedicated project detail route for deeper case studies
- Add accessibility audits for the custom cursor and motion-heavy sections
- Add performance budgets for Three.js, Spline, and image assets
- Add a public changelog for portfolio iterations

## Live links

- [Live portfolio](https://portfolio-kg290s-projects.vercel.app/)
- [GitHub profile](https://github.com/kg290)
- [LinkedIn](https://www.linkedin.com/in/karnajeet-gosavi)

<p align="center">Built with React, Vite, motion, and a little visual mischief.</p>
