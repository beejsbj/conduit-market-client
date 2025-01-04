import { create } from "npm:zustand";

interface CartState {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    decreaseQuantity: (product: CartItem) => void;
    removeAllFromCart: (product: CartItem) => void;
}

type CartItem = {
    id: string;
    image: string;
    name: string;
    price: number;
    currency: string;
    quantity: number;
};

export const useCartStore = create<CartState>((set, get) => ({
    cart: [],
    addToCart: (product: CartItem) => {
        const existingProduct = get().cart.find((p) => p.id === product.id);
        if (existingProduct) {
            set((state) => ({
                cart: state.cart.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                ),
            }));
        } else {
            set((state) => ({
                cart: [...state.cart, { ...product, quantity: 1 }],
            }));
        }
    },
    decreaseQuantity: (product: CartItem) => {
        const existingProduct = get().cart.find((p) => p.id === product.id);
        if (existingProduct) {
            if (existingProduct.quantity === 1) {
                set((state) => ({
                    cart: state.cart.filter((p) => p.id !== product.id),
                }));
            } else {
                set((state) => ({
                    cart: state.cart.map((p) =>
                        p.id === product.id
                            ? { ...p, quantity: p.quantity - 1 }
                            : p
                    ),
                }));
            }
        }
    },
    removeAllFromCart: (product: CartItem) =>
        set((state) => ({
            cart: state.cart.filter((p) => p.id !== product.id),
        })),
}));
