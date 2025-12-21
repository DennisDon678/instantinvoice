"use client";

import { useEffect } from "react";

export default function PWARegistration() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            const handleLoad = () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then((reg) => {
                        console.log("SW registered with scope:", reg.scope);
                    })
                    .catch((err) => {
                        console.error("SW registration failed:", err);
                    });
            };

            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    return null;
}
