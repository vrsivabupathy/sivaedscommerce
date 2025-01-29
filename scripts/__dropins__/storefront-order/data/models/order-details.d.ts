import { AvailableActionsProps, MoneyProps, QueryType } from '../../types';

export type OrderAddressModel = {
    city: string;
    company: string;
    country: string;
    firstName: string;
    middleName: string;
    lastName: string;
    postCode: string;
    region: string;
    regionId: string;
    street: string[];
    telephone: string;
    customAttributes: {
        code: string;
        value: string;
    }[];
} | null;
export type OrderItemProductModel = {
    canonicalUrl?: string;
    id: string;
    image?: string;
    imageAlt?: string;
    name: string;
    productType: string;
    sku: string;
    thumbnail: {
        url: string;
        label: string;
    };
};
export type OrderItemModel = {
    type: string;
    discounted: boolean;
    id: string;
    productName: string;
    regularPrice: MoneyProps;
    price: MoneyProps;
    product: OrderItemProductModel;
    selectedOptions?: Array<{
        label: string;
        value: any;
    }>;
    totalQuantity: number;
    thumbnail: {
        label: string;
        url: string;
    };
    giftCard?: {
        senderName: string;
        senderEmail: string;
        recipientEmail: string;
        recipientName: string;
    };
    quantityCanceled: number;
    quantityInvoiced: number;
    quantityOrdered: number;
    quantityRefunded: number;
    quantityReturned: number;
    quantityShipped: number;
};
export type ShipmentItemsModel = {
    id: string;
    productSku: string;
    productName: string;
    orderItem: OrderItemModel;
};
export type ShipmentsTracingModel = {
    carrier: string;
    number: string;
    title: string;
};
export type ShipmentsModel = {
    id: string;
    number: string;
    tracking: ShipmentsTracingModel[];
    comments: {
        message: string;
        timestamp: string;
    }[];
    items: ShipmentItemsModel[];
};
export type OrderDataModel = {
    number: string;
    email?: string;
    token?: string;
    status: string;
    isVirtual: boolean;
    totalQuantity: number;
    shippingMethod?: string;
    carrier?: string;
    coupons: {
        code: string;
    }[];
    payments: {
        code: string;
        name: string;
    }[];
    shipping?: {
        code: string;
        amount: number;
        currency: string;
    };
    shipments: ShipmentsModel[];
    items: OrderItemModel[];
    grandTotal: MoneyProps;
    subtotal: MoneyProps;
    totalTax: MoneyProps;
    shippingAddress: OrderAddressModel;
    billingAddress: OrderAddressModel;
    availableActions: AvailableActionsProps[];
};
export type TransformedData<T extends QueryType> = T extends 'orderData' ? OrderDataModel : null;
//# sourceMappingURL=order-details.d.ts.map