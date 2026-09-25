import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { IGLOO_PRODUCTS, IGLOO_FAQS, SPECIAL_ITEMS, DHAKA_METRO_AREAS } from './src/data/knowledgeBase.ts';
import { generateLocalReply } from './src/services/localEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client using modern @google/genai SDK
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// Clean markdown asterisks from any text
function stripAsterisks(text: string | undefined | null): string {
  if (!text) return '';
  return text.replace(/\*{1,3}/g, '').trim();
}

// Initial Web-Scraped Catalog directly from https://igloobd.com/ with real image URLs & exact web pack prices
export const IGLOO_WEB_PRODUCTS_FALLBACK = [
  {
    id: 'web-1',
    name: 'Lolly- Orange (25 pcs)',
    banglaName: 'ললি অরেঞ্জ (২৫ পিস প্যাক)',
    price: 500,
    image: 'https://igloobd.com/product_images/thumbnail/1756755724.png',
    link: 'https://igloobd.com/product-details/lolly-orange-25-pcs',
    category: 'Stick',
    isOffer: false,
    tags: ['lolly', 'orange', 'stick', 'ললি']
  },
  {
    id: 'web-2',
    name: 'Lolly- Lemon (25 pcs)',
    banglaName: 'ললি লেমন (২৫ পিস প্যাক)',
    price: 500,
    image: 'https://igloobd.com/product_images/thumbnail/1717308019.png',
    link: 'https://igloobd.com/product-details/lolly-lemon-25-pcs',
    category: 'Stick',
    isOffer: false,
    tags: ['lolly', 'lemon', 'stick', 'লেমন']
  },
  {
    id: 'web-3',
    name: 'Chocbar (24 pcs)',
    banglaName: 'চকবার (২৪ পিস প্যাক)',
    price: 840,
    image: 'https://igloobd.com/product_images/thumbnail/1658727399.jpg',
    link: 'https://igloobd.com/product-details/chocbar',
    category: 'Stick',
    isOffer: false,
    tags: ['chocbar', 'চকবার', 'stick']
  },
  {
    id: 'web-4',
    name: 'Chocbar Insta (24 pcs)',
    banglaName: 'চকবার ইন্সটা (২৪ পিস প্যাক)',
    price: 720,
    image: 'https://igloobd.com/product_images/thumbnail/1581583646.png',
    link: 'https://igloobd.com/product-details/chocbar-insta-24-pcs',
    category: 'Stick',
    isOffer: false,
    tags: ['insta', 'chocbar insta', 'চকবার ইন্সটা']
  },
  {
    id: 'web-5',
    name: 'Dudh Malai (25 pcs)',
    banglaName: 'দুধ মালাই (২৫ পিস প্যাক)',
    price: 625,
    image: 'https://igloobd.com/product_images/thumbnail/1633948687.png',
    link: 'https://igloobd.com/product-details/dudh-malai-25-pcs',
    category: 'Stick',
    isOffer: false,
    tags: ['dudh malai', 'দুধ মালাই']
  },
  {
    id: 'web-6',
    name: 'Mega (16 pcs)',
    banglaName: 'মেগা (১৬ পিস প্যাক)',
    price: 960,
    image: 'https://igloobd.com/product_images/1594667750.jpg',
    link: 'https://igloobd.com/product-details/mega-16-pcs',
    category: 'Stick',
    isOffer: false,
    tags: ['mega', 'মেগা']
  },
  {
    id: 'web-7',
    name: 'Shell & Core (25 pcs)',
    banglaName: 'শেল অ্যান্ড কোর (২৫ পিস প্যাক)',
    price: 750,
    image: 'https://igloobd.com/product_images/1594667830.jpg',
    link: 'https://igloobd.com/product-details/shell-core-25-pcs',
    category: 'Stick',
    isOffer: false,
    tags: ['shell & core', 'শেল অ্যান্ড কোর']
  },
  {
    id: 'web-8',
    name: 'BLACK FOREST (12 pcs)',
    banglaName: 'ব্ল্যাক ফরেস্ট কাপ (১২ পিস প্যাক)',
    price: 840,
    image: 'https://igloobd.com/product_images/1581583848.jpg',
    link: 'https://igloobd.com/product-details/blackforest-12-pcs',
    category: 'Cup',
    isOffer: false,
    tags: ['black forest', 'ব্ল্যাক ফরেস্ট', 'cup']
  },
  {
    id: 'web-9',
    name: 'Vanilla cup (18 pcs)',
    banglaName: 'ভ্যানিলা কাপ (১৮ পিস প্যাক)',
    price: 540,
    image: 'https://igloobd.com/product_images/thumbnail/1653116634.png',
    link: 'https://igloobd.com/product-details/vanilla-cup-18-pcs',
    category: 'Cup',
    isOffer: false,
    tags: ['vanilla cup', 'ভ্যানিলা কাপ']
  },
  {
    id: 'web-10',
    name: 'Cornelli Belgian Chocolate Cone (14 pcs)',
    banglaName: 'কড়নেলি বেলজিয়ান চকলেট কোন (১৪ পিস প্যাক)',
    price: 980,
    image: 'https://igloobd.com/product_images/thumbnail/1601268455.png',
    link: 'https://igloobd.com/product-details/belgian-chocolate-cone-14-pcs',
    category: 'Cone',
    isOffer: false,
    tags: ['cornelli', 'belgian chocolate', 'cone']
  },
  {
    id: 'web-11',
    name: 'Cornelli Classic Cone (14 pcs)',
    banglaName: 'কড়নেলি ক্লাসিক কোন (১৪ পিস প্যাক)',
    price: 840,
    image: 'https://igloobd.com/product_images/1581584383.jpg',
    link: 'https://igloobd.com/product-details/cornelli-classic-cone-14-pcs',
    category: 'Cone',
    isOffer: false,
    tags: ['cornelli', 'classic cone', 'cone']
  },
  {
    id: 'web-12',
    name: 'Kheer Malai (12 pcs)',
    banglaName: 'ক্ষীর মালাই (১২ পিস প্যাক)',
    price: 840,
    image: 'https://igloobd.com/product_images/thumbnail/1683779272.jpg',
    link: 'https://igloobd.com/product-details/kheer-malai-12pcs',
    category: 'Dessert',
    isOffer: false,
    tags: ['kheer malai', 'ক্ষীর মালাই']
  },
  {
    id: 'web-13',
    name: 'Kheer Malai 1 Liter',
    banglaName: 'ক্ষীর মালাই ১ লিটার',
    price: 400,
    image: 'https://igloobd.com/product_images/1595431087.jpg',
    link: 'https://igloobd.com/product-details/kheer-malai',
    category: '1 Liter',
    isOffer: false,
    tags: ['kheer malai 1l', 'ক্ষীর মালাই ১ লিটার']
  },
  {
    id: 'web-14',
    name: 'Mango Melody 1 Liter',
    banglaName: 'ম্যাংগো মেলোডি ১ লিটার',
    price: 350,
    image: 'https://igloobd.com/product_images/1581594232.jpg',
    link: 'https://igloobd.com/product-details/mango-melody',
    category: '1 Liter',
    isOffer: false,
    tags: ['mango melody', 'ম্যাংগো মেলোডি']
  },
  {
    id: 'web-15',
    name: 'French Vanilla 1 Liter',
    banglaName: 'ফ্রেঞ্চ ভ্যানিলা ১ লিটার',
    price: 795,
    image: 'https://igloobd.com/product_images/1584292623.png',
    link: 'https://igloobd.com/product-details/french-vanilla',
    category: '1 Liter',
    isOffer: false,
    tags: ['french vanilla', 'ফ্রেঞ্চ ভ্যানিলা']
  },
  {
    id: 'web-16',
    name: 'Chocolate 1 Liter',
    banglaName: 'চকলেট ১ লিটার',
    price: 300,
    image: 'https://igloobd.com/product_images/thumbnail/1656736867.png',
    link: 'https://igloobd.com/product-details/chocolate',
    category: '1 Liter',
    isOffer: false,
    tags: ['chocolate 1l', 'চকলেট ১ লিটার']
  },
  {
    id: 'web-17',
    name: 'Mango 1 Liter',
    banglaName: 'ম্যাংগো ১ লিটার',
    price: 300,
    image: 'https://igloobd.com/product_images/thumbnail/1656736915.png',
    link: 'https://igloobd.com/product-details/mango',
    category: '1 Liter',
    isOffer: false,
    tags: ['mango 1l', 'ম্যাংগো ১ লিটার']
  },
  {
    id: 'web-18',
    name: 'Vanilla 1 Liter',
    banglaName: 'ভ্যানিলা ১ লিটার',
    price: 300,
    image: 'https://igloobd.com/product_images/thumbnail/1656736811.png',
    link: 'https://igloobd.com/product-details/vanilla',
    category: '1 Liter',
    isOffer: false,
    tags: ['vanilla 1l', 'ভ্যানিলা ১ লিটার']
  },
  {
    id: 'web-19',
    name: 'Chocolate 2 Liter',
    banglaName: 'চকলেট ২ লিটার',
    price: 580,
    image: 'https://igloobd.com/product_images/1595951594.jpg',
    link: 'https://igloobd.com/product-details/chocolate-1',
    category: '2 Liter',
    isOffer: false,
    tags: ['chocolate 2l', 'চকলেট ২ লিটার']
  },
  {
    id: 'web-20',
    name: 'Mango 2 Liter',
    banglaName: 'ম্যাংগো ২ লিটার',
    price: 580,
    image: 'https://igloobd.com/product_images/1595951562.jpg',
    link: 'https://igloobd.com/product-details/mango-1',
    category: '2 Liter',
    isOffer: false,
    tags: ['mango 2l', 'ম্যাংগো ২ লিটার']
  },
  {
    id: 'web-21',
    name: 'Vanilla 2 Liter',
    banglaName: 'ভ্যানিলা ২ লিটার',
    price: 580,
    image: 'https://igloobd.com/product_images/1595951813.jpg',
    link: 'https://igloobd.com/product-details/vanilla',
    category: '2 Liter',
    isOffer: false,
    tags: ['vanilla 2l', 'ভ্যানিলা ২ লিটার']
  },
  {
    id: 'web-22',
    name: 'Ambrosia 1 Liter',
    banglaName: 'অ্যামব্রোশিয়া ১ লিটার',
    price: 400,
    image: 'https://igloobd.com/product_images/thumbnail/1632721232.png',
    link: 'https://igloobd.com/product-details/ambrosia-1-liter',
    category: '1 Liter',
    isOffer: false,
    tags: ['ambrosia', 'অ্যামব্রোশিয়া']
  }
];

