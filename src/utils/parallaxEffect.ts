import { debounce } from "./debounce";

export function setupParallaxEffect({
    selector,
    startElevation = 90,
    endElevation = 0,
    easingFactor = 0.1,
    progressScale = 3.5,
    type = 'translate' // 'translate' por defecto; usa 'opacity' para el efecto de opacidad
}: {
    selector: string;
    startElevation?: number;
    endElevation?: number;
    easingFactor?: number;
    progressScale?: number;
    type?: 'translate' | 'opacity';
}) {
    // Early return if used in SSR or if selector is invalid
    if (typeof window === 'undefined') return;

    const parallaxElement = document.querySelector(selector) as HTMLElement;
    if (!parallaxElement) return;

    // Usamos currentValue para mantener el estado actual,
    // siendo 1 el valor inicial para opacidad y startElevation para translate.
    let currentValue = type === 'opacity' ? 1 : startElevation;
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

        if (type === 'opacity') {
            // Para opacidad: interpolamos de 1 a 0 (puedes ajustar si deseas otros valores)
            const targetOpacity = 1 - progress;
            currentValue += (targetOpacity - currentValue) * easingFactor;
            parallaxElement.style.opacity = currentValue.toFixed(3);
        } else {
            // Para translate: interpolamos entre startElevation y endElevation
            const targetElevation = startElevation - progress * (startElevation - endElevation);
            currentValue += (targetElevation - currentValue) * easingFactor;
            parallaxElement.style.transform = `translateY(${currentValue.toFixed(3)}px)`;
        }

        animationFrameId = requestAnimationFrame(updateParallax);
    }

    const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Iniciar animación solo si no hay una ya en curso
                if (!animationFrameId) {
                    updateParallax();
                }
            } else {
                // Cancelar animación si el elemento no es visible
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

        // Reiniciar estado inicial según el tipo de efecto
        if (type === 'opacity') {
            parallaxElement.style.opacity = '1';
            currentValue = 1;
        } else {
            parallaxElement.style.transform = `translateY(${startElevation}px)`;
            currentValue = startElevation;
        }

        // Reconectar el observer (si es que no estamos en móvil)
        intersectionObserver.disconnect();
        if (!isMobile) {
            intersectionObserver.observe(parallaxElement);
        }
    }

    // Setup inicial y listener de resize
    setupParallaxEffects();
    const debouncedSetup = debounce(setupParallaxEffects, 250);
    window.addEventListener('resize', debouncedSetup);

    // Función de limpieza en caso de desmontar el componente
    return () => {
        window.removeEventListener('resize', debouncedSetup);
        intersectionObserver.disconnect();
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    };
}
