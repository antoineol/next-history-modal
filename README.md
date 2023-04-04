Demo: https://next-history-modal.vercel.app/

LinkedIn post:
https://www.linkedin.com/posts/antoineol_tech-nextjs-react-activity-7049022986594504704--aWp?utm_source=share&utm_medium=member_desktop

## Context

Often, on mobile websites, I want to close a modal with the "back" button... but it exits the whole page instead! On a
Next.js app, I wanted to solve it. Here is what was coded.

With this code snippet, opening the modal pushes a new entry to the browser history. It works well on modal, but it can
be applied to anything that shows and hides, like auto-complete suggestions.

I don't know why this pattern is so uncommon on mobile websites (only Google Search comes to my mind), although it is a
normal thing on mobile apps. The web tech actually makes it quite hard to implement.

Any idea about why? Have you faced a similar challenge? Would this tool help you? What would you change? Don't hesitate
to react on LinkedIn!

## Where is the interesting code?

- Hook managing the history: src/manual-history/useManualHistory.ts
- Usage example: src/components/BrowsableModal.tsx

## Usage

Install the dependencies:

```bash
yarn
```

Start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
