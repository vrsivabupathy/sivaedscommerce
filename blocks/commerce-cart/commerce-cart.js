import { events } from '@dropins/tools/event-bus.js';
import { render as provider } from '@dropins/storefront-cart/render.js';
import * as Cart from '@dropins/storefront-cart/api.js';

// Dropin Containers
import CartSummaryList from '@dropins/storefront-cart/containers/CartSummaryList.js';
import OrderSummary from '@dropins/storefront-cart/containers/OrderSummary.js';
import EstimateShipping from '@dropins/storefront-cart/containers/EstimateShipping.js';
import EmptyCart from '@dropins/storefront-cart/containers/EmptyCart.js';
import Coupons from '@dropins/storefront-cart/containers/Coupons.js';

// Initializers
import '../../scripts/initializers/cart.js';

import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Configuration
  const {
    'hide-heading': hideHeading = 'false',
    'max-items': maxItems,
    'hide-attributes': hideAttributes = '',
    'enable-item-quantity-update': enableUpdateItemQuantity = 'false',
    'enable-item-remove': enableRemoveItem = 'true',
    'enable-estimate-shipping': enableEstimateShipping = 'false',
    'start-shopping-url': startShoppingURL = '',
    'checkout-url': checkoutURL = '',
  } = readBlockConfig(block);

  const cart = Cart.getCartDataFromCache();

  const isEmptyCart = isCartEmpty(cart);

  const DROPDOWN_MAX_QUANTITY = 20;

  const dropdownOptions = Array.from(
    { length: parseInt(DROPDOWN_MAX_QUANTITY, 10) },
    (_, i) => {
      const quantityOption = i + 1;
      return {
        value: `${quantityOption}`,
        text: `${quantityOption}`,
      };
    },
  );

  // Layout
  const fragment = document.createRange().createContextualFragment(`
    <div class="cart__wrapper">
      <div class="cart__left-column">
        <div class="cart__list"></div>
      </div>
      <div class="cart__right-column">
        <div class="cart__order-summary"></div>
      </div>
    </div>

    <div class="cart__empty-cart"></div>
  `);

  const $wrapper = fragment.querySelector('.cart__wrapper');
  const $list = fragment.querySelector('.cart__list');
  const $summary = fragment.querySelector('.cart__order-summary');
  const $emptyCart = fragment.querySelector('.cart__empty-cart');

  block.innerHTML = '';
  block.appendChild(fragment);

  // Toggle Empty Cart
  function toggleEmptyCart(state) {
    if (state) {
      $wrapper.setAttribute('hidden', '');
      $emptyCart.removeAttribute('hidden');
    } else {
      $wrapper.removeAttribute('hidden');
      $emptyCart.setAttribute('hidden', '');
    }
  }

  toggleEmptyCart(isEmptyCart);

  // Render Containers
  await Promise.all([
    // Cart List
    provider.render(CartSummaryList, {
      hideHeading: hideHeading === 'true',
      routeProduct: (product) => `/products/${product.url.urlKey}/${product.sku}`,
      routeEmptyCartCTA: startShoppingURL ? () => startShoppingURL : undefined,
      maxItems: parseInt(maxItems, 10) || undefined,
      attributesToHide: hideAttributes
        .split(',')
        .map((attr) => attr.trim().toLowerCase()),
      enableUpdateItemQuantity: enableUpdateItemQuantity === 'true',
      enableRemoveItem: enableRemoveItem === 'true',
      showDiscount: 'true',
      showSavings: 'true',
      quantityType: 'dropdown',
      dropdownOptions,
      slots: {
        Footer: (ctx) => {
          // Runs on mount
          const wrapper = document.createElement('div');
          ctx.appendChild(wrapper);

          // Append Product Promotions on every update
          ctx.onChange((next) => {
            wrapper.innerHTML = '';

            next.item?.discount?.label?.forEach((label) => {
              const discount = document.createElement('div');
              discount.style.color = '#3d3d3d';
              discount.innerText = label;
              wrapper.appendChild(discount);
            });
          });
        },
        ProductAttributes: (ctx) => {
          // Prepend Product Attributes
          const productAttributes = ctx.item?.productAttributes;

          productAttributes?.forEach((attr) => {
            if (attr.code === 'Delivery Timeline') {
              if (attr.selected_options) {
                const selectedOptions = attr.selected_options
                  .filter((option) => option.label.trim() !== '')
                  .map((option) => option.label)
                  .join(', ');

                if (selectedOptions) {
                  const productAttribute = document.createElement('div');
                  productAttribute.innerText = `${attr.code}: ${selectedOptions}`;
                  return ctx.appendChild(productAttribute);
                }
              } else if (attr.value) {
                const productAttribute = document.createElement('div');
                productAttribute.innerText = `${attr.value}`;
                return ctx.appendChild(productAttribute);
              }
            }
            return null;
          });
        },
      },
    })($list),

    // Order Summary
    provider.render(OrderSummary, {
      routeProduct: (product) => `/products/${product.url.urlKey}/${product.sku}`,
      routeCheckout: checkoutURL ? () => checkoutURL : undefined,
      slots: {
        EstimateShipping: async (ctx) => {
          if (enableEstimateShipping === 'true') {
            const wrapper = document.createElement('div');
            await provider.render(EstimateShipping, {})(wrapper);
            ctx.replaceWith(wrapper);
          }
        },
        Coupons: (ctx) => {
          const coupons = document.createElement('div');

          provider.render(Coupons)(coupons);

          ctx.appendChild(coupons);
        },
      },
    })($summary),

    // Empty Cart
    provider.render(EmptyCart, {
      routeCTA: startShoppingURL ? () => startShoppingURL : undefined,
    })($emptyCart),
  ]);

  // Events
  events.on(
    'cart/data',
    (payload) => {
      toggleEmptyCart(isCartEmpty(payload));
    },
    { eager: true },
  );

  return Promise.resolve();
}

function isCartEmpty(cart) {
  return cart ? cart.totalQuantity < 1 : true;
}
