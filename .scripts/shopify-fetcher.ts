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
    products,
  };
}

export async function fetchShopifyPage(shopUrl: string, page: number) {
  const endpoint = `${shopUrl}/products.json?limit=250&page=${page}`;

  const response = await fetch(endpoint);
  const data = await response.json();
  const products = data.products;
  return products;
}
