import { DEFAULT_RELAYS } from "@root/src/lib/constants/defaultRelays.ts";
import { getNdk } from "@root/src/lib/nostr/NdkService.ts";
import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { NDKRelay, NDKRelaySet } from "@nostr-dev-kit/ndk";

const postOrder = async (orderEvent: NDKEvent, merchantPubkey: string) => {
    const ndk = await getNdk();

    // Get merchant's preferred DM relays from their kind:10050 event
    const relayList = await ndk.fetchEvent({
        kinds: [10050],
        authors: [merchantPubkey]
    });

    let relayUrls: string[] = [...DEFAULT_RELAYS];
    const relays: NDKRelay[] = relayUrls.map(url => new NDKRelay(url));
    const relaySet = new Set(relays);
    const ndkRelaySet = new NDKRelaySet(relaySet, ndk);

    // Publish to merchant's preferred relays
    if (relayList) {
        const u: string[] = relayList.tags
            .filter(tag => tag[0] === 'relay')
            .map(tag => tag[1]);

        relayUrls = [...u, ...relayUrls];
    }

    await orderEvent.publish(ndkRelaySet)
};

export default postOrder;
