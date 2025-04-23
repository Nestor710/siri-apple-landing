export interface SiriDoesAll extends CategoryData {
    image: {
        icon: any;
        width?: number;
        height?: number;
    };
    
}

export interface CategoryData {
    dataId?: string;
    category: string;
    color: string;
    texts?: string[];
    allText?: CategoryData[]
}