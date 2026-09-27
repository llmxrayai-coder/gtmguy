# The GTM Guy — Vercel edition

Includes all 16 portfolio pages, experience case studies, assets and cockpit intro.

## Publish

Install Node.js 22 or later. Extract this ZIP, open a terminal inside this folder, then run:

```
npx vercel login
npx vercel --prod
```

Choose your account/team, create a project named `the-gtm-guy`, and use the current directory (`./`). vercel.json configures the build and output. No additional environment variables are needed for this migration adapter.

Alternatively push this folder to GitHub and import it in Vercel. Framework: Other. Build: `npm run build`. Output: `dist`.

## Forms and data

Vercel serves the pages, images and video. Its `/api/submissions` function forwards contact inquiries and series applications to the existing public Sites API, which validates and saves them in the existing private D1 database. Keep https://gtmguy.llmxray-ai.chatgpt.site available and public while using this adapter. Existing submissions are not copied, exposed or deleted. The current site remains unchanged.

For a completely independent migration, replace the adapter with a Vercel-compatible database and migrate stored records separately. Page-view analytics are not migrated. Email notifications were not configured and are not added here. After deployment, verify a contact form submission on the new URL.

## Edit

Content: src/pages.mjs and src/career.mjs. Design: public/style.css. Interactions: public/app.js. Run `npm run build` to generate dist. All supplied footage and other assets remain included; this export grants no additional third-party media rights.
