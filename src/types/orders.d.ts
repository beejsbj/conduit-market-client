interface OrderItem {
    product_id: string;
    quantity: number;
}

interface OrderData {
    items: OrderItem[];
    shipping_id: string;
    customerPubkey: string;
    address?: string;
    email?: string;
    phone?: string;
    message?: string;
}
