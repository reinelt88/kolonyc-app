export interface Payment {
    id?: string;
    status: string;
    houseId: string;
    month: number;
    year: number;
    evidence: string;
    referenceNumber: string;
    type: string;
    notes: string;
    amount: number;
    createdAt: any;
}
