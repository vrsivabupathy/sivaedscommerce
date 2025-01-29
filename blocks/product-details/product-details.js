import { events } from '@dropins/tools/event-bus.js';
import {
  InLineAlert,
  Icon,
  provider as UI,
} from '@dropins/tools/components.js';
import { render as productRenderer } from '@dropins/storefront-pdp/render.js';
import { addProductsToCart } from '@dropins/storefront-cart/api.js';
import ProductDetails from '@dropins/storefront-pdp/containers/ProductDetails.js';

// Libs
import {
  getSkuFromUrl,
  setJsonLd,
  loadErrorPage, performCatalogServiceQuery, variantsQuery,
} from '../../scripts/commerce.js';

// Initializers
import '../../scripts/initializers/cart.js';
import '../../scripts/initializers/pdp.js';

async function setJsonLdProduct(product) {
  const {
    name,
    inStock,
    description,
    sku,
    urlKey,
    price,
    priceRange,
    images,
    attributes,
  } = product;
  const amount = priceRange?.minimum?.final?.amount || price?.final?.amount;
  const brand = attributes.find((attr) => attr.name === 'brand');

  // get variants
  const { variants } = (await performCatalogServiceQuery(variantsQuery, { sku }))?.variants
    || { variants: [] };

  const ldJson = {
    '@context': 'http://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images[0]?.url,
    offers: [],
    productID: sku,
    brand: {
      '@type': 'Brand',
      name: brand?.value,
    },
    url: new URL(`/products/${urlKey}/${sku}`, window.location),
    sku,
    '@id': new URL(`/products/${urlKey}/${sku}`, window.location),
  };

  if (variants.length > 1) {
    ldJson.offers.push(...variants.map((variant) => ({
      '@type': 'Offer',
      name: variant.product.name,
      image: variant.product.images[0]?.url,
      price: variant.product.price.final.amount.value,
      priceCurrency: variant.product.price.final.amount.currency,
      availability: variant.product.inStock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
      sku: variant.product.sku,
    })));
  } else {
    ldJson.offers.push({
      '@type': 'Offer',
      price: amount?.value,
      priceCurrency: amount?.currency,
      availability: inStock ? 'http://schema.org/InStock' : 'http://schema.org/OutOfStock',
    });
  }

  setJsonLd(ldJson, 'product');
}

function createMetaTag(property, content, type) {
  if (!property || !type) {
    return;
  }
  let meta = document.head.querySelector(`meta[${type}="${property}"]`);
  if (meta) {
    if (!content) {
      meta.remove();
      return;
    }
    meta.setAttribute(type, property);
    meta.setAttribute('content', content);
    return;
  }
  if (!content) {
    return;
  }
  meta = document.createElement('meta');
  meta.setAttribute(type, property);
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
}

function setMetaTags(product) {
  if (!product) {
    return;
  }

  const price = product.priceRange
    ? product.priceRange.minimum.final.amount
    : product.price.final.amount;

  createMetaTag('title', product.metaTitle || product.name, 'name');
  createMetaTag('description', product.metaDescription, 'name');
  createMetaTag('keywords', product.metaKeyword, 'name');

  createMetaTag('og:type', 'og:product', 'property');
  createMetaTag('og:description', product.shortDescription, 'property');
  createMetaTag('og:title', product.metaTitle || product.name, 'property');
  createMetaTag('og:url', window.location.href, 'property');
  const mainImage = product?.images?.filter((image) => image.roles.includes('thumbnail'))[0];
  const metaImage = mainImage?.url || product?.images[0]?.url;
  createMetaTag('og:image', metaImage, 'property');
  createMetaTag('og:image:secure_url', metaImage, 'property');
  createMetaTag('og:product:price:amount', price.value, 'property');
  createMetaTag('og:product:price:currency', price.currency, 'property');
}

export default async function decorate(block) {
  const product = await window.getProductPromise;

  if (!product) {
    await loadErrorPage();
    return Promise.reject();
  }

  events.on(
    'eds/lcp',
    () => {
      if (!product) {
        return;
      }

      setJsonLdProduct(product);
      setMetaTags(product);
      document.title = product.name;
    },
    { eager: true },
  );

  // Alert Message Wrapper
  const alertWrapper = document.createElement('div');
  alertWrapper.classList.add('product-details__alert');
  block.appendChild(alertWrapper);
  let inlineAlert;

  // PDP Wrapper
  const pdpWrapper = document.createElement('div');
  block.appendChild(pdpWrapper);

  // Render Containers
  try {
    return await productRenderer.render(ProductDetails, {
      sku: getSkuFromUrl(),
      carousel: {
        controls: {
          desktop: 'thumbnailsColumn',
          mobile: 'thumbnailsRow',
        },
        arrowsOnMainImage: true,
        peak: {
          mobile: true,
          desktop: false,
        },
        gap: 'small',
      },
      slots: {
        Actions: (ctx) => {
          // Add to Cart Button
          ctx.appendButton((next, state) => {
            const adding = state.get('addingCart');
            return {
              text: adding
                ? next.dictionary.Custom.AddingToCart?.label
                : next.dictionary.PDP.Product.AddToCart?.label,
              icon: 'Cart',
              variant: 'primary',
              disabled: adding || !next.data?.inStock || !next.valid,
              onClick: async () => {
                try {
                  state.set('addingCart', true);
                  await addProductsToCart([{ ...next.values }]);
                  // reset any previous alerts if successful
                  inlineAlert?.remove();
                } catch (error) {
                  // add alert message
                  inlineAlert = await UI.render(InLineAlert, {
                    heading: 'Error',
                    description: error.message,
                    icon: Icon({ source: 'Warning' }),
                    'aria-live': 'assertive',
                    role: 'alert',
                    onDismiss: () => {
                      inlineAlert.remove();
                    },
                  })(alertWrapper);
                  // Scroll the alertWrapper into view
                  alertWrapper.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                } finally {
                  state.set('addingCart', false);
                }
              },
            };
          });

          ctx.appendButton((next, state) => {
            const adding = state.get('addingWishlist');
            return ({
              disabled: adding,
              icon: 'Heart',
              variant: 'secondary',
              onClick: async () => {
                try {
                  state.set('addingWishlist', true);
                  const { addToWishlist } = await import('../../scripts/wishlist/api.js');
                  await addToWishlist(next.values.sku);
                } finally {
                  state.set('addingWishlist', false);
                }
              },
            });
          });
        },
      },
      useACDL: true,
    })(pdpWrapper);
  } catch (e) {
    console.error(e);
    await loadErrorPage();
  }
  return undefined;
}
