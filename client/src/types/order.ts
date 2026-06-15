export interface OrderType {
    _id: string;
    listingId: {
        _id: string;
        title: string;
        slug: string;
        artworkUrl: string;
    };
    colorId: {
        _id: string;
        name: string;
        color: string;
    };
    size: string;
    amount: number;
    isPaid: boolean;
    status: string;
    customerEmail: string;
    customerName: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phoneNumber: string;
    };
    createdAt: string;
}

export type GetUserOrdersResponse = {
    message: string;
    orders: OrderType[];
}

export type CreateOrderType = {
    listingId: string;
    colorId: string;
    size: string;
    customerEmail: string;
    customerName: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phoneNumber: string;
    };
}