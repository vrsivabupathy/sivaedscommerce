export const SUPPORT_PATH = "/support";

// GUEST
export const ORDER_STATUS_PATH = "/order-status";
export const ORDER_DETAILS_PATH = "/order-details";
export const RETURN_DETAILS_PATH = "/return-details";

// CUSTOMER
export const CUSTOMER_PATH = "/customer";
export const CUSTOMER_ORDER_DETAILS_PATH = `${CUSTOMER_PATH}${ORDER_DETAILS_PATH}`;
export const CUSTOMER_RETURN_DETAILS_PATH = `${CUSTOMER_PATH}${RETURN_DETAILS_PATH}`;
export const CUSTOMER_ORDERS_PATH = `${CUSTOMER_PATH}/orders`;
export const CUSTOMER_RETURNS_PATH = `${CUSTOMER_PATH}/returns`;
export const CUSTOMER_ADDRESS_PATH = `${CUSTOMER_PATH}/address`;
export const CUSTOMER_LOGIN_PATH = `${CUSTOMER_PATH}/login`;
export const CUSTOMER_ACCOUNT_PATH = `${CUSTOMER_PATH}/account`;
export const CUSTOMER_FORGOTPASSWORD_PATH = `${CUSTOMER_PATH}/forgotpassword`;
export const CUSTOMER_CREATE_RETURN = `${CUSTOMER_PATH}/create-return`;
