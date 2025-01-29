import { SlotProps } from '@dropins/tools/types/elsie/src/src/lib';
import { OrderDataModel, OrderItemModel, OrdersReturnItemsPropsModel, OrdersReturnPropsModel, OrdersReturnTrackingProps, PageInfoProps } from '../data/models';

export interface IconConfig {
    size: '12' | '16' | '24' | '32' | '64' | '80' | undefined;
    stroke: '4' | '1' | '2' | '3' | undefined;
}
export interface ReturnsListProps {
    slots?: {
        ReturnItemsDetails?: SlotProps<{
            items: OrdersReturnItemsPropsModel[];
        }>;
        DetailsActionParams?: SlotProps<{
            returnOrderItem: OrdersReturnPropsModel;
        }>;
    };
    withReturnsListButton?: boolean;
    returnsInMinifiedView?: number;
    className?: string;
    minifiedView?: boolean;
    withHeader?: boolean;
    routeReturnDetails?: ({ returnNumber, token, orderNumber, }: {
        returnNumber: string;
        token: string;
        orderNumber: string;
    }) => string;
    routeOrderDetails?: ({ token, orderNumber, }: {
        token: string;
        orderNumber: string;
    }) => string;
    routeTracking?: (track: OrdersReturnTrackingProps) => string;
    routeReturnsList?: () => string;
    routeProductDetails?: (orderItem?: OrderItemModel) => string;
    withThumbnails?: boolean;
}
export interface ReturnsListContentProps extends Omit<ReturnsListProps, 'className'> {
    minifiedViewKey: 'minifiedView' | 'fullSizeView';
    orderReturns?: OrdersReturnPropsModel[] | [];
    translations: Record<string, string>;
    isMobile: boolean;
    pageInfo: PageInfoProps;
    selectedPage?: number;
    handleSetSelectPage?: (value: number) => void;
    withOrderNumber?: boolean;
    withReturnNumber?: boolean;
}
export interface UseReturnsListProps {
}
export interface OrderReturnsProps {
    slots?: {
        ReturnItemsDetails?: SlotProps<{
            items: OrdersReturnItemsPropsModel[];
        }>;
        DetailsActionParams?: SlotProps<{
            returnOrderItem: OrdersReturnPropsModel;
        }>;
    };
    withThumbnails?: boolean;
    withHeader?: boolean;
    className?: string;
    orderData?: OrderDataModel;
    routeReturnDetails?: ({ token, orderNumber, }: {
        token: string;
        orderNumber: string;
    }) => string;
    routeTracking?: (track: OrdersReturnTrackingProps) => string;
}
export interface UseOrderReturnsProps {
    orderData?: OrderDataModel;
}
//# sourceMappingURL=returnsList.types.d.ts.map