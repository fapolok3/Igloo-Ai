import type { VercelRequest, VercelResponse } from '@vercel/node';
import { IGLOO_WEB_PRODUCTS_FALLBACK, IGLOO_WEB_OFFERS } from './sync-products';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({
    lastSyncTimestamp: Date.now(),
    totalProducts: IGLOO_WEB_PRODUCTS_FALLBACK.length,
    products: IGLOO_WEB_PRODUCTS_FALLBACK,
    offers: IGLOO_WEB_OFFERS
  });
}
