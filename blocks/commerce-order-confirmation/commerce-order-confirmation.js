/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */

// Drop-in Tools
import { initializers } from '@dropins/elsie/initializer.js';

// Drop-in APIs
import * as orderConfirmation from '@dropins/storefront-order-confirmation/api.js';

// Drop-in Providers
import { render as provider } from '@dropins/storefront-order-confirmation/render.js';

// Drop-in Containers
import OrderConfirmation from '@dropins/storefront-order-confirmation/containers/OrderConfirmation.js';

export default async function decorate(block) {
  // Initialize Drop-ins
  initializers.register(orderConfirmation.initialize, {});

  const params = new URLSearchParams(window.location.search);
  const orderRef = params.get('orderRef');

  return provider.render(OrderConfirmation, {
    orderRef,
    // eslint-disable-next-line no-console
    onContinueShopping: () => console.log('continue shopping'),
  })(block);
}
