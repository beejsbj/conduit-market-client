// @deno-types="@types/react"

import { useEffect } from "react";
import { useNdk } from "nostr-hooks";
import { ProductExplorerPage } from "./pages/ProductExplorerPage.tsx";
import { Route, Switch } from "wouter";
import { ZapoutPage } from "@root/src/pages/ZapoutPage.tsx";

function App() {
  const { initNdk, ndk } = useNdk();

  useEffect(() => {
    initNdk({
      explicitRelayUrls: [
        "ws://localhost:7777",
      ],
    });
  }, [initNdk]);

  useEffect(() => {
    ndk?.connect();
  }, [ndk]);

  return (
    <>
      <Switch>
        <Route path="/" component={ProductExplorerPage} />
        <Route path="/zapout" component={ZapoutPage} />
        <Route path="/checkout" component={ZapoutPage} />
      </Switch>
    </>
  );
}

export default App;
