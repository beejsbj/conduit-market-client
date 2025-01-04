import { useCartStore } from "@root/src/store/CartStore.tsx";

export const ZapoutPage = () => {
    const { cart } = useCartStore();

    return (
        <div>
            <h1>Zapout</h1>
            <ul>
                {cart.map((product) => (
                    <li key={product.id}>
                        {product.name} - {product.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};
