# Conduit Market — 2025 Portfolio Showcase

[Live portfolio demo](https://conduit-market-showcase.vercel.app/) ·
[Historical production site](https://alpha.conduit.market/) ·
[Current Conduit](https://conduit.market/)

This repository preserves a July 2025 version of the original Conduit Market
client and adapts it into a stable, self-contained portfolio showcase.

It is an unofficial historical demo, not the current Conduit product. The
original Git history and contributor attribution have been preserved.

## About this showcase

The original application depended on live Nostr relays, user signers, and
Lightning payment flows. Those dependencies are not appropriate for a durable
portfolio demo, so this branch uses deterministic sample listings and
browser-only interactions.

You can:

- browse the marketplace and product interfaces;
- add products to separate merchant carts;
- use the game-like cart HUD and drawer interactions; and
- explore the design system at [`/style-guide`](https://conduit-market-showcase.vercel.app/style-guide).

The showcase does not create accounts, connect wallets, publish orders, or
process Bitcoin payments.

The preserved baseline is commit
[`7868db1`](https://github.com/beejsbj/conduit-market-client/commit/7868db168ad67f3262c47d5523f7dfa8a97e7e23)
from July 2025. Portfolio-specific changes live on the
`portfolio/showcase-2025` branch so the historical application remains
inspectable on `main`.

## My contribution

I worked on Conduit Market as a frontend engineer and design-system architect
from April through July 2025. This repository records 265 commits under my
`beejsbj` author identity from May through June.

My work included:

- establishing the CSS tokens, typography, color, and component foundations
  and moving the application to Tailwind CSS v4;
- building the interactive style guide and reusable buttons, cards, fields,
  pills, avatars, tabs, icons, banners, carousels, and layout primitives;
- designing and implementing responsive marketplace, navigation, product,
  cart, and checkout interfaces;
- architecting multi-merchant cart state with Zustand;
- creating the game-like cart HUD, drawer, and touch interaction model;
- implementing checkout and shipping-form interfaces with Zod validation;
- adding AutoAnimate motion, mobile refinements, and custom SVG effects; and
- addressing production-build and runtime-resilience issues.

This was collaborative product work. I do not claim sole authorship of the
application; the commit history remains the authoritative record of who changed
what.

## Where Conduit went next

This repository represents the client as it existed during my 2025 engagement.
For later and current versions, see:

- [legacy client continuation on GitLab](https://gitlab.com/conduit-btc/conduit-market-client);
- [current open-source Conduit monorepo](https://github.com/Conduit-BTC/conduit-mono);
- [current Conduit website](https://conduit.market/);
- [current buyer marketplace](https://shop.conduit.market/); and
- [current merchant portal](https://sell.conduit.market/).

The current product has continued to evolve and should not be treated as a
representation of my 2025 implementation.

## Technology

React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Zod, Nostr Development
Kit, Wouter, and AutoAnimate.

## Local development

```bash
bun install --frozen-lockfile
bun run dev
```

Create and preview a production build with:

```bash
bunx tsc --noEmit
bun run build
bun run preview
```

## Attribution and license

Conduit Market was built by multiple contributors. Their commits, names, and
authorship metadata remain in this repository's Git history.

The preserved source and portfolio modifications are distributed under the
[Mozilla Public License 2.0](LICENSE). Conduit names, branding, and logos belong
to their respective owners. This showcase is presented for historical and
portfolio purposes and does not imply endorsement or current affiliation.
