import { JsonArray, JsonObject } from "./types";

export async function fetchShopifyData(shopUrl: string) {
  const products = [];
  let page = 1;
  let hasMoreProducts = true;

  while (hasMoreProducts) {
    const pageProducts = await fetchShopifyPage(shopUrl, page);

    products.push(...pageProducts);

    hasMoreProducts = pageProducts.length > 0;
    page++;

    if (hasMoreProducts) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return {
    products: (products.map(cleanupProduct) as JsonArray).sort(
      (a: any, b: any) => a.handle.localeCompare(b.handle),
    ),
  } as JsonObject;
}

export async function fetchShopifyPage(shopUrl: string, page: number) {
  const endpoint = `${shopUrl}/products.json?limit=250&page=${page}`;

  const response = await fetch(endpoint);
  const data = await response.json();
  const products = data.products;
  return products;
}

// updated_at must be stripped, because for some shops, it changes constantly,
// even if nothing is changed
function cleanupProduct(product: any): any {
  return {
    ...product,
    updated_at: undefined,
    variants: product.variants
      ? product.variants.map((variant: any) => ({
          ...variant,
          updated_at: undefined,
        }))
      : undefined,
    images: product.images
      ? product.images.map((image: any) => ({
          ...image,
          updated_at: undefined,
        }))
      : undefined,
  };
}
