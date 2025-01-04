import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./CardComponents.tsx";
import Button from "@/components/Buttons/Button.tsx";
import { Badge } from "@/components/Badge.tsx";
import { ShoppingCart } from "lucide-react";
import { NDKEvent } from "ndk";
import { useCartStore } from "@root/src/store/CartStore.tsx";

const ProductCard = ({ event }: { event: NDKEvent }) => {
    const { content, tags } = event;
    const { addToCart } = useCartStore();

    // Extract content fields
    const {
        name,
        description,
        images,
        currency,
        price,
        specs,
    } = content;

    // Function to render specs as badges
    const renderSpecs = () => {
        if (!specs || Object.keys(specs).length === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(specs).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="text-sm">
                        {`${key}: ${value}`}
                    </Badge>
                ))}
            </div>
        );
    };

    // Format price with currency
    const formatPrice = () => {
        if (price === 0) return "Price not set";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency || "USD",
        }).format(price);
    };

    return (
        <Card className="w-full max-w-sm overflow-hidden">
            {images && images.length > 0 && (
                <div className="relative w-full h-48 overflow-hidden">
                    <img
                        src={images[0]}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "/api/placeholder/400/300";
                            e.target.alt = "Product image placeholder";
                        }}
                    />
                </div>
            )}

            <CardHeader>
                <CardTitle className="text-xl font-semibold">{name}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="inline-flex px-3 py-1 text-sm font-medium bg-gray-700 text-gray-100 rounded-md mb-4">
                    {formatPrice()}
                </div>
                {renderSpecs()}
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <Button
                    className="w-full"
                    onClick={() => {
                        addToCart({
                            id: event.id,
                            image: images[0],
                            name,
                            price,
                            currency,
                            quantity: 1,
                        });
                    }}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
