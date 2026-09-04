const ShowcaseNotice: React.FC = () => (
  <aside
    aria-label="Portfolio showcase notice"
    className="h-9 overflow-x-auto bg-ink px-4 text-paper voice-sm"
  >
    <div className="mx-auto flex h-full min-w-max items-center justify-center gap-1 whitespace-nowrap">
      <span className="font-bold">2025 portfolio showcase.</span>
      <span>Sample listings; wallets, orders, and payments are disabled.</span>
      <a
        className="inline underline underline-offset-4"
        href="https://conduit.market/"
        target="_blank"
        rel="noreferrer"
      >
        Current Conduit
      </a>
      <span aria-hidden="true">·</span>
      <a
        className="inline underline underline-offset-4"
        href="https://github.com/beejsbj/conduit-market-client/tree/portfolio/showcase-2025"
        target="_blank"
        rel="noreferrer"
      >
        Source &amp; attribution
      </a>
    </div>
  </aside>
)

export default ShowcaseNotice
