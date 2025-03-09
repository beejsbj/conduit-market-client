import { create } from 'zustand';

export enum WindowTypes {
    LOGIN = 'LOGIN',
}

export interface WindowProps {
    title?: string;
    isFullScreen?: boolean;
    disableClickOutside?: boolean;
    [key: string]: any;
}

export interface WindowItem {
    id: WindowTypes;
    props: WindowProps;
}

export interface WindowState {
    windowStack: WindowItem[];
    pushWindow: (windowId: WindowTypes, props?: WindowProps) => void;
    popWindow: () => void;
    closeWindow: (windowId: WindowTypes) => void;
    closeAllWindows: () => void;
    findWindow: (windowId: WindowTypes) => WindowItem | undefined;
    isWindowOpen: (windowId: WindowTypes) => boolean;
    getTopWindow: () => WindowItem | null;

    componentRegistry: WindowComponentRegistry;
    registerComponent: (windowType: WindowTypes, component: React.ComponentType<any>) => void;
    getComponent: (windowType: WindowTypes) => React.ComponentType<any> | undefined;
    registerComponents: (components: WindowComponentRegistry) => void;
}

export type WindowComponentRegistry = {
    [key in WindowTypes]?: React.ComponentType<any>;
};

/**
 * Zustand store for managing a stack of windows
 * Provides functionality to push/pop windows, search by ID, and control visibility
 */
const useWindowState = create<WindowState>((set, get) => ({
    // Stack of open windows (most recent at the end)
    windowStack: [],

    // Component registry
    componentRegistry: {},

    // Push a new window to the stack
    pushWindow: (windowId: WindowTypes, props: WindowProps = {}) => set(state => ({
        windowStack: [...state.windowStack, { id: windowId, props }]
    })),

    // Remove the most recent window from the stack
    popWindow: () => set(state => ({
        windowStack: state.windowStack.slice(0, -1)
    })),

    // Close a specific window by ID
    closeWindow: (windowId: WindowTypes) => set(state => ({
        windowStack: state.windowStack.filter(window => window.id !== windowId)
    })),

    // Close all windows
    closeAllWindows: () => set({ windowStack: [] }),

    // Find a window by ID (returns the window object or undefined)
    findWindow: (windowId: WindowTypes) => {
        const { windowStack } = get();
        return windowStack.find(window => window.id === windowId);
    },

    // Check if a window with the given ID is open
    isWindowOpen: (windowId: WindowTypes) => {
        const { windowStack } = get();
        return windowStack.some(window => window.id === windowId);
    },

    // Get the top-most (most recently opened) window
    getTopWindow: () => {
        const { windowStack } = get();
        return windowStack.length > 0 ? windowStack[windowStack.length - 1] : null;
    },

    // Register a component for a specific window type
    registerComponent: (windowType: WindowTypes, component: React.ComponentType<any>) =>
        set(state => ({
            componentRegistry: {
                ...state.componentRegistry,
                [windowType]: component
            }
        })),

    // Get the component for a specific window type
    getComponent: (windowType: WindowTypes) => {
        const { componentRegistry } = get();
        return componentRegistry[windowType];
    },

    // Register multiple components at once
    registerComponents: (components: WindowComponentRegistry) =>
        set(state => ({
            componentRegistry: {
                ...state.componentRegistry,
                ...components
            }
        })),
}));

export default useWindowState;
