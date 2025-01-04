import { useCartStore } from "@root/src/store/CartStore.tsx";
import ShippingForm from "@root/src/layouts/ShippingForm.tsx";
import { useActiveUser } from "nostr-hooks";
import { createNostrOrder } from "@root/src/lib/nostr/createOrder.ts";
import { useCallback } from "react";
import { LoginWidget } from "@root/src/components/LoginWidget.tsx";

async function prepareOrder(
    cart: CartItem[],
    shippingInfo: any,
    pubkey: string,
) {
    const isMultiMerchantCart = cart.some(
        (item) => item.merchantPubkey !== cart[0].merchantPubkey,
    );

    if (isMultiMerchantCart) {
        console.error("TODO: Process multi-merchant carts");
        return;
    }

    const orderData: OrderData = {
        items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
        })),
        shipping_id: "shipping_id",
        address: JSON.stringify(shippingInfo),
        customerPubkey: pubkey,
    };

    const order = await createNostrOrder(orderData, cart[0].merchantPubkey);
    console.log("Order", order);
}

export const ZapoutPage = () => {
    const { cart } = useCartStore();
    const { activeUser } = useActiveUser();

    const handleSubmit = useCallback((shippingInfo: any) => {
        if (activeUser) {
            prepareOrder(cart, shippingInfo, activeUser?.pubkey);
        } else {console.error(
                "[ZapoutPage.handleSubmit] No active user, cannot submit order",
            );}
    }, [activeUser, cart]);

    return (
        <div>
            <h1>Zapout</h1>
            <ul>
                {cart.map((item) => (
                    <div
                        key={item.id}
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