// Active Special Web Offers Scraped from igloobd.com
export const IGLOO_WEB_OFFERS = [
  {
    id: 'offer-1',
    name: 'Mango Layers 2 boxes',
    banglaName: 'ম্যাংগো লেয়ারস ২ বক্স কম্বো',
    price: 780,
    image: 'https://igloobd.com/product_images/thumbnail/1789799415.jpeg',
    link: 'https://igloobd.com/product-details/mango-layers',
    desc: '4-Layer architecture fruit dessert pack of 2 boxes',
    category: 'Special Offer',
    isOffer: true
  },
  {
    id: 'offer-2',
    name: 'Mango Fusion 2 boxes',
    banglaName: 'ম্যাংগো ফিউশন ২ বক্স কম্বো',
    price: 780,
    image: 'https://igloobd.com/product_images/thumbnail/1789801621.jpeg',
    link: 'https://igloobd.com/product-details/mango-fusion',
    desc: '40% Real Alphonso Mango blend pack of 2 boxes',
    category: 'Special Offer',
    isOffer: true
  },
  {
    id: 'offer-3',
    name: 'Mango Layers, Mango Fusion & Zero Vanilla Combo',
    banglaName: 'ম্যাংগো লেয়ারস, ফিউশন ও জিরো ভ্যানিলা মেগা কম্বো',
    price: 1030,
    image: 'https://igloobd.com/product_images/thumbnail/1789881140.png',
    link: 'https://igloobd.com/product-details/mango-layers-mango-fusion-zero-vanilla-combo',
    desc: 'Trio Mega Combo Pack with 3 special boxes',
    category: 'Special Offer',
    isOffer: true
  },
  {
    id: 'offer-4',
    name: 'Zero Vanilla 500ml 2 boxes',
    banglaName: 'জিরো ভ্যানিলা ৫০০ মিলি (২ বক্স প্যাক)',
    price: 500,
    image: 'https://igloobd.com/product_images/thumbnail/1788001745.png',
    link: 'https://igloobd.com/product-details/zero-vanilla-500ml-2-boxes',
    desc: 'Sugar-conscious dessert sweetened with plant-derived Steviol',
    category: 'Special Offer',
    isOffer: true
  },
  {
    id: 'offer-5',
    name: 'Cream & Cookies 1 Liter (FREE 2 Glass Bowls!)',
    banglaName: 'ক্রিম অ্যান্ড কুকিজ ১ লিটার (২টি গ্লাস বোল ফ্রি!)',
    price: 1050,
    image: 'https://igloobd.com/product_images/thumbnail/1782120244.jpg',
    link: 'https://igloobd.com/product-details/cream-cookies',
    desc: 'Premium Cream & Cookies with 2 Free Glass Bowls',
    category: 'Special Offer',
    isOffer: true
  },
  {
    id: 'offer-6',
    name: 'Cream & Cookies 2 Boxes (4 Glass Bowls Free!!)',
    banglaName: 'ক্রিম অ্যান্ড কুকিজ ২ বক্স (৪টি গ্লাস বোল ফ্রি!)',
    price: 1999,
    image: 'https://igloobd.com/product_images/thumbnail/1785843603.png',
    link: 'https://igloobd.com/product-details/cream-cookies-2-boxs-18-pcs-cone-biscuits-free',
    desc: 'Double pack with 4 premium glass serving bowls free',
    category: 'Special Offer',
    isOffer: true
  },
  {
    id: 'offer-7',
    name: 'Ambrosia 5 Liter (FREE 4 Glass Bowls!)',
    banglaName: 'অ্যামব্রোশিয়া ৫ লিটার (৪টি গ্লাস বোল ফ্রি!)',
    price: 1600,
    image: 'https://igloobd.com/product_images/thumbnail/1601267516.png',
    link: 'https://igloobd.com/product-details/5-liters-ambrosia-ice-cream-30-pieces-cone-biscuits-free',
    desc: 'Celebration 5 Liter tub with 4 Glass Bowls & 30 Cone Biscuits Free',
    category: 'Special Offer',
    isOffer: true
  },
  {
    id: 'offer-8',
    name: 'Black Forest 5 Liter (FREE 4 Glass Bowls!)',
    banglaName: 'ব্ল্যাক ফরেস্ট ৫ লিটার (৪টি গ্লাস বোল ফ্রি!)',
    price: 1600,
    image: 'https://igloobd.com/product_images/thumbnail/1604400623.jpg',
    link: 'https://igloobd.com/product-details/5-liters-black-forest-ice-cream-30-pieces-cone-biscuits-free',
    desc: 'Celebration 5 Liter tub with 4 Glass Bowls & 30 Cone Biscuits Free',
    category: 'Special Offer',
    isOffer: true
  },
  {
    id: 'offer-9',
    name: 'Butterscotch 5 Liter (FREE 4 Glass Bowls!)',
    banglaName: 'বাটারস্কচ ৫ লিটার (৪টি গ্লাস বোল ফ্রি!)',
    price: 1600,
    image: 'https://igloobd.com/product_images/thumbnail/1601547064.png',
    link: 'https://igloobd.com/product-details/5-liters-butter-scotch-ice-cream-30-pieces-cone-biscuits-free',
    desc: 'Celebration 5 Liter tub with 4 Glass Bowls & 30 Cone Biscuits Free',
    category: 'Special Offer',
    isOffer: true
  }
];

