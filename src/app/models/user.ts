export interface User {
    id?: string;
    uid: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    displayName: string;
    profilePicture: string;
    colonyId: string;
    houseId?: string;
    token: string;
    connected: boolean;
    savedProducts: string [];
    createdAt: any;
}
