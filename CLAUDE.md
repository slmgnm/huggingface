# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resume Builder - a Next.js 14 application that allows users to create resumes/CVs with AI-powered bio and cover letter generation. Features PDF export and multiple DaisyUI themes.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

## Environment Variables

Required in `.env.local`:
- `OPENAI_API_KEY` - For AI bio/cover letter generation (streaming via OpenAI API)
- `HUGGING_FACE_TOKEN` - Alternative AI backend using Llama 3

## Architecture

### State Management
- **AppContext** (`context/AppContext.tsx`): Global React Context for form state and theme. Exposes `state`, `setState`, `theme`, `changeTheme`.
- Form data is persisted to `localStorage` under key `formData`.

### API Routes (Next.js App Router)
- `/api/openai` - Streaming OpenAI GPT-4 endpoint for bio/cover letter generation
- `/api/generate-cv` - Hugging Face Llama 3 endpoint (alternative)

### Key Components
- `app/resume/page.tsx` - Main CV form with all input fields, image upload, and PDF export
- `app/components/BioHF.tsx` - AI-generated bio section with OpenAI streaming
- `app/components/CoverHF.tsx` - Modal for AI-generated cover letter
- `app/components/RichText.tsx` - React Quill wrapper (dynamically imported, SSR disabled)

### PDF Export
Uses `@progress/kendo-react-pdf` with `PDFExport` component wrapping the resume content.

### Styling
- Tailwind CSS with DaisyUI plugin
- 30+ themes configured in `tailwind.config.ts`
- Theme is applied via `data-theme` attribute
- CSS modules for Quill editor customization

### Path Alias
`@/*` maps to project root (configured in `tsconfig.json`)
