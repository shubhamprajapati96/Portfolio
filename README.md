# Shubham Prajapati — Software Developer Portfolio

<p align="center">
  <strong>Software Developer | Microservices Architecture | Cloud & SaaS Specialist</strong>
</p>

<p align="center">
  <a href="https://github.com/shubhamprajapati96"><img src="https://img.shields.io/badge/GitHub-shubhamprajapati96-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
  <a href="https://www.linkedin.com/in/shubham-prajapati-3a51a9160"><img src="https://img.shields.io/badge/LinkedIn-Shubham%20Prajapati-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-22.0+-DD0031?style=flat-square&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-6.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Angular%20Material-22.0+-blue?style=flat-square&logo=google" alt="Angular Material" />
  <img src="https://img.shields.io/badge/SCSS-Sass-CC6699?style=flat-square&logo=sass&logoColor=white" alt="SCSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## 📌 Overview

This repository houses the modern, high-performance personal portfolio web application of **Shubham Prajapati**. Built using the latest **Angular 22** framework with standalone components, signals, Angular Material, and custom SCSS design systems, it highlights **7 years** of enterprise software engineering experience across **Next.js, Angular, React, Laravel, PHP, Node.js, Conversational Voice AI, and Microservices Architecture**.

---

## 🌟 Featured Live Projects

