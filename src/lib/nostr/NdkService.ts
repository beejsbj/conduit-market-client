import { DEFAULT_RELAYS } from "@/lib/constants/defaultRelays.ts";
import NDK, { NDKNip07Signer } from "@nostr-dev-kit/ndk";

// Service for NDK usage outside of nostr-hooks. Uses the same NDK instance as nostr-hooks

export class NDKService {
    private static instance: NDKService | null = null;
    private ndk: NDK | null = null;

    constructor(ndk: NDK) {
        this.ndk = ndk;
        NDKService.instance = this;
    }

    public static getInstance(): NDKService {
        if (!NDKService.instance) throw new Error('NDKService not initialized. This should be done in App.tsx');
        return NDKService.instance;
    }

    public initialize(): Promise<NDK> {
        if (this.ndk) return Promise.resolve(this.ndk);
        else throw new Error('NDK not initialized');
    }

    // Method to reset the instance (mainly for testing purposes)
    public static reset(): void {
        NDKService.instance = null;
    }
}

export async function getNdk(): Promise<NDK> {
    const service = NDKService.getInstance();
    return await service.initialize();
}
