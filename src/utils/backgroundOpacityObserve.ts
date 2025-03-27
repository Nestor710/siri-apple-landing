export function createBackgroundOpacityObserver(
    bgSelector: string, 
    referenceSelector: string, 
    options: {
        duration?: number,
        threshold?: number
    } = {}
) {
    const {
        duration = 300,
        threshold = 0
    } = options;

    // Función para animar la opacidad
    const animateOpacity = (
        bgReference: HTMLElement, 
        startTime: number, 
        startValue: number, 
        endValue: number
    ) => {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        
        // Calcular progreso (0 a 1) con 8 decimales
        const progress = Math.min(elapsed / duration, 1);
        const value = Number(
            (startValue + (endValue - startValue) * progress).toFixed(8)
        );
        
        // Actualizar opacidad
        bgReference.style.opacity = `${value}`;
        
        // Continuar animación si no está completa
        if (progress < 1) {
            requestAnimationFrame((time) => animateOpacity(bgReference, startTime, startValue, endValue));
        }
    };

    // Crear el Intersection Observer
    const intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const bgReference = document.querySelector(bgSelector) as HTMLElement;
            
            if (entry.isIntersecting) {
                // Transición de 0 a 1 cuando entra en el viewport
                animateOpacity(bgReference, performance.now(), 0, 1);
            } else {
                // Transición de 1 a 0 cuando sale del viewport
                animateOpacity(bgReference, performance.now(), 1, 0);
            }
        });
    }, {
        threshold
    });

    // Observar el elemento de referencia
    const referenceElement = document.querySelector(referenceSelector);
    if (referenceElement) {
        intersectionObserver.observe(referenceElement);
    }

    // Retornar el observer por si se necesita desconectar o realizar otras operaciones
    return intersectionObserver;
}