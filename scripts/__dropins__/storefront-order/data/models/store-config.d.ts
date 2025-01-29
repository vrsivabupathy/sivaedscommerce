export interface StoreConfigModel {
    orderCancellationEnabled: boolean;
    orderCancellationReasons: OrderCancellationReason[];
    shoppingCartDisplayPrice: 1 | 2 | 3;
    shoppingOrdersDisplayShipping: 1 | 2 | 3;
    shoppingOrdersDisplaySubtotal: 1 | 2 | 3;
    shoppingOrdersDisplayTaxGiftWrapping: string;
    shoppingOrdersDisplayFullSummary: boolean;
    shoppingOrdersDisplayGrandTotal: boolean;
    shoppingOrdersDisplayZeroTax: boolean;
}
export interface OrderCancellationReason {
    description: string;
}
//# sourceMappingURL=store-config.d.ts.map