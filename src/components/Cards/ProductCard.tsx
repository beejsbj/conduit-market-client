import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./CardComponents.tsx";
import Button from "@/components/Buttons/Button.tsx";
import { ShoppingCart } from "lucide-react";
import { NDKEvent } from "ndk";
import { useCartStore } from "@root/src/store/CartStore.tsx";

function extractValuesFromTags(tags: string[]): Record<string, any> {
    const result = {};

    tags.forEach((tag) => {
        const [key, ...values] = tag;
        const pluralKey = key + "s";

        if (key === "image") {
            if (!result["images"]) {
                result["images"] = [];
            }
            result["images"].push(...values);
        } else if (!result[key] && !result[pluralKey]) {
            result[key] = values.length === 1 ? values[0] : values;
        } else {
            const targetKey = result[key] ? key : pluralKey;
            if (!Array.isArray(result[targetKey])) {
                result[targetKey] = [result[targetKey]];
            }
            result[targetKey].push(...values);
            if (targetKey === key) {
                result[pluralKey] = result[targetKey];
                delete result[key];
            }
        }
    });
    return result;
}

const ProductCard = ({ event }: { event: NDKEvent }) => {
    const { content, tags, pubkey, id: eventId } = event;
    const { addToCart } = useCartStore();

    // Extract values from tags
    const {
        d: productId,
        title: name,
        images,
        price: priceArray,
    } = extractValuesFromTags(tags);

    const price: number = parseFloat(priceArray[0] || "0");
    const currency: string = priceArray[1] || "USD";

    // Format price with currency
    const formatPrice = () => {
        if (price === 0) return "Price not set";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
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
                    {content}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="inline-flex px-3 py-1 text-sm font-medium bg-gray-700 text-gray-100 rounded-md mb-4">
                    {formatPrice()}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <Button
                    className="w-full"
                    onClick={() => {
                        addToCart({
                            eventId,
                            productId,
                            tags,
                            image: images[0],
                            name,
                            price,
                            currency,
                            quantity: 1,
                            merchantPubkey: pubkey,
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
