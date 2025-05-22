export interface Product {
    id?: string;            
    category_id: string;    // число от 1 до 15
    title: string;
    alias?: string;         // формируется из поля title через транслит на латиницу. Если такой алиас существует, то добавляется префикс -0
    content: string;
    price: string;
    old_price: string;
    status: string;         // (0, 1)
    keywords: string;
    description: string;
    hit: string;            // (0, 1)
} 