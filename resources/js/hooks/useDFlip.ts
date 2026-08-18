import { RefObject, useEffect, useRef } from 'react';

// Extend Window to include jQuery and DFLIP
declare global {
    interface Window {
        jQuery: any;
        DFLIP: any;
    }
}

export interface DFlipOptions {
    webgl?: boolean;
    autoEnableOutline?: boolean;
    autoEnableThumbnail?: boolean;
    overwritePDFOutline?: boolean;
    soundEnable?: boolean;
    backgroundColor?: string;
    autoPlay?: boolean;
    autoPlayDuration?: number;
    autoPlayStart?: boolean;
    hard?: string;
    maxTextureSize?: number;
    pageMode?: number;
    singlePageMode?: number;
    responsive?: boolean;
    transparent?: boolean;
    direction?: number;
    duration?: number;
    zoom?: number;
    enableSound?: boolean;
    height?: string | number;
}

/**
 * Custom hook for initializing and managing dFlip PDF viewer
 * @param containerRef - Reference to the container element
 * @param pdfURL - URL of the PDF to display
 * @param options - Configuration options for dFlip
 * @returns Reference to the flipbook instance
 */
const useDFlip = (
    containerRef: RefObject<HTMLDivElement>,
    pdfURL: string,
    options: DFlipOptions = {},
) => {
    const flipbookRef = useRef<any>(null);

    // Helper to wait for a global variable to be defined
    const waitForGlobal = (key: string, timeout = 5000): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (window[key as any]) {
                resolve();
                return;
            }

            const startTime = Date.now();
            const interval = setInterval(() => {
                if (window[key as any]) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error(`Timeout waiting for ${key}`));
                }
            }, 50);
        });
    };

    // Load style with existence check
    const loadStyle = (href: string): void => {
        if (document.querySelector(`link[href="${href}"]`)) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        document.head.appendChild(link);
    };

    // Load script and wait for specific global variable
    const loadScript = (src: string, globalKey?: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            // If global key is provided and exists, we're good
            if (globalKey && window[globalKey as any]) {
                resolve();
                return;
            }

            // Check if script is already in DOM
            const existingScript = document.querySelector(
                `script[src="${src}"]`,
            );
            if (existingScript) {
                if (globalKey) {
                    waitForGlobal(globalKey).then(resolve).catch(reject);
                } else {
                    resolve(); // Fallback if no global key tracked (unlikely for libs)
                }
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;

            script.onload = () => {
                if (globalKey) {
                    waitForGlobal(globalKey).then(resolve).catch(reject);
                } else {
                    resolve();
                }
            };

            script.onerror = () =>
                reject(new Error(`Failed to load script ${src}`));
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        // Skip initialization if we've already done it for this container
        if (
            containerRef.current &&
            containerRef.current.dataset.dflipInitialized === 'true'
        ) {
            return;
        }

        const initFlipbook = async () => {
            try {
                // First load the styles
                // First load the styles
                loadStyle('/dflip/css/dflip.min.css');

                // Configure DFLIP to use its own PDF.js
                window.DFLIP = window.DFLIP || {};
                window.DFLIP.defaults = window.DFLIP.defaults || {};
                window.DFLIP.defaults.pdfjsSrc = '/dflip/js/libs/pdf.min.js';
                window.DFLIP.defaults.pdfjsCompatibilitySrc =
                    '/dflip/js/libs/pdf.min.js';
                window.DFLIP.defaults.threejsSrc =
                    '/dflip/js/libs/three.min.js';
                // Removed mockupjsSrc to prevent indexOf error
                window.DFLIP.defaults.soundFile = '/dflip/sound/turn2.mp3';
                window.DFLIP.defaults.imagesLocation = '/dflip/images/';
                window.DFLIP.defaults.cMapUrl = '/dflip/js/libs/cmaps/';

                // 1. Load jQuery
                await loadScript('/dflip/js/libs/jquery.min.js', 'jQuery');

                // 2. Load Three.js and wait strictly for it
                await loadScript('/dflip/js/libs/three.min.js', 'THREE');
                if (!window.THREE) {
                    await new Promise<void>((resolve) => {
                        const checkInterval = setInterval(() => {
                            if (window.THREE) {
                                clearInterval(checkInterval);
                                resolve();
                            }
                        }, 50);
                        setTimeout(() => {
                            clearInterval(checkInterval);
                            resolve(); // Proceed anyway after timeout
                        }, 2000);
                    });
                }

                // 3. Load DFlip script
                await loadScript('/dflip/js/dflip.min.js');

                // 4. Wait for the flipBook plugin to be properly registered on jQuery fn
                if (window.jQuery && !window.jQuery.fn.flipBook) {
                    await new Promise<void>((resolve) => {
                        const checkInterval = setInterval(() => {
                            if (window.jQuery.fn.flipBook) {
                                clearInterval(checkInterval);
                                resolve();
                            }
                        }, 50);
                        setTimeout(() => clearInterval(checkInterval), 5000);
                    });
                }

                // 5. Artificial delay for internal state stabilization
                await new Promise((resolve) => setTimeout(resolve, 500));

                // Initialize dFlip with the container
                if (
                    containerRef.current &&
                    window.jQuery &&
                    window.jQuery.fn.flipBook
                ) {
                    // Check again to make sure it wasn't initialized during the async operations
                    if (
                        containerRef.current.dataset.dflipInitialized === 'true'
                    ) {
                        return;
                    }

                    const defaultOptions: DFlipOptions = {
                        webgl: true,
                        autoEnableOutline: false,
                        autoEnableThumbnail: false,
                        overwritePDFOutline: false,
                        soundEnable: false,
                        backgroundColor: 'rgb(30, 30, 30)',
                        autoPlay: false,
                        autoPlayDuration: 5000,
                        autoPlayStart: false,
                        hard: 'none',
                        maxTextureSize: 2048,
                        pageMode: window.innerWidth <= 768 ? 1 : 2,
                        singlePageMode: window.innerWidth <= 768 ? 1 : 0,
                        responsive: true,
                        transparent: false,
                        direction: 1,
                        duration: 800,
                        zoom: 1,
                        enableSound: false,
                        height: 'auto',
                    };

                    // Combine default options with user-provided options
                    const mergedOptions = { ...defaultOptions, ...options };

                    // Mark this container as initialized to prevent duplicate initialization
                    containerRef.current.dataset.dflipInitialized = 'true';

                    // Initialize dFlip
                    flipbookRef.current = window
                        .jQuery(containerRef.current)
                        .flipBook(pdfURL, mergedOptions);
                }
            } catch (error) {
                console.error('Error loading dFlip:', error);
            }
        };

        initFlipbook();

        // Cleanup function
        return () => {
            if (flipbookRef.current && flipbookRef.current.dispose) {
                flipbookRef.current.dispose();

                // Reset the initialization flag when the component unmounts
                if (containerRef.current) {
                    containerRef.current.dataset.dflipInitialized = 'false';
                }
            }
        };
    }, [containerRef, pdfURL, options]);

    return flipbookRef.current;
};

export default useDFlip;
