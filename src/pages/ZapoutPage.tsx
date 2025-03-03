import { useCartStore } from "@/stores/CartStore.tsx";
import ShippingForm from "@/layouts/ShippingForm.tsx";
import { useActiveUser } from "nostr-hooks";
import { createOrder } from "@/lib/nostr/createOrder.ts";
import { useCallback } from "react";
import { LoginWidget } from "@/components/LoginWidget.tsx";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import postOrder from "@/lib/nostr/postOrder.ts";

// Define CartItem based on usage in the component
interface CartItem {
    eventId: string;
    productId: string;
    merchantPubkey: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
}

// Import or define OrderData to match the refactored createOrder function
interface OrderData {
    items: Array<{
        eventId: string;
        productId: string;
        quantity: number;
        price: number;
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

async function prepareOrder(
    cart: CartItem[],
    shippingInfo: unknown,
    pubkey: string,
) {
    const isMultiMerchantCart = cart.some(
        (item) => item.merchantPubkey !== cart[0].merchantPubkey,
    );

    if (isMultiMerchantCart) {
        console.error("TODO: Process multi-merchant carts");
        return;
    }

    // Convert shipping info to a string if it's not already
    const addressString = typeof shippingInfo === "string"
        ? shippingInfo
        : JSON.stringify(shippingInfo);

    // Create the order data using the updated OrderData structure
    const orderData: OrderData = {
        items: cart.map((item) => ({
            // Ensure these are valid hex strings of the right length
            eventId: item.eventId.length === 64
                ? item.eventId
                : item.eventId.padEnd(64, "0"),
            productId: item.productId.length === 64
                ? item.productId
                : item.productId.padEnd(64, "0"),
            quantity: item.quantity,
            price: item.price,
        })),
        address: addressString,
        message: `Order from ${pubkey.substring(0, 8)}...`,
    };

    // Create the order with the updated structure
    const order = await createOrder(orderData, cart[0].merchantPubkey);

    if (!order || !(order instanceof NDKEvent)) {
        console.error(
            "[ZapoutPage.prepareOrder] Failed to create order. Error:",
            order?.message || "Unknown error",
        );
        // TODO: Display error to user
        return;
    }

    // Post the order
    postOrder(order, cart[0].merchantPubkey);
}

export const ZapoutPage = () => {
    const { cart } = useCartStore();
    const { activeUser } = useActiveUser();

    const handleSubmit = useCallback((shippingInfo: unknown) => {
        if (activeUser) {
            prepareOrder(cart, shippingInfo, activeUser?.pubkey);
        } else {
            console.error(
                "[ZapoutPage.handleSubmit] No active user, cannot submit order",
            );
        }
    }, [activeUser, cart]);

    return (
        <div>
            <h1>Zapout</h1>
            <ul>
                {cart.map((item) => (
                    <div
                        key={item.productId}
                        className="flex items-center justify-between mb-4"
                    >
                        <div>
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover"
                            />
                            <div>{item.name}</div>
                            <div>Price: {item.price || "Price Not Set"}</div>
                            <div>Quantity: {item.quantity}</div>
                        </div>
                    </div>
                ))}
            </ul>
            {activeUser
                ? (
                    <>
                        <h2>Hello, {activeUser.npub}</h2>
                        <ShippingForm
                            onSubmit={handleSubmit}
                            cartPriceUsd={cart.reduce(
                                (acc, item) => acc + item.price * item.quantity,
                                0,
                            )}
                            onShippingCostUpdate={() => {
                                console.log("Shipping cost updated");
                            }}
                        />
                    </>
                )
                : <LoginWidget />}
        </div>
    );
};
