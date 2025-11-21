# Ledighetskalkylatorn

A modern Swedish leave/vacation calculator built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- Calculate working days between two dates
- Automatically excludes weekends and Swedish holidays
- Shows upcoming holidays for the current year
- Dark theme UI
- Responsive design
- Lightning-fast development with Vite

## Tech Stack

- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **date-fns** - Date manipulation
- **Vercel** - Hosting platform

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Future Plans

- Integrate Strapi CMS for managing holiday data and text content
- Add support for custom holiday configurations
- Multi-language support

## Deployment

This project is configured for Vercel deployment. Simply connect your repository to Vercel and deploy. Vercel will automatically detect the Vite framework and configure the build settings.
