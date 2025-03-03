import { DEFAULT_RELAYS } from "@/lib/constants/defaultRelays.ts";
import { getNdk } from "@/lib/nostr/NdkService.ts";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { NDKRelay } from "@nostr-dev-kit/ndk";

const postOrder = async (orderEvent: NDKEvent, merchantPubkey: string) => {
    console.log("Posting order event to merchant:", merchantPubkey);
    const ndk = await getNdk();

    // Get merchant's preferred DM relays from their kind:10050 event
    const relayList = await ndk.fetchEvent({
        kinds: [10050],
        authors: [merchantPubkey]
    });

    let relayUrls: string[] = [...DEFAULT_RELAYS];

    // Add merchant's preferred relays if available
    if (relayList) {
        const merchantRelays: string[] = relayList.tags
            .filter(tag => tag[0] === 'relay')
            .map(tag => tag[1]);
        relayUrls = [...merchantRelays, ...relayUrls];
    }

    // Connect to all the relays directly through the NDK's pool
    const relays = relayUrls.map(url => {
        const relay = new NDKRelay(url, undefined, ndk);
        ndk.pool.addRelay(relay);
        return relay;
    });

    // Ensure the event has the NDK instance
    orderEvent.ndk = ndk;

    // Publish the order event to the connected relays
    await orderEvent.publish();

    console.log("Order event published to relays:", relayUrls);

    return true;
};

export default postOrder;
