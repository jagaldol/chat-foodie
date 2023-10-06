# Client

webpage implementation of chatFoodie.

> This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## DEMO PAGE

### [Introduction Page](https://chatfoodie.net/)

![introdcution page](/docs/main-page.png)

You can see our introduction of chatfoodie in this page.

### [Chat Page](https://chatfoodie.net/chat)

![chat page](/docs/chat-page.png)

You can chat with foodie in this page.

It's Design is ChatGPT-like style that intuitviely indicates that it's an AI chat.

## Getting Started

First, run the development server:

```bash
npm install

# and

npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Directory Structure

```
client
├─── public             # Images, svg, logo...
|
└─── src
    │
    ├── app             # Page routing, only have layout.tsx/page.tsx
    │
    │
    ├── components      # Components recycled on multiple pages
    │
    │
    ├── containers      # UI components that are not recycled on multiple pages
    │
    │
    ├── styles          # CSS(tailwind) files and other styles file
    │
    │
    ├── types           # types used global
    │
    │
    └── utils           # util functions
```
