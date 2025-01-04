// @deno-types="@types/react"

import { useEffect } from "react";
import { NDKNip07Signer } from "@nostr-dev-kit/ndk";
import { useNdk } from "nostr-hooks";
import { ProductExplorerPage } from "./pages/ProductExplorerPage.tsx";
import { Route, Switch } from "wouter";
import { ZapoutPage } from "@root/src/pages/ZapoutPage.tsx";
import { NDKService } from "@root/src/lib/nostr/NdkService.ts";
import { DEFAULT_RELAYS } from "@root/src/lib/constants/defaultRelays.ts";

function App() {
  const { initNdk, ndk } = useNdk();

  useEffect(() => {
    initNdk({
      explicitRelayUrls: DEFAULT_RELAYS,
      signer: new NDKNip07Signer(),
    });
  }, [initNdk]);

  useEffect(() => {
    if (!ndk) return;
    new NDKService(ndk);
    ndk.connect();
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
