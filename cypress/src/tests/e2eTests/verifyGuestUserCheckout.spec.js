import {
    setGuestEmail,
    setGuestShippingAddress,
    placeOrder,
} from '../../actions';
import {
    assertCartSummaryProduct,
    assertCartSummaryProductsOnCheckout,
    assertTitleHasLink,
    assertProductImage,
    assertCartSummaryMisc,
    assertOrderSummaryMisc,
    assertOrderConfirmationCommonDetails,
    assertOrderConfirmationShippingDetails,
    assertOrderConfirmationBillingDetails,
    assertOrderConfirmationShippingMethod,
} from '../../assertions';
import {

    assertSelectedPaymentMethod,
} from '../../assertions';
import {
    customerShippingAddress,
} from '../../fixtures/index';

describe('Verify guest user can place order', () => {
    it('Verify guest user can place order', () => {
        cy.visit('');
        cy.get('.nav-drop')
            .contains('Catalog')
            .click();
        cy.contains('Crown Summit Backpack').click();
        cy.get('.dropin-incrementer__increase-button').click();
        cy.get('.dropin-incrementer__input').should('have.value', '2');
        // cypress fails intermittently as it takes old value 1, this is needed for tests to be stable
        cy.wait(1000);
        cy.contains('Add to Cart').click();
        cy.get('.minicart-wrapper').click();
        assertCartSummaryProduct(
            'Crown Summit Backpack',
            '24-MB03',
            '2',
            '$38.00',
            '$76.00',
            '0'
        )('.cart-mini-cart');
        assertTitleHasLink(
            'Crown Summit Backpack',
            '/products/crown-summit-backpack/24-MB03'
        )('.cart-mini-cart');
        assertProductImage('/mb03-black-0.jpg')('.cart-mini-cart');
        cy.percySnapshot('PDP page with Mini Cart Open');
        cy.contains('View Cart').click({force: true});
        assertCartSummaryProduct(
            'Crown Summit Backpack',
            '24-MB03',
            '2',
            '$38.00',
            '$76.00',
            '0'
        )('.commerce-cart-summary-wrapper');
        assertTitleHasLink(
            'Crown Summit Backpack',
            '/products/crown-summit-backpack/24-MB03'
        )('.commerce-cart-summary-wrapper');
        assertProductImage('/mb03-black-0.jpg')('.commerce-cart-summary-wrapper');
        cy.contains('Estimated Shipping').should('be.visible');
        cy.percySnapshot('Cart page');
        cy.get('.dropin-button--primary')
            .contains('Checkout')
            .click({force: true});
        assertCartSummaryMisc(2);
        assertCartSummaryProductsOnCheckout(
            'Crown Summit Backpack',
            '24-MB03',
            '2',
            '$38.00',
            '$76.00',
            '0'
        );
        cy.contains('Estimated Shipping').should('be.visible')
        cy.percySnapshot('Checkout Page');
        const apiMethod = 'setGuestEmailOnCart';
        const urlTest = Cypress.env('graphqlEndPoint');
        cy.intercept('POST', urlTest, (req) => {
            let data = req.body.query;
            if (data && typeof data == 'string') {
                if (data.includes(apiMethod)) {
                    req.alias = 'setEmailOnCart';
                }
            }
        });
        setGuestEmail(customerShippingAddress.email);
        cy.wait('@setEmailOnCart');
        setGuestShippingAddress(customerShippingAddress, true);
        assertOrderSummaryMisc('$76.00', '$10.00', '$86.00');
        assertSelectedPaymentMethod('checkmo', 0);
        cy.wait(5000);
        placeOrder();
        assertOrderConfirmationCommonDetails(customerShippingAddress);
        assertOrderConfirmationShippingDetails(customerShippingAddress);
        assertOrderConfirmationBillingDetails(customerShippingAddress);
        assertOrderConfirmationShippingMethod(customerShippingAddress);
        cy.percySnapshot('Order Confirmation');
    });
});