export interface BillItem {
    service: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Bill {
    _id?: string;
    patient: string | { _id: string; name: string; phone: string };
    items: BillItem[];
    subtotal: number;
    discount: number;
    tax: number;
    grandTotal: number;
    status?: string;
    createdAt?: string;
}