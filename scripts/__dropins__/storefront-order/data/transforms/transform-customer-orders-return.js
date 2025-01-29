"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformCustomerOrdersReturn = void 0;
const transform_order_details_1 = require("./transform-order-details");
const transformCustomerOrdersReturn = (response) => {
    if (!response?.data?.customer?.returns?.items?.length)
        return null;
    const ordersList = response?.data?.customer?.returns?.items;
    const pageInfo = response?.data?.customer?.returns?.page_info;
    const ordersReturn = ordersList.map((element) => {
        const { order, status } = element;
        const tracking = element?.shipping?.tracking?.map((el) => {
            const { status, carrier, tracking_number } = el;
            return { status, carrier, trackingNumber: tracking_number };
        }) ?? [];
        const items = element.items.map((item) => {
            const quantity = item?.quantity;
            const status = item?.status;
            const request_quantity = item?.request_quantity;
            const uid = item?.uid;
            const order_item = item?.order_item;
            const orderItem = (0, transform_order_details_1.transformOrderItems)([order_item])?.reduce((_, item) => item, {}) ?? {};
            return {
                uid,
                quantity,
                status,
                requestQuantity: request_quantity,
                orderItem,
            };
        });
        return {
            returnStatus: status,
            token: order?.token,
            orderNumber: order?.number,
            items,
            tracking,
        };
    });
    return {
        ordersReturn: ordersReturn,
        ...(pageInfo
            ? {
                pageInfo: {
                    pageSize: pageInfo.page_size,
                    totalPages: pageInfo.total_pages,
                    currentPage: pageInfo.current_page,
                },
            }
            : {}),
    };
};
exports.transformCustomerOrdersReturn = transformCustomerOrdersReturn;