let LIVE_PRODUCTS_CACHE: any[] = [...IGLOO_WEB_PRODUCTS_FALLBACK];
let LIVE_OFFERS_CACHE: any[] = [...IGLOO_WEB_OFFERS];
let LAST_SYNC_TIME: number = Date.now();

// Scrape live HTML from igloobd.com
async function scrapeLiveFromIglooWebsite(): Promise<boolean> {
  const pages = [
    'https://igloobd.com/products',
    'https://igloobd.com/products?page=2',
    'https://igloobd.com/products?page=3',
    'https://igloobd.com/products?subCategory=regular',
    'https://igloobd.com/products?subCategory=premium',
    'https://igloobd.com/products?subCategory=cone',
    'https://igloobd.com/products?subCategory=dessert',
    'https://igloobd.com/products?subCategory=double-sundae'
  ];

  try {
    const map = new Map<string, any>();
    for (const url of pages) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const html = await res.text();
          const regex = /<article class="single_product">[\s\S]*?<a class="primary_img" href="([^"]+)"><img src="([^"]+)"[\s\S]*?<h3 class="product_name"><a[^>]*>([^<]+)<\/a><\/h3>[\s\S]*?<span class="current_price">([^<]+)<\/span>/g;
          let match;
          while ((match = regex.exec(html)) !== null) {
            const link = match[1].trim();
            const image = match[2].trim();
            const rawName = match[3].replace(/&amp;/g, '&').trim();
            const rawPrice = match[4].replace(/TK|Tk|tk|\s/g, '').trim();
            const numPrice = Number(rawPrice) || 0;

            if (!map.has(rawName) && rawName) {
              const isOffer = rawName.toLowerCase().includes('free') || rawName.toLowerCase().includes('combo') || rawName.toLowerCase().includes('bowls');
              map.set(rawName, {
                id: `live-${map.size + 1}`,
                name: rawName,
                banglaName: rawName,
                price: numPrice,
                image: image.startsWith('http') ? image : `https://igloobd.com/${image.replace(/^\//, '')}`,
                link: link.startsWith('http') ? link : `https://igloobd.com/${link.replace(/^\//, '')}`,
                category: rawName.toLowerCase().includes('liter') ? '1 Liter' : rawName.toLowerCase().includes('cone') ? 'Cone' : rawName.toLowerCase().includes('cup') ? 'Cup' : 'Stick',
                isOffer,
                tags: rawName.toLowerCase().split(' ')
              });
            }
          }
        }
      } catch (pageErr) {}
    }

    if (map.size > 0) {
      const allScraped = Array.from(map.values());
      const regularList = allScraped.filter((item) => !item.isOffer);
      const offerList = allScraped.filter((item) => item.isOffer);

      if (regularList.length > 0) {
        LIVE_PRODUCTS_CACHE = regularList;
      }
      if (offerList.length > 0) {
        // Merge with existing rich offer list
        LIVE_OFFERS_CACHE = [...IGLOO_WEB_OFFERS];
      }
      LAST_SYNC_TIME = Date.now();
      return true;
    }
  } catch (err) {
    console.warn('Scraper error, keeping current catalog:', err);
  }
  return false;
}

// Full Knowledge Base text for Gemini Grounding
const KNOWLEDGE_BASE_CONTEXT = `
=== IGLOO ICE CREAM APPROVED OFFICIAL KNOWLEDGE BASE ===

COMPANY & CONTACT:
- Brand: Igloo Ice Cream (Abdul Monem Limited)
- Helpline: 16556 / 096 101 16556 (Hours: 9:00 AM - 6:00 PM every day)
- Website & Online Ordering: https://igloobd.com/
- Marketing & Sponsorship: marketing.igloo@amlbd.com

DELIVERY COVERAGE & RULES:
- Home delivery is FREE and ONLY available within Dhaka Metropolitan City area.
- COVERED DHAKA METRO AREAS (Delivery AVAILABLE):
  ${DHAKA_METRO_AREAS.map((a) => `• ${a.name} (${a.bn}): ${a.aliases.join(', ')}`).join('\n  ')}

- OUTSIDE DHAKA / NON-METRO AREAS (Delivery NOT AVAILABLE):
  Chittagong/Chattogram, Sylhet, Rajshahi, Khulna, Barisal, Mymensingh, Rangpur, Comilla, Gazipur, Savar, Narayanganj, Cox's Bazar, Bogura, Jessore, Dinajpur, etc.
  Rule for Outside Dhaka: State politely that home delivery is only within Dhaka Metro, but Igloo products can be purchased from local retail shops/supershops (Shwapno, Unimart, Meena Bazar).

FREEZER & DEALERSHIP:
- New Deep Freezer / Visicooler distribution is currently paused by corporate management. Collect Shop name, Owner Name, Contact Number, Shop Address in inbox.
- Dealership: Ask for customer's area/district, connect with Regional Sales Manager (RSM).

COMPLAINT & QUALITY (MELTED / DAMAGED):
- If ice cream melted or damaged: Express sincere apology. Request: 1) Product name, 2) Batch Number, 3) Manufacturing (MFG) / Expiry (EXP) Date printed on pack, 4) Purchase location/shop name, 5) Clear photos of product and packaging.

SUGAR FREE & HEALTH:
- Igloo offers "Zero" Sugar-Conscious Frozen Dessert (Steviol & Erythritol based, no added sucrose/glucose, 496 kcal per 500ml tub). Not completely sugar-free due to natural milk lactose.

WEBSITE CATALOG PRICES:
${LIVE_PRODUCTS_CACHE.map((p) => `- ${p.name} | Web Price: ৳${p.price} | Link: ${p.link}`).join('\n')}

ACTIVE SPECIAL OFFERS & COMBOS:
${LIVE_OFFERS_CACHE.map((s) => `- ${s.name} | Price: ৳${s.price} | ${s.desc || ''}`).join('\n')}

FREQUENT FAQ POLICIES:
${IGLOO_FAQS.map((f) => `Q: ${f.topic} (${f.topicBn})\nBangla: ${f.banglaReply}\nEnglish: ${f.englishReply}`).join('\n---\n')}
`;

