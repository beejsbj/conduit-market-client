import React, { type ReactNode } from "react";
import useWindowState, { WindowTypes } from "@/stores/useWindowState";

export interface SubWindowProps {
    children: ReactNode;
    windowId?: WindowTypes;
    isFullScreen?: boolean;
    title?: string;
    disableClickOutside?: boolean;
    onClose?: () => void;
    className?: string;
    [key: string]: any;
}

/**
 * SubWindow component that displays content in a modal-like window
 * Integrates with useWindowState for window management
 */
const SubWindow: React.FC<SubWindowProps> = ({
    children,
    windowId,
    isFullScreen = false,
    title = "",
    disableClickOutside = false,
    onClose,
    className = "",
    ...props
}) => {
    const { closeWindow } = useWindowState();

    // Handle close button click or overlay click
    const handleClose = (): void => {
        if (onClose) {
            onClose();
        } else if (windowId) {
            closeWindow(windowId);
        }
    };

    // Handle click on the overlay (background)
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!disableClickOutside && e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`}
            onClick={handleOverlayClick}
        >
            <div
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                    isFullScreen ? "w-full h-full" : "max-w-4xl w-full"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div
                    className={`p-4 ${
                        isFullScreen ? "overflow-auto h-[calc(100%-4rem)]" : ""
                    }`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SubWindow;
