import { useEffect, useRef, useState } from "preact/hooks";

interface TextItem {
  category: string;
  color: string;
  text: string;
  pause?: boolean;
}

export const InfiniteMarquee = ({ items, direction = 'left', speed = 30, className = '', pause = false }: { items: TextItem[], direction?: 'left' | 'right', speed?: number, className?: string, pause?: boolean }) => {
  const [isPaused, setIsPaused] = useState(pause);
  
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Estilos en línea para las animaciones
  const containerStyle = {
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
  };

  const marqueeStyle = {
    display: 'flex',
    width: 'fit-content'
  };

  const contentStyle = {
    display: 'flex',
    animation: `${direction === 'left' ? 'scroll' : 'scroll-right'} ${speed}s linear infinite`,
    animationPlayState: isPaused ? 'paused' : 'running'
  };

  const itemStyle = {
    flexShrink: 0,
    padding: '24px var(--card-gap) 21px',
    borderRadius: '18px'
  };

  // Efectos para manejar eventos de hover
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);
    
    marquee.addEventListener('mouseenter', handleMouseEnter as EventListener);
    marquee.addEventListener('mouseleave', handleMouseLeave as EventListener);
    
    return () => {
      marquee.removeEventListener('mouseenter', handleMouseEnter as EventListener);
      marquee.removeEventListener('mouseleave', handleMouseLeave as EventListener);
    };
  }, []);

  return (
    <>
      <div class={`marquee-container will-change-transform flex ${className}`} style={containerStyle}>
        <div class={`marquee ${direction}`} style={marqueeStyle} ref={marqueeRef}>
          <ul class="marquee-content flex list-none m-0 p-0 shrink-0" style={contentStyle}>
            {
              items.length > 0 ? (
                items.map(({ category, color, text }) => (
                  <li class="marquee-item flex transition-opacity duration-150 ease-out bg-white rounded-lg flex-col text-left w-[304px] p-6 min-h-48 m-2" style={itemStyle}>
                    <p class="will-change-opacity text-gray-500 text-sm leading-5 font-normal tracking-tight m-0 p-0">
                      {category}
                    </p>
                    <p
                      class="will-change-opacity mt-auto text-2xl leading-7 font-semibold tracking-wide"
                      style={{ color }}
                    >
                      {text || "Texto no disponible"}
                    </p>
                  </li>
                ))
              ) : (
                <div class="p-4 text-black">No hay elementos para mostrar</div>
              )
            }
          </ul>
          <ul
            aria-hidden="true"
            class="marquee-content flex list-none m-0 p-0 shrink-0"
            style={contentStyle}
          >
            {
              items.length > 0 ? (
                items.map(({ category, color, text }) => (
                  <li class="marquee-item flex transition-opacity duration-150 ease-out bg-white rounded-lg flex-col text-left w-[304px] p-6 min-h-48 m-2" style={itemStyle}>
                    <p class="will-change-opacity text-gray-500 text-sm leading-5 font-normal tracking-tight m-0 p-0">
                      {category}
                    </p>
                    <p
                      class="will-change-opacity mt-auto text-2xl leading-7 font-semibold tracking-wide"
                      style={{ color }}
                    >
                      {text || "Texto no disponible"}
                    </p>
                  </li>
                ))
              ) : (
                <div class="p-4 text-black">No hay elementos para mostrar</div>
              )
            }
          </ul>
        </div>
      </div>
            <style>
        {`
          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-100%);
            }
          }
          
          @keyframes scroll-right {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </>
  )
}
