import { SIRI_DOES_ALL } from '@/consts/SiriDoesAll';
import { useState, useEffect, useMemo, useCallback } from 'preact/hooks';
import { InfiniteMarquee } from './ActionsCardCarousel';

export type TextItem = {
  category: string;
  color: string;
  text: string;
};

type CategoryData = {
  dataId: string;
  category: string;
  color: string;
  texts: string[];
  allText?: TextItem[];
};

/**
 * Obtiene elementos aleatorios de todas las categorías
 */
const getRandomItems = (count: number): TextItem[] => {
  const categories = SIRI_DOES_ALL.filter(item => item.category !== 'All');
  const items: TextItem[] = [];
  const itemsPerCategory = Math.ceil(count / categories.length);
  
  for (const category of categories) {
    if (!category.texts?.length) continue;
    
    for (let i = 0; i < itemsPerCategory && items.length < count; i++) {
      const randomIndex = Math.floor(Math.random() * category.texts.length);
      items.push({
        category: category.category,
        color: category.color,
        text: category.texts[randomIndex]
      });
    }
  }

  items.sort(() => Math.random() - 0.5);
  
  return items;
};

/**
 * Crea la categoría predeterminada "All"
 */
const getDefaultCategory = (): CategoryData => ({
  dataId: 'all', 
  category: 'All', 
  color: 'red', 
  texts: [], 
  allText: getRandomItems(30)
});

/**
 * Hook para gestionar la selección de categorías
 */
function useCategorySelection() {
  const [selected, setSelected] = useState<CategoryData>(getDefaultCategory());

  const rows = useMemo(() => {
    const items = selected.category === 'All'
      ? selected.allText || []
      : (selected.texts || []).map(text => ({
          category: selected.category,
          color: selected.color,
          text
      }));
      
    return [
      items.slice(0, 10),
      items.slice(10, 20),
      items.slice(20, 30)
    ];
  }, [selected]);

  const handleEvent = useCallback((event: CustomEvent<{ selected: string }>) => {
    const id = event.detail.selected.toLowerCase();
    const found = id === 'all'
      ? getDefaultCategory()
      : SIRI_DOES_ALL.find(item => item.dataId?.toLowerCase() === id);
    
    setSelected(found as CategoryData);
  }, []);

  useEffect(() => {
    // Registrar listener y configurar categoría inicial
    const typedHandler = handleEvent as EventListener;
    document.addEventListener('categorySelected', typedHandler);
    handleEvent(new CustomEvent('categorySelected', { detail: { selected: 'all' } }));

    return () => {
      document.removeEventListener('categorySelected', typedHandler);
    };
  }, [handleEvent]);

  return { rows };
}

export default function SiriActionsContent() {
  const { rows } = useCategorySelection();
  const [firstRow, secondRow, thirdRow] = rows;
  const [isPaused, setIsPaused] = useState(false);
  
  return (
    <section 
    className="transition-opacity duration-300 ease-in-out pt-8 bg-[#152046] flex flex-wrap"
    style={{ "--card-width": "304px", "--card-gap": "24px" } as any}>
    <div className="w-full overflow-hidden relative transition-all duration-600 ease-out">
      <InfiniteMarquee items={firstRow} direction="left" speed={200} className="" pause={isPaused} />
      <InfiniteMarquee items={secondRow} direction="right" speed={150} className="" pause={isPaused} />
      <InfiniteMarquee items={thirdRow} direction="left" speed={200} className="" pause={isPaused} />
    </div>
    <div className="text-center relative pb-[180px] mt-[18px] mr-[30px] flex flex-1 justify-end">
      <button className="cursor-pointer" onClick={() => setIsPaused(!isPaused)}>
        
          <img 
          src={`/src/assets/svg/${!isPaused ? 'pause' : 'play'}-icon.svg`} 
          width={36} 
          height={36} 
          className=""
          alt={isPaused ? 'Pause Icon' : 'Play Icon'} 
        />
        
      </button>
    </div>
  </section>
  );
}
