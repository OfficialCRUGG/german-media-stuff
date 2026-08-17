import YAML from "yaml";
import * as fs from "node:fs/promises";
import { fetchShopifyData } from "./shopify-fetcher";
import { JsonValue } from "./types";

type ShopType = "shopify";

type Shop = {
  type: ShopType;
  id: string;
  url: string;
};

const configFile = await fs.readFile("config.yaml", "utf8");
const configData = YAML.parse(configFile);
const shops = configData.shops as Shop[];

const handlers: Record<ShopType, (url: string) => Promise<JsonValue>> = {
  shopify: fetchShopifyData,
};

async function handle(shop: Shop) {
  const handler = handlers[shop.type];
  if (!handler) {
    throw new Error(`No handler for shop type: ${shop.type}`);
  }

  const data = await handler(shop.url);
  await fs.writeFile(`shops/${shop.id}.json`, JSON.stringify(data, null, 2));
}

fs.mkdir("shops", { recursive: true });

const promises = shops.map(async (shop: Shop) => await handle(shop));

// Run all promises in parallel
await Promise.all(promises);