| Project | Live Platform URL | Tech Stack | Overview |
| :--- | :--- | :--- | :--- |
| **RevBridge AI** | [revbridgeai.in](https://revbridgeai.in/) | Next.js, Nest.js, Python, PostgreSQL | Enterprise SaaS conversational AI platform automating voice conversations with intelligent AI agents for outbound/inbound calling, appointment scheduling, payment processing, real-time intent detection, and seamless CRM integrations. |
| **Dealer AI Solutions** | [dealeraisolutions.com](https://dealeraisolutions.com) | Laravel, Node.js, MySQL, LiveKit, ElevenLabs | Enterprise conversational voice AI platform for automotive dealerships with automated outbound calling, payment negotiation, and IDMS integration. |
| **ShiftHarmony AI** | [shiftharmony.ai](https://shiftharmony.ai) | Next.js, Python, PostgreSQL, OpenAI, CP-SAT | Multi-tenant SaaS hospital scheduling platform automating physician shifts using CP-SAT optimization and natural language preferences. |
| **Draydex Logistics** | [draydex.com](https://draydex.com) | Next.js, Laravel, PostgreSQL, Google Maps API | End-to-end freight transportation & logistics management platform with real-time route tracking, spot market index, and payments. |
| **IVR Microservice** | [ivr.pavillio.com](https://ivr.pavillio.com) | Angular, Node.js, PostgreSQL, Twilio API | High-availability AI-powered telephony IVR communication system built for automated caregiver workflows and call telemetry. |
| **Air-Sign Engine** | [manageairconcierge.net](https://manageairconcierge.net) | Laravel, PHP, MySQL, Zoho & Dropbox Sign APIs | Automated contract signing and digital document execution system with legally compliant audit trail workflows. |
| **Ozparty Events** | [ozpartyevents.com](https://ozpartyevents.com) | React.js, Node.js, MySQL, Rezdy & Moonstride | Scalable event & hospitality booking engine with real-time availability synchronization and dynamic itinerary builders. |
| **Rankup LLM Portal** | [dealeraisolutions.com](https://dealeraisolutions.com) | Next.js, Node.js, PostgreSQL, Stripe & OpenAI APIs | AI SaaS administration portal powering generative LLM features with enterprise multi-tier Stripe subscription management. |
| **Brainymate** | [shiftharmony.ai](https://shiftharmony.ai) | Next.js, Python API, KaTeX, WebSockets | Collaborative educational platform featuring real-time mathematical KaTeX formula rendering and interactive whiteboard canvases. |

---

## ✨ Features

- **⚡ Modern Angular Architecture**: Built with Angular 22 standalone components, reactive signals, inject-based dependency injection, and modern control flow syntax (`@if`, `@for`).
- **📱 Fully Responsive Design**: Mobile-first fluid layout optimized across desktops, tablets, and mobile devices.
- **🎨 Angular Material & SCSS**: Clean UI design leveraging Angular Material components, Material Symbols, and modular SCSS styles.
- **🧭 Dynamic Routing & Deep Linking**:
  - `Home`: Hero banner, metrics counters (7 years, 15+ SaaS apps, 35+ microservices), quick highlights, and resume download.
  - `About`: Bio, professional journey, academic credentials, and core competencies.
  - `Skills`: Categorized skills breakdown (Frontend, Backend, Database, AI & Voice, API Integrations, DevOps) with visual proficiency levels.
  - `Experience`: Interactive career timeline detailing DEVtrust (2021–2026) and Tarkash Technology milestones.
  - `Projects`: Filterable project catalog with live website screenshots and dedicated dynamic detail pages (`/projects/:id`).
  - `Certifications & Achievements`: Verified credentials, summer trainings, internships, and career milestones.
  - `Services`: Enterprise consulting, Voice AI, microservices, and software engineering service offerings.
  - `Testimonials`: Real recommendations and reviews from engineering leaders and clients.
  - `Contact`: Validated interactive contact form with direct mail and phone triggers.
  - `404 Not Found`: User-friendly fallback route with direct navigation back to home.
- **📄 Resume Integration**: Direct download access for updated curriculum vitae (`shubham_resume_2026.pdf`).
- **🔍 SEO & Performance Optimized**: Includes `sitemap.xml`, `robots.txt`, meta title synchronization via Angular Router, and pre-configured build optimizations.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | Angular 22 (Standalone Components, Signals, Router) |
| **Language** | TypeScript 6 / JavaScript (ES2022+) |
| **UI & Styling** | Angular Material 22, Material Symbols, Modular SCSS |
| **Tooling & Build** | Angular CLI, Vite/esbuild bundler, ESLint, Prettier |
| **Data Architecture** | Strongly-typed interfaces (`portfolio.interfaces.ts`) & configuration service |

---

## 📁 Project Structure

```text
myProtfolio/
├── public/                 # Static assets, favicon, robots.txt, sitemap.xml
├── src/
│   ├── app/
│   │   ├── core/           # Core layout, constants, models, and services
│   │   │   ├── config/     # Portfolio static data & configuration
│   │   │   ├── constants/  # Route paths & navigation tokens
│   │   │   ├── interfaces/ # TypeScript interfaces & types
│   │   │   ├── layouts/    # MainLayout with header, navigation, and footer
│   │   │   └── services/   # Data services & state management
│   │   ├── features/       # Feature modules (standalone components)
│   │   │   ├── about/
│   │   │   ├── achievements/
│   │   │   ├── certifications/
│   │   │   ├── contact/
│   │   │   ├── experience/
│   │   │   ├── home/
│   │   │   ├── not-found/
│   │   │   ├── projects/   # Projects list and /projects/:id detail view
│   │   │   ├── services/
│   │   │   ├── skills/
│   │   │   └── testimonials/
│   │   ├── shared/         # Reusable UI components, animations, and validators
│   │   ├── app.config.ts   # Application configuration & providers
│   │   ├── app.routes.ts   # Route definitions
│   │   └── app.ts          # Root component
│   ├── assets/             # Images, project screenshots, resume PDFs
│   ├── styles/             # Global styles, variables, mixins, and theme
│   ├── index.html          # Main HTML template
│   └── main.ts             # Application entry point
├── angular.json            # Angular CLI configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- **Node.js**: `v22.22.3+`, `v24.15.0+`, or `v26.0.0+`
- **npm**: `v10+`
- **Angular CLI** (optional globally): `npm install -g @angular/cli`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shubhamprajapati96/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Development Server

Run the development server locally:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The app will automatically reload when source files change.

### Production Build

To compile and optimize the application for production:

```bash
npm run build
```

The compiled output will be generated inside the `dist/myProtfolio` directory, ready to be deployed to any static hosting provider.

### Code Quality & Formatting

- **Run Linter**:
  ```bash
  npm run lint
  ```
- **Format Code**:
  ```bash
  npm run format
  ```
- **Check Formatting**:
  ```bash
  npm run format:check
  ```

---

## ⚙️ Customizing Content

All portfolio content is structured and centralized:
- **Profile, Projects, Skills, and Experience**: Update `src/app/core/config/portfolio-data.ts` or `src/assets/data/portfolio.json`.
- **Resume**: Replace PDF files in `src/assets/data/` with your own resume and update the path in `portfolio-data.ts`.
- **Styles & Themes**: Modify color palettes and theme tokens in `src/styles/`.

---

## 🌐 Deployment

The compiled `dist/` output can be deployed easily to:
- **GitHub Pages**: Deploy using `angular-cli-ghpages` or GitHub Actions.
- **Vercel / Netlify**: Connect the GitHub repository, set build command to `npm run build` and output directory to `dist/myProtfolio/browser`.
- **Apache / Nginx**: Copy the contents of `dist/myProtfolio/browser` to your web server root (e.g. `/var/www/html/`). Ensure URL rewriting is enabled for Angular routing (`index.html` fallback).

---

## 📱 Mobile App & Android APK Generation

This application is fully aligned and optimized for mobile devices and native Android app wrappers:
- **PWA Web App Manifest**: Pre-configured [`public/manifest.webmanifest`](public/manifest.webmanifest) with standalone display mode and responsive icon sizes (16px, 32px, 180px, 192px, 512px).
- **Mobile Safe Area Insets**: Native support for device notches, status bars (`env(safe-area-inset-top)`), and navigation home indicators (`env(safe-area-inset-bottom)`).
- **Boundary Overscroll Protection**: Enforced `overscroll-behavior: none` eliminating browser rubber-banding and elastic stretch bounce across touch, trackpad, and Microsoft Edge.

### Easiest Ways to Generate Android APK:

#### 🌟 Option 1: PWABuilder (Easiest — 1-Click, Zero Local Setup)
1. Visit **[PWABuilder.com](https://www.pwabuilder.com/)**.
2. Enter your live portfolio URL: `https://portfolio-shubhtech96-3071.vercel.app/`
3. Click **Package for Stores** → select **Android**.
4. Click **Generate / Download APK**.
5. Your ready-to-install `.apk` (and Google Play Store ready `.aab`) will download in seconds.

#### ⚡ Option 2: Automated GitHub Actions CI (Cloud Build)
A pre-configured GitHub Actions workflow is provided at [`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml):
1. Go to the **Actions** tab on your GitHub repository.
2. Select **Build Android APK** from the left sidebar.
3. Click **Run workflow** (or simply push to `main`/`master`).
4. Once completed, download the **`Shubham-Portfolio-APK`** artifact directly from the workflow summary page.

#### 🛠️ Option 3: Capacitor Android (Local Build with Android Studio)
```bash
# 1. Install Capacitor dependencies
npm install --save-dev @capacitor/cli @capacitor/core @capacitor/android

# 2. Build the Angular web app
npm run build

# 3. Add Android platform & sync
npx cap add android
npx cap sync android

# 4. Open in Android Studio or compile APK via Gradle CLI
npx cap open android
# Or compile debug APK via CLI:
cd android && ./gradlew assembleDebug
```
The compiled APK will be located at `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 👤 Author

**Shubham Prajapati**
- **Title**: Software Developer
- **Location**: Lucknow, India
- **GitHub**: [@shubhamprajapati96](https://github.com/shubhamprajapati96)
- **LinkedIn**: [shubham-prajapati-3a51a9160](https://www.linkedin.com/in/shubham-prajapati-3a51a9160)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

