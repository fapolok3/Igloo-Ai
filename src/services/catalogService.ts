export interface WebProductItem {
  id: string;
  name: string;
  banglaName?: string;
  price: number;
  image: string;
  link: string;
  category?: string;
  isOffer?: boolean;
  desc?: string;
  tags?: string[];
}

export const IGLOO_WEB_PRODUCTS_FALLBACK: WebProductItem[] = [
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

export const IGLOO_WEB_OFFERS: WebProductItem[] = [
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

const STORAGE_PRODUCTS_KEY = 'igloo_cached_products_v2';
const STORAGE_OFFERS_KEY = 'igloo_cached_offers_v2';
const STORAGE_SYNC_KEY = 'igloo_cached_sync_time_v2';

export async function getLiveOrCachedCatalog(): Promise<{ products: WebProductItem[]; offers: WebProductItem[]; lastSyncTime: string }> {
  let products = IGLOO_WEB_PRODUCTS_FALLBACK;
  let offers = IGLOO_WEB_OFFERS;
  let lastSyncTime = 'Live Store Synced';

  // 1. Try server API sync first (Works in AI Studio and serverless environment)
  try {
    const res = await fetch('/api/sync-products', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        products = data.products;
      }
      if (data.offers && Array.isArray(data.offers) && data.offers.length > 0) {
        offers = data.offers;
      }
      const now = new Date();
      lastSyncTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Cache locally
      try {
        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
        localStorage.setItem(STORAGE_OFFERS_KEY, JSON.stringify(offers));
        localStorage.setItem(STORAGE_SYNC_KEY, lastSyncTime);
      } catch (e) {}

      return { products, offers, lastSyncTime };
    }
  } catch (err) {
    console.warn('Direct server sync skipped, using resilient catalog store:', err);
  }

  // 2. Check local storage cache
  try {
    const cachedP = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    const cachedO = localStorage.getItem(STORAGE_OFFERS_KEY);
    const cachedT = localStorage.getItem(STORAGE_SYNC_KEY);
    if (cachedP && cachedO) {
      products = JSON.parse(cachedP);
      offers = JSON.parse(cachedO);
      if (cachedT) lastSyncTime = cachedT;
    }
  } catch (e) {}

  return { products, offers, lastSyncTime };
}
