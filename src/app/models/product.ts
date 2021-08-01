export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    offerPrice: number;
    productStatus: string;
    publicationStatus: string;
    showPhone: boolean;
    userId: string;
    pictures: [];
    categoryId: string;
    createdAt: any;
}
