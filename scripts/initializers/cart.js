/* eslint-disable import/no-cycle */
import { initializers } from '@dropins/tools/initializer.js';
import { initialize } from '@dropins/storefront-cart/api.js';
import { initializeDropin } from './index.js';
import { fetchPlaceholders } from '../aem.js';

await initializeDropin(async () => {
  console.log('Initializing cart');
  const labels = await fetchPlaceholders();

  const langDefinitions = {
    default: {
      ...labels,
    },
  };

  return initializers.mountImmediately(initialize, { langDefinitions });
})();
