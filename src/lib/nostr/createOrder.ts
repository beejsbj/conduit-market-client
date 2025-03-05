import { generateSecretKey, getPublicKey } from 'nostr-tools';
import { getNdk } from "@/lib/nostr/NdkService.ts";
import { NDKEvent, type NDKTag, NDKPrivateKeySigner, NDKUser } from "@nostr-dev-kit/ndk";
import { OrderUtils, validateOrder } from "nostr-commerce-schema";

export interface OrderData {
    items: Array<{
        eventId: string;
        productId: string;
        quantity: number;
        price: number; // For amount calculation
    }>;
    shipping?: {
        eventId: string;
        methodId: string;
    };
    address?: string;
    phone?: string;
    email?: string;
    message?: string;
}

export async function createOrder(orderData: OrderData, merchantPubkey: string): Promise<NDKEvent | { success: false, message: string }> {
    try {
        const { items } = orderData;
        if (!items || items.length === 0) return { success: false, message: "No items in order" };

        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const orderId = OrderUtils.generateOrderId();

        // Prepare the order event that matches OrderSchema
        const orderEvent = {
            kind: 16,
            tags: [
                ["p", merchantPubkey],
                ["subject", "order-info"],
                ["type", "1"],
                ["order", orderId],
                ["amount", Math.floor(totalAmount).toString()], // Ensure it's an integer
                ...items.map(item => [
                    "item",
                    // Ensure item format matches the expected addressable format pattern
                    `30402:${merchantPubkey}:${item.productId}`,
                    item.quantity.toString()
                ]),
                ...(orderData.shipping ? [["shipping", `30406:${orderData.shipping.eventId}:${orderData.shipping.methodId}`]] : []),
                ...(orderData.address ? [["address", orderData.address]] : []),
                ...(orderData.phone ? [["phone", orderData.phone]] : []),
                ...(orderData.email ? [["email", orderData.email]] : [])
            ],
            content: `[Conduit Market Client] - [Order] - ${orderData.message || ""}`
        };

        const validationResult = validateOrder(orderEvent);
        if (!validationResult.success) {
            return {
                success: false,
                message: `Invalid order structure: ${validationResult.error.message}`
            };
        }

        const ndk = await getNdk();

        // Create the NDK event
        const ndkOrderEvent = new NDKEvent(ndk);
        ndkOrderEvent.kind = orderEvent.kind;
        ndkOrderEvent.content = orderEvent.content;
        ndkOrderEvent.tags = orderEvent.tags as NDKTag[];

        // Create seal (kind 13)
        const sealEvent = new NDKEvent(ndk);
        sealEvent.kind = 13;
        const time = Math.floor(Date.now() / 1000);
        sealEvent.created_at = time;

        const merchantNdkUser = new NDKUser({ pubkey: merchantPubkey });

        // Encrypt the order content
        sealEvent.content = await ndk.signer!.encrypt(
            merchantNdkUser,
            JSON.stringify(ndkOrderEvent)
        );

        console.log("Signing seal event for merchant:", merchantPubkey);

        await sealEvent.sign();

        console.log("Creating gift wrap event for merchant:", merchantPubkey);

        // Create gift wrap (kind 1059)
        const giftWrapEvent = new NDKEvent(ndk);
        giftWrapEvent.kind = 1059;
        giftWrapEvent.created_at = time;
        giftWrapEvent.tags = [['p', merchantPubkey]];

        console.log("Generating random keypair for gift wrap");

        // Generate random keypair for gift wrap
        const randomPrivateKey = generateSecretKey();
        const randomPubkey = getPublicKey(randomPrivateKey);
        const randomSigner = new NDKPrivateKeySigner(randomPrivateKey);

        console.log("Encrypting seal event for merchant:", merchantPubkey);

        // Encrypt the seal
        giftWrapEvent.pubkey = randomPubkey;
        giftWrapEvent.content = await randomSigner.encrypt(
            merchantNdkUser,
            JSON.stringify(sealEvent),
        );

        console.log("Signing gift wrap event for merchant:", merchantPubkey);

        // Sign the gift wrap with random private key
        await giftWrapEvent.sign(randomSigner);

        console.log("Order event created for merchant:", merchantPubkey);

        return giftWrapEvent;
    } catch (e) {
        console.error("[createOrder.ts]: There was an issue creating the order", e);
        return { success: false, message: "[createOrder.ts]: There was an issue creating the order" };
    }
}
