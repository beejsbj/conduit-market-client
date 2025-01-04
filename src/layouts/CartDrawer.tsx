import { useCartStore } from "@root/src/store/CartStore.tsx";
import Button from "@root/src/components/Buttons/Button.tsx";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import ZapoutButton from "@/components/Buttons/ZapoutButton.tsx";

export const CartDrawer = () => {
    const { cart, decreaseQuantity, addToCart } = useCartStore();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <div className="fixed top-0 right-0 z-50">
            <Button onClick={handleOpen}>
                <ShoppingCart size={24} />
            </Button>
            <section
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold">Cart</h2>
                    <Button onClick={handleClose}>Close</Button>
                </header>
                <div className="p-4 flex flex-col gap-4">
                    {cart.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between mb-4"
                        >
                            <div>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover"
                                />
                                <div>{product.name}</div>
                            </div>
                            <div>
                                <Button
                                    onClick={() => decreaseQuantity(product)}
                                >
                                    -
                                </Button>
                                <span>{product.quantity}</span>
                                <Button onClick={() => addToCart(product)}>
                                    +
                                </Button>
                            </div>
                        </div>
                    ))}
                    <ZapoutButton>Zapout!</ZapoutButton>
                </div>
            </section>
        </div>
    );
};
