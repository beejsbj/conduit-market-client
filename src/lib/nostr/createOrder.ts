import { generateSecretKey, getPublicKey } from 'nostr-tools';
import { getNdk } from "@root/src/lib/nostr/NdkService.ts";
import { NDKEvent, NDKTag, NDKPrivateKeySigner, NDKUser } from "@nostr-dev-kit/ndk";

// Order Communication Flow as per upgrated NIP-99 spec (see https://github.com/gzuuus/nips/blob/7d59ffe1e81bb0bedd64752f34298118c6e57ce6/XX.md)

type ItemTag = ['item', `30402:${string}:${string}`, number]; // Item in the order; follows addressable format of "30402:<pubkey>:<d-tag>"
type ShippingTag = ['shipping', `30406:${string}:${string}`]; // Shipping method; follows addressable format of "30406:<pubkey>:<d-tag>"
type OptionalTag = string[]
type OrderMessage = {
    kind: 15,
    tags: [
        ['p', string], // Merchant's pubkey
        ['subject', "order-info"],
        ['order', string], // Randomly-generated Order ID
        ItemTag,
        ...ItemTag[],   // Zero or more additional ItemTags
        ShippingTag,
        ...([OptionalTag] | OptionalTag[]) // Additional optional tags (zero or more)
    ],
    content: string // Note to the Merchant
}

export async function createOrder(orderData: OrderData, merchantPubkey: string): Promise<NDKEvent | { success: false, message: string }> {
    try {
        const { items } = orderData;
        if (!items || items.length === 0) return { success: false, message: "No items in order" };

        const itemTags: ItemTag[] = items.map(item => {
            return [
                'item',
                `30402:${item.eventId}:${item.productId}`,
                item.quantity
            ];
        });

        if (itemTags.length === 0) return { success: false, message: "No items in order" };

        const orderMessage: OrderMessage = {
            kind: 15,
            tags: [
                ["p", merchantPubkey],
                ["subject", "order-info"],
                ["order", crypto.randomUUID()],
                itemTags[0], // First required ItemTag
                ...itemTags.slice(1), // Rest of the ItemTags
                ...[ // Optional tags
                    orderData.address ? ['address', orderData.address] : undefined,
                    orderData.phone ? ['phone', orderData.phone] : undefined,
                    orderData.email ? ['email', orderData.email] : undefined
                ].filter((tag): tag is [string, string] => tag !== undefined)
            ],
            content: `[Conduit Market Client] - [Order] - ${orderData.message || ""}`
        };

        const ndk = await getNdk();

        // Create the unsigned DM event (kind 4)
        const dmEvent = new NDKEvent(ndk);
        dmEvent.kind = orderMessage.kind;
        dmEvent.content = orderMessage.content;
        dmEvent.tags = orderMessage.tags as NDKTag[];

        // Create seal (kind 13)
        const sealEvent = new NDKEvent(ndk);
        sealEvent.kind = 13;

        // Current time; a slight difference from NIP-17 proper, but better for order time tracking
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
