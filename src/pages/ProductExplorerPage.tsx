import { CartDrawer } from "@root/src/layouts/CartDrawer.tsx";
import ProductGrid from "@root/src/layouts/ProductGrid.tsx";

export const ProductExplorerPage = () => {
    return (
        <>
            <CartDrawer />
            <ProductGrid />
        </>
    );
};