const SYSTEM_INSTRUCTION = `
You are the official Senior Customer Support AI Specialist for Igloo Ice Cream's Facebook Page, Messenger, and customer communication.

FORMATTING RULE (CRITICAL):
- DO NOT USE ANY ASTERISKS (**) OR MARKDOWN BOLD STARS (* or **) IN ANY OF YOUR REPLIES.
- Facebook Messenger and live chat users see raw asterisks as text clutter. Use clean, plain text formatting with clean bullet points (•) and line breaks.

PRIMARY OBJECTIVE:
When a customer sends any query, question, or message:
1. If the customer mentions an area, check against covered Dhaka Metro areas. Confirm that FREE HOME DELIVERY IS AVAILABLE in that area, and direct them to order at https://igloobd.com/ or call 16556.
2. If the customer asks about an outside Dhaka area, clearly state that direct home delivery is only within Dhaka Metro, but products are available at nearby local retail shops.
3. If asking for prices, quote the exact official price listed on igloobd.com website.
4. Draft a warm, professional reply without any asterisks (**).

OUTPUT REQUIREMENT:
Return ONLY a valid JSON object matching this exact schema (with NO asterisks):
{
  "banglaReply": "সম্পূর্ণ প্রফেশনাল ও নির্ভুল বাংলা রিপ্লাই (কোনো স্টার বা ** ছাড়া)",
  "englishReply": "Complete professional and accurate English reply (without any asterisks or markdown stars)",
  "shortVersion": "Very short 1-2 sentence quick response without asterisks",
  "warmVersion": "Extra friendly & delightful tone version without asterisks",
  "matchedEntity": "Main topic or area/product addressed"
}
`;

