export interface Patient {
    _id?: string;
    id?: string;
    name: string;
    email?: string;
    phone: string;
    age: number;
    gender: string;
    address?: string;
    admissionDate?: string;
}