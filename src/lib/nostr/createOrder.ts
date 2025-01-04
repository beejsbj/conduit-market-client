import { generateSecretKey, getPublicKey } from 'nostr-tools';
import { getNdk } from "@root/src/lib/nostr/NdkService.ts";
import { NDKEvent, NDKPrivateKeySigner, NDKUser } from "@nostr-dev-kit/ndk";

export async function createNostrOrder(orderData: OrderData, merchantPubkey: string): Promise<NDKEvent | { success: false, message: string }> {
    try {
        // Create the order content following NIP-15 structure
        const orderContent = {
            id: crypto.randomUUID(), // Generate unique order ID
            type: 0, // New order type
            address: orderData.address,
            message: orderData.message || '[Conduit Market Client] - [Order]',
            contact: {
                nostr: orderData.customerPubkey,
                email: orderData.email || null,
                phone: orderData.phone || null
            },
            items: orderData.items,
            shipping_id: orderData.shipping_id
        };

        const ndk = await getNdk();

        // Create the unsigned DM event (kind 14)
        const dmEvent = new NDKEvent(ndk);
        dmEvent.kind = 14;
        dmEvent.content = JSON.stringify(orderContent);
        dmEvent.tags = [
            ['p', merchantPubkey], // Merchant's pubkey
            ['subject', 'New Order'], // Optional subject for the DM
        ];

        // Create seal (kind 13)
        const sealEvent = new NDKEvent(ndk);
        sealEvent.kind = 13;

        // Current time, a slight difference from NIP-17 proper, but better for order time tracking
        const time = Math.floor(Date.now() / 1000);
        sealEvent.created_at = time;

        const merchantNdkUser = new NDKUser({ pubkey: merchantPubkey });

        // Encrypt the DM content
        sealEvent.content = await ndk.signer!.encrypt(
            merchantNdkUser,
            JSON.stringify(dmEvent)
        );

        await sealEvent.sign();

        // Create gift wrap (kind 1059)
        const giftWrapEvent = new NDKEvent(ndk);
        giftWrapEvent.kind = 1059;
        giftWrapEvent.created_at = time;
        giftWrapEvent.tags = [
            ['p', merchantPubkey]
        ];

        // Generate random keypair for gift wrap
        const randomPrivateKey = generateSecretKey();
        const randomPubkey = getPublicKey(randomPrivateKey);
        const randomSigner = new NDKPrivateKeySigner(randomPrivateKey);

        // Encrypt the seal
        giftWrapEvent.pubkey = randomPubkey;
        giftWrapEvent.content = await randomSigner.encrypt(
            merchantNdkUser,
            JSON.stringify(sealEvent),
        );


        // Sign the gift wrap with random private key
        await giftWrapEvent.sign(randomSigner);

        return giftWrapEvent;
    } catch (e) {
        console.error("[createOrder.ts]: There was an issue creating the order", e);
        return { success: false, message: "[createOrder.ts]: There was an issue creating the order" };
    }
}
