export interface Colony {
    id?: string;
    name: string;
    picture: string;
    type: string;
    usePaypal: boolean;
    paypalClientId: string;
    paypalClientSecret: string;
    address: {
        country: string;
        number: string;
        municipality: string;
        postalCode: number;
        state: string;
        street: string;
    };
    createdAt: any;
}
