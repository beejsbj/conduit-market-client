import { generateSecretKey, getPublicKey } from 'nostr-tools';
import { NDK, NDKEvent } from 'ndk';


export async function createNostrOrder(ndk: NDK, orderData: OrderData, merchantPubkey: string): Promise<NDKEvent> {
    // Create the order content following NIP-15 structure
    const orderContent = {
        id: crypto.randomUUID(), // Generate unique order ID
        type: 0, // New order type
        address: orderData.address,
        message: orderData.message || '',
        contact: {
            nostr: orderData.customerPubkey,
            email: orderData.email,
            phone: orderData.phone
        },
        items: orderData.items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        })),
        shipping_id: orderData.shipping_id
    };

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

    // Encrypt the DM content using NIP-44
    sealEvent.content = await ndk.encrypt(
        JSON.stringify(dmEvent),
        merchantPubkey
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
    giftWrapEvent.pubkey = randomPubkey;

    // Encrypt the seal using NIP-44
    giftWrapEvent.content = await ndk.encrypt(
        JSON.stringify(sealEvent),
        merchantPubkey,
        randomPrivateKey
    );

    // Sign the gift wrap with random private key
    await giftWrapEvent.sign(randomPrivateKey);

    return giftWrapEvent;
}
