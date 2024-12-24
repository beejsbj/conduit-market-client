import { DEFAULT_RELAYS } from "@root/src/lib/constants/defaultRelays.ts";
import { createNostrOrder } from "@root/src/lib/nostr/createOrder.ts";
import type { NDK } from "@root/src/types/ndk.d.ts";

const postOrder = async (ndk: NDK, orderData: OrderData, merchantPubkey: string) => {
    const encryptedOrder = await createNostrOrder(ndk, orderData, merchantPubkey);

    // Get merchant's preferred DM relays from their kind:10050 event
    const relayList = await ndk.fetchEvent({
        kinds: [10050],
        authors: [merchantPubkey]
    });

    let relayUrls: string[] = [...DEFAULT_RELAYS];

    // Publish to merchant's preferred relays
    if (relayList) {
        const u: string[] = relayList.tags
            .filter(tag => tag[0] === 'relay')
            .map(tag => tag[1]);

        relayUrls = [...u, ...relayUrls];
    }

    await Promise.all(relayUrls.map(url =>
        ndk.pool.publish(url, encryptedOrder)
    ));
};

export default postOrder;
