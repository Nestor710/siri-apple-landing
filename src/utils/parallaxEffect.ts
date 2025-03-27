import { debounce } from "./debounce";

export function setupParallaxEffect({
    selector,
    startElevation = 90,
    endElevation = 0,
    easingFactor = 0.1,
    progressScale = 3.5
}: {
    selector: string;
    startElevation?: number;
    endElevation?: number;
    easingFactor?: number;
    progressScale?: number;
}) {
    // Early return if used in SSR or if selector is invalid
    if (typeof window === 'undefined') return;

    const parallaxElement = document.querySelector(selector) as HTMLElement;
    if (!parallaxElement) return;

    let currentElevation = startElevation;
    let animationFrameId: number | null = null;

    function calculateProgress(rect: DOMRect): number {
        return Math.min(Math.max(
            (window.innerHeight - rect.top) * progressScale / window.innerHeight, 
            0
        ), 1);
    }

    function updateParallax() {
        const rect = parallaxElement.getBoundingClientRect();
        const progress = calculateProgress(rect);
        
        const targetElevation = startElevation - progress * (startElevation - endElevation);
        currentElevation += (targetElevation - currentElevation) * easingFactor;

        // More efficient transform with translate
        parallaxElement.style.transform = `translateY(${currentElevation.toFixed(3)}px)`;

        animationFrameId = requestAnimationFrame(updateParallax);
    }

    const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Prevent multiple animation frames
                if (!animationFrameId) {
                    updateParallax();
                }
            } else {
                // Clean up animation frame
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        });
    }, {
        threshold: 0
    });

    function setupParallaxEffects() {
        const isMobile = window.innerWidth < 768;

        // Reset initial state
        parallaxElement.style.transform = `translateY(${startElevation}px)`;
        currentElevation = startElevation;

        // Disconnect and potentially re-observe based on device
        intersectionObserver.disconnect();
        if (!isMobile) {
            intersectionObserver.observe(parallaxElement);
        }
    }

    // Setup initial state and add resize listener
    setupParallaxEffects();
    const debouncedSetup = debounce(setupParallaxEffects, 250);
    window.addEventListener('resize', debouncedSetup);

    // Return cleanup function for potential component unmount
    return () => {
        window.removeEventListener('resize', debouncedSetup);
        intersectionObserver.disconnect();
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}