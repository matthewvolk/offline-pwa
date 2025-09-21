# Offline PWA

An offline-first [progressive web application](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) optimized for physical locations with unreliable internet connectivity. The app presents a form interface where submissions are stored locally in an IndexedDB-backed “outbox”. Once connectivity is detected (via the Network Information API), pending submissions are automatically sent to an external service.

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