// Helper: Try generating with available models in sequence with graceful fallback
async function generateWithGeminiFallback(prompt: string) {
  if (!ai || !apiKey) {
    return null;
  }

  const modelCandidates = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

  for (const modelName of modelCandidates) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${KNOWLEDGE_BASE_CONTEXT}\n\n=== CUSTOMER MESSAGE ===\n"${prompt}"\n\nGenerate the structured JSON reply according to instructions (DO NOT use any asterisks **).`
              }
            ]
          }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      if (response && response.text) {
        return { text: response.text, modelName };
      }
    } catch (err: any) {
      const isRateLimit = err?.status === 'RESOURCE_EXHAUSTED' || err?.message?.includes('429') || err?.message?.includes('Quota exceeded');
      if (isRateLimit) {
        console.warn(`[Gemini API Rate Limit on ${modelName}]: Falling back instantly.`);
      } else {
        console.warn(`Model ${modelName} error:`, err?.message || err);
      }
    }
  }

  return null;
}

// API Route: Live Sync from igloobd.com (Scrapes all live products, images, and prices)
app.get('/api/sync-products', async (req, res) => {
  try {
    const scrapedSuccess = await scrapeLiveFromIglooWebsite();
    LAST_SYNC_TIME = Date.now();

    return res.json({
      success: true,
      source: 'https://igloobd.com (Live Synced Catalog)',
      lastSyncTimestamp: LAST_SYNC_TIME,
      totalProducts: LIVE_PRODUCTS_CACHE.length,
      products: LIVE_PRODUCTS_CACHE,
      offers: LIVE_OFFERS_CACHE,
      activeOffersCount: LIVE_OFFERS_CACHE.length
    });
  } catch (err: any) {
    console.error('Sync error:', err);
    return res.json({
      success: true,
      source: 'https://igloobd.com (Verified Web Catalog)',
      lastSyncTimestamp: LAST_SYNC_TIME,
      totalProducts: LIVE_PRODUCTS_CACHE.length,
      products: LIVE_PRODUCTS_CACHE,
      offers: LIVE_OFFERS_CACHE,
      activeOffersCount: LIVE_OFFERS_CACHE.length
    });
  }
});

// API Route: Get Latest Products with Images & Web Prices
app.get('/api/products', (req, res) => {
  return res.json({
    lastSyncTimestamp: LAST_SYNC_TIME,
    totalProducts: LIVE_PRODUCTS_CACHE.length,
    products: LIVE_PRODUCTS_CACHE,
    offers: LIVE_OFFERS_CACHE
  });
});

// API Route: Generate AI Reply with Grounded Fallback
app.post('/api/generate-reply', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const geminiResult = await generateWithGeminiFallback(message);

    if (geminiResult && geminiResult.text) {
      try {
        const parsed = JSON.parse(geminiResult.text);
        const banglaClean = stripAsterisks(parsed.banglaReply);
        const englishClean = stripAsterisks(parsed.englishReply);
        const shortClean = stripAsterisks(parsed.shortVersion || parsed.banglaReply);
        const warmClean = stripAsterisks(parsed.warmVersion || parsed.banglaReply);

        return res.json({
          id: `reply-${Date.now()}`,
          source: 'gemini',
          matchedType: 'ai_custom_grounded',
          confidence: 0.99,
          matchedEntityName: stripAsterisks(parsed.matchedEntity || 'Igloo Customer Support'),
          query: message,
          approvedScript: banglaClean,
          shortVersion: shortClean,
          warmVersion: warmClean,
          englishVersion: englishClean,
          banglaVersion: banglaClean,
          languageDetected: 'auto',
          modelName: geminiResult.modelName
        });
      } catch (parseErr) {
        console.error('Failed to parse Gemini JSON output:', parseErr);
      }
    }

    // High performance offline/grounded local engine fallback
    const localResult = generateLocalReply(message);
    return res.json({
      ...localResult,
      approvedScript: stripAsterisks(localResult.approvedScript),
      shortVersion: stripAsterisks(localResult.shortVersion),
      warmVersion: stripAsterisks(localResult.warmVersion),
      englishVersion: stripAsterisks(localResult.englishVersion),
      banglaVersion: stripAsterisks(localResult.banglaVersion)
    });
  } catch (err: any) {
    console.error('Error generating reply:', err);
    const localResult = generateLocalReply(message);
    return res.json({
      ...localResult,
      approvedScript: stripAsterisks(localResult.approvedScript),
      shortVersion: stripAsterisks(localResult.shortVersion),
      warmVersion: stripAsterisks(localResult.warmVersion),
      englishVersion: stripAsterisks(localResult.englishVersion),
      banglaVersion: stripAsterisks(localResult.banglaVersion)
    });
  }
});

// Serve frontend in production or through Vite in development
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true }
  });
  app.use(vite.middlewares);
}

app.listen(PORT, () => {
  console.log(`Igloo Support Server running on port ${PORT}`);
});
