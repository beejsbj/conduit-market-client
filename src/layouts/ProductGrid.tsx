import React, { useEffect } from "react";
import { useSubscription } from "nostr-hooks";
import ProductCard from "@/components/Cards/ProductCard.tsx";

const ProductGrid: React.FC = () => {
    const subId = "all-events";
    const { events, isLoading, createSubscription } = useSubscription(subId);

    useEffect(() => {
        // Create subscription with proper filters
        const filters = {
            filters: [{
                kinds: [30018],
                limit: 50,
            }],
        };

        createSubscription(filters);

        // Log when subscription is created
        console.log("Created subscription with filters:", filters);
    }, [createSubscription]);

    useEffect(() => {
        // Log whenever new events are received
        if (events && events.length > 0) {
            console.log("Received events:", events);
        }
    }, [events]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg text-gray-500">Loading events...</div>
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-lg text-gray-500">
                    No events found. Try posting a note!
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => {
                    const parsedContent = JSON.parse(event.content);
                    const processedEvent = {
                        ...event,
                        content: parsedContent,
                    };
                    return (
                        <ProductCard key={event.id} event={processedEvent} />
                    );
                })}
            </div>
        </div>
    );
};

export default ProductGrid;
