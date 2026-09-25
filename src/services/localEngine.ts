import { IGLOO_PRODUCTS, IGLOO_FAQS, DHAKA_METRO_AREAS, ProductItem, FAQItem } from '../data/knowledgeBase';
import { removeMarkdownAsterisks } from '../utils/textCleaner';

export interface GeneratedReply {
  id: string;
  source: 'gemini' | 'local_rule_engine';
  matchedType: 'product_price' | 'faq' | 'positive_comment' | 'complaint' | 'escalation' | 'general' | 'area_delivery' | 'ai_custom_grounded';
  confidence: number;
  matchedEntityName?: string;
  query: string;
  approvedScript: string;
  shortVersion: string;
  warmVersion: string;
  englishVersion: string;
  banglaVersion: string;
  languageDetected: 'bangla' | 'english' | 'banglish' | 'auto';
  matchedProduct?: ProductItem;
  matchedFAQ?: FAQItem;
  modelName?: string;
}

export function detectLanguage(text: string): 'bangla' | 'english' | 'banglish' {
  const banglaRegex = /[\u0980-\u09FF]/;
  if (banglaRegex.test(text)) {
    return 'bangla';
  }
  const banglishTokens = ['koto', 'dam', 'hobe', 'lagbe', 'chai', 'paini', 'disi', 'kivabe', 'korbo', 'bhai', 'apnader', 'er', 'ki', 'ache', 'elakay'];
  const lower = text.toLowerCase();
  for (const token of banglishTokens) {
    if (new RegExp(`\\b${token}\\b`, 'i').test(lower)) {
      return 'banglish';
    }
  }
  return 'english';
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09FF]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Major Outside Dhaka districts & areas for precise negative routing
const OUTSIDE_DHAKA_AREAS = [
  'chittagong', 'ctg', 'chattogram', 'চট্টগ্রাম',
  'sylhet', 'সিলেট',
  'rajshahi', 'রাজশাহী',
  'khulna', 'খুলনা',
  'barisal', 'বরিশাল',
  'mymensingh', 'ময়মনসিংহ',
  'rangpur', 'রংপুর',
  'comilla', 'কুমিল্লা', 'cumilla',
  'gazipur', 'গাজীপুর', 'board bazar', 'joydebpur', 'চৌরাস্তা', 'boardbazar',
  'narayanganj', 'নারায়ণগঞ্জ', 'sonargaon',
  'savar', 'সাভার', 'ashulia', 'আশুলিয়া', 'hemayetpur',
  'coxs bazar', 'কক্সবাজার',
  'bogura', 'bogra', 'বগুড়া',
  'jashore', 'jessore', 'যশোর',
  'dinajpur', 'দিনাজপুর',
  'tangail', 'টাঙ্গাইল',
  'feni', 'ফেনী',
  'noakhali', 'নোয়াখালী',
  'brahmanbaria', 'ব্রাহ্মণবাড়িয়া'
];

export function generateLocalReply(query: string): GeneratedReply {
  const normQuery = normalize(query);
  const lang = detectLanguage(query);

  // 1. Check for Outside Dhaka explicitly mentioned
  for (const outArea of OUTSIDE_DHAKA_AREAS) {
    if (normQuery.includes(outArea)) {
      const areaNameCap = outArea.charAt(0).toUpperCase() + outArea.slice(1);
      return formatOutsideDhakaSpecificReply(query, areaNameCap, lang);
    }
  }

  // 2. Check for Dhaka Metro Specific Area Match
  for (const area of DHAKA_METRO_AREAS) {
    const isMatched = area.aliases.some((alias) => {
      const aliasLower = alias.toLowerCase();
      return normQuery.includes(aliasLower);
    });

    if (isMatched) {
      return formatDhakaAreaSpecificReply(query, area.name, area.bn, lang);
    }
  }

  // 3. Check for Special Combos First
  if (
    normQuery.includes('mango layers') ||
    normQuery.includes('ম্যাংগো লেয়ারস') ||
    normQuery.includes('mango layer') ||
    normQuery.includes('layers')
  ) {
    if (normQuery.includes('780') || (normQuery.includes('fusion') && !normQuery.includes('1030') && !normQuery.includes('zero'))) {
      const faq = IGLOO_FAQS.find((f) => f.id.includes('combo-780')) || IGLOO_FAQS[34];
      return formatFAQReply(query, faq, lang, 'product_price', 'Mango Layers & Fusion Combo (৳780)', 0.98);
    }
    if (normQuery.includes('1030') || (normQuery.includes('zero') && normQuery.includes('fusion'))) {
      const faq = IGLOO_FAQS.find((f) => f.id.includes('combo-1030')) || IGLOO_FAQS[33];
      return formatFAQReply(query, faq, lang, 'product_price', 'Mango Layers Mega Combo (৳1030)', 0.98);
    }
  }

  // 4. Exact or Partial Product Search across 56 items
  for (const p of IGLOO_PRODUCTS) {
    const pName = p.name.toLowerCase();
    const pBnName = p.banglaName.toLowerCase();
    const tokens = pName.split(' ');

    const matchDirect = normQuery.includes(pName) || normQuery.includes(pBnName);
    const matchTokens = tokens.length > 1 && tokens.every((t) => t.length > 2 && normQuery.includes(t));
    const matchTags = p.tags.some((t) => normQuery.includes(t.toLowerCase()));

    if (matchDirect || matchTokens || matchTags) {
      return formatProductReply(query, p, lang);
    }
  }

  // 5. Match FAQs by Topic & Keywords
  for (const faq of IGLOO_FAQS) {
    const topicMatch = normQuery.includes(faq.topic.toLowerCase()) || normQuery.includes(faq.topicBn.toLowerCase());
    const keywordMatch = faq.keywords.some((kw) => {
      const kwLower = kw.toLowerCase();
      return normQuery.includes(kwLower) || (kwLower.length > 3 && normQuery.includes(kwLower));
    });

    if (topicMatch || keywordMatch) {
      return formatFAQReply(query, faq, lang, 'faq', faq.topic, 0.92);
    }
  }

  // 6. Generic Delivery Inquiry
  if (normQuery.includes('delivery') || normQuery.includes('ডেলিভারি') || normQuery.includes('home delivery') || normQuery.includes('পৌঁছে')) {
    const faq = IGLOO_FAQS.find((f) => f.id.includes('how-to-place-order')) || IGLOO_FAQS[3];
    return formatFAQReply(query, faq, lang, 'faq', 'Dhaka Home Delivery Policy', 0.95);
  }

  if (normQuery.includes('freezer') || normQuery.includes('ফ্রিজ') || normQuery.includes('deep freezer') || normQuery.includes('visicooler')) {
    const faq = IGLOO_FAQS.find((f) => f.id.includes('freezer-request')) || IGLOO_FAQS[20];
    return formatFAQReply(query, faq, lang, 'faq', 'Freezer Allocation Policy', 0.95);
  }

  if (normQuery.includes('complaint') || normQuery.includes('gole') || normQuery.includes('নষ্ট') || normQuery.includes('গলে') || normQuery.includes('kharap') || normQuery.includes('melted')) {
    const faq = IGLOO_FAQS.find((f) => f.id.includes('melted-complaint')) || IGLOO_FAQS[26];
    return formatFAQReply(query, faq, lang, 'complaint', 'Customer Quality Assurance & Complaint', 0.95);
  }

  if (normQuery.includes('dealer') || normQuery.includes('ডিলার') || normQuery.includes('পাইকারি') || normQuery.includes('business') || normQuery.includes('shop')) {
    const faq = IGLOO_FAQS.find((f) => f.id.includes('i-want-dealership')) || IGLOO_FAQS[15];
    return formatFAQReply(query, faq, lang, 'faq', 'Dealership Inquiry', 0.95);
  }

  if (normQuery.includes('hi') || normQuery.includes('hello') || normQuery.includes('হ্যালো') || normQuery.includes('salam') || normQuery.includes('সালাম')) {
    const faq = IGLOO_FAQS.find((f) => f.id.includes('greeting-hi-hello')) || IGLOO_FAQS[22];
    return formatFAQReply(query, faq, lang, 'positive_comment', 'Igloo Cordial Greeting', 0.95);
  }

  // 7. Intelligent Grounded Escalation / General Response
  return generateEscalationReply(query, lang);
}

function formatDhakaAreaSpecificReply(query: string, areaEn: string, areaBn: string, lang: 'bangla' | 'english' | 'banglish'): GeneratedReply {
  const banglaReply = `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য আন্তরিক ধন্যবাদ।

জি, আপনার এলাকা ${areaBn} (${areaEn}) ঢাকা মেট্রোপলিটন সিটির অন্তর্ভুক্ত হওয়ায় এখানে আমাদের ফ্রি হোম ডেলিভারি সার্ভিস উপলব্ধ রয়েছে।

অর্ডার করতে অনুগ্রহ করে আমাদের অফিসিয়াল ওয়েবসাইটে ভিজিট করুন:
🌐 https://igloobd.com/

অথবা সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত সরাসরি কল করতে পারেন আমাদের হেল্পলাইন ১৬৫৫৬ অথবা ০৯৬ ১০১ ১৬৫৫৬ নম্বরে।

ইগলুর সাথে থাকার জন্য আপনাকে ধন্যবাদ।`;

  const englishReply = `Dear Valued Customer,

Thank you for your interest in Igloo Ice Cream.

Yes! Your area ${areaEn} is covered under Dhaka Metropolitan City, and our Free Home Delivery Service is available in your location.

To place your order, please visit our official website:
🌐 https://igloobd.com/

Or call us directly at 16556 or 096 101 16556 between 9:00 AM and 6:00 PM.

Thank you for choosing Igloo.`;

  const shortBn = `প্রিয় গ্রাহক, জি! ${areaBn}-এ ইগলুর ফ্রি হোম ডেলিভারি সার্ভিস রয়েছে। অর্ডার করতে ভিজিট করুন igloobd.com অথবা কল করুন ১৬৫৫৬। ধন্যবাদ।`;
  const shortEn = `Dear Valued Customer, yes! Free home delivery is available in ${areaEn}. Order online at igloobd.com or call 16556. Thank you.`;

  const warmBn = `প্রিয় গ্রাহক, আনন্দের সাথে জানাচ্ছি যে ${areaBn}-এ আমাদের ফ্রি হোম ডেলিভারি পাওয়া যাচ্ছে! 🍦 দ্রুত আপনার প্রিয় আইসক্রিম অর্ডার করতে ভিজিট করুন igloobd.com অথবা কল করুন ১৬৫৫৬ নম্বরে। ধন্যবাদ! ❤️`;
  const warmEn = `Dear Valued Customer, we are delighted to let you know that free home delivery is available in ${areaEn}! 🍦 Order your favorite ice cream at igloobd.com or call 16556. Thank you! ❤️`;

  return {
    id: `reply-${Date.now()}`,
    source: 'local_rule_engine',
    matchedType: 'area_delivery',
    confidence: 0.99,
    matchedEntityName: `Delivery in ${areaEn} (Available ✅)`,
    query,
    approvedScript: removeMarkdownAsterisks(banglaReply),
    shortVersion: removeMarkdownAsterisks(shortBn),
    warmVersion: removeMarkdownAsterisks(warmBn),
    englishVersion: removeMarkdownAsterisks(englishReply),
    banglaVersion: removeMarkdownAsterisks(banglaReply),
    languageDetected: lang
  };
}

function formatOutsideDhakaSpecificReply(query: string, areaName: string, lang: 'bangla' | 'english' | 'banglish'): GeneratedReply {
  const banglaReply = `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য আন্তরিক ধন্যবাদ।

আন্তরিকভাবে দুঃখিত, বর্তমানে আমাদের অনলাইন হোম ডেলিভারি সার্ভিস শুধুমাত্র ঢাকা মেট্রোপলিটন এলাকার মধ্যে সীমাবদ্ধ থাকায় ${areaName}-এ সরাসরি হোম ডেলিভারি সুবিধাটি নেই।

তবে আপনার নিকটস্থ দোকান, সুপারশপ (যেমন স্বপ্ন, ইউনিমার্ট বা স্থানীয় বাজার) অথবা ইগলুর রিটেইল আউটলেটগুলোতে ইগলুর পণ্য পাওয়া যাবে।

ইগলুর সাথে থাকার জন্য ধন্যবাদ।`;

  const englishReply = `Dear Valued Customer,

Thank you for your interest in Igloo Ice Cream.

We sincerely apologize, but our direct home delivery service is currently available only within Dhaka Metropolitan City. Therefore, home delivery is not available in ${areaName}.

However, Igloo products are widely available at your nearest retail grocery stores, super shops, and authorized outlets.

Thank you for your understanding.`;

  const shortBn = `প্রিয় গ্রাহক, দুঃখিত, ${areaName}-এ সরাসরি হোম ডেলিভারি নেই। তবে আপনার নিকটস্থ দোকান বা সুপারশপে ইগলু পণ্য পাওয়া যাবে। ধন্যবাদ।`;
  const shortEn = `Dear Valued Customer, sorry, direct home delivery is not available in ${areaName}. However, products are available at nearby retail shops. Thank you.`;

  const warmBn = `প্রিয় গ্রাহক, ${areaName}-এ আমাদের সরাসরি হোম ডেলিভারি সার্ভিস চালু না থাকায় আমরা দুঃখিত। তবে আপনার আশেপাশের দোকানে ইগলুর সুস্বাদু আইসক্রিম পেয়ে যাবেন। ধন্যবাদ! ❤️`;
  const warmEn = `Dear Valued Customer, apologies as home delivery is not yet available in ${areaName}. You can find Igloo at your local retail stores. Thank you! ❤️`;

  return {
    id: `reply-${Date.now()}`,
    source: 'local_rule_engine',
    matchedType: 'area_delivery',
    confidence: 0.99,
    matchedEntityName: `Delivery in ${areaName} (Outside Dhaka ❌)`,
    query,
    approvedScript: removeMarkdownAsterisks(banglaReply),
    shortVersion: removeMarkdownAsterisks(shortBn),
    warmVersion: removeMarkdownAsterisks(warmBn),
    englishVersion: removeMarkdownAsterisks(englishReply),
    banglaVersion: removeMarkdownAsterisks(banglaReply),
    languageDetected: lang
  };
}

function formatProductReply(query: string, product: ProductItem, lang: 'bangla' | 'english' | 'banglish'): GeneratedReply {
  const banglaReply = `প্রিয় গ্রাহক,

ইগলুর প্রতি আপনার আগ্রহের জন্য আন্তরিক ধন্যবাদ।

${product.banglaName} (${product.name})-এর অফিসিয়াল মূল্য:
• প্রতি পিস: ৳${product.pricePerPcs}
• কার্টুন মূল্য: ৳${product.pricePerCarton}
(ভলিউম: ${product.volume} মিলি)

অর্ডার করতে ভিজিট করুন: https://igloobd.com/ অথবা আমাদের হটলাইন ১৬৫৫৬ (সকাল ৯:০০টা - সন্ধ্যা ৬:০০টা) নম্বরে যোগাযোগ করুন। ঢাকা মেট্রোপলিটন এলাকায় হোম ডেলিভারি সম্পূর্ণ ফ্রি।

ধন্যবাদ।`;

  const englishReply = `Dear Valued Customer,

Thank you for contacting Igloo Ice Cream.

Official price for ${product.name} (${product.banglaName}):
• Per Piece: ৳${product.pricePerPcs}
• Carton Price: ৳${product.pricePerCarton}
(Volume: ${product.volume} ml)

To place an order, please visit: https://igloobd.com/ or call our helpline at 16556 (9:00 AM – 6:00 PM). Free home delivery is available across Dhaka Metropolitan City.

Thank you.`;

  const shortBn = `প্রিয় গ্রাহক, ${product.banglaName}-এর মূল্য ৳${product.pricePerPcs} (কার্টুন ৳${product.pricePerCarton})। অর্ডার করতে ভিজিট করুন igloobd.com অথবা কল করুন ১৬৫৫৬। ধন্যবাদ।`;
  const shortEn = `Dear Customer, ${product.name} is ৳${product.pricePerPcs}/pc (Carton: ৳${product.pricePerCarton}). Order online at igloobd.com or call 16556. Thank you.`;

  const warmBn = `প্রিয় গ্রাহক, ইগলুর সুস্বাদু ${product.banglaName}-এর খুচরা মূল্য মাত্র ৳${product.pricePerPcs} (কার্টুন ৳${product.pricePerCarton})! 🍦 অর্ডার করতে ভিজিট করুন igloobd.com অথবা যোগাযোগ করুন ১৬৫৫৬ নম্বরে। ধন্যবাদ! ❤️`;
  const warmEn = `Dear Valued Customer, delicious Igloo ${product.name} is only ৳${product.pricePerPcs} per piece (Carton: ৳${product.pricePerCarton})! 🍦 Order now at igloobd.com or call 16556. Thank you! ❤️`;

  return {
    id: `reply-${Date.now()}`,
    source: 'local_rule_engine',
    matchedType: 'product_price',
    confidence: 0.98,
    matchedEntityName: `${product.name} (৳${product.pricePerPcs})`,
    query,
    approvedScript: removeMarkdownAsterisks(banglaReply),
    shortVersion: removeMarkdownAsterisks(shortBn),
    warmVersion: removeMarkdownAsterisks(warmBn),
    englishVersion: removeMarkdownAsterisks(englishReply),
    banglaVersion: removeMarkdownAsterisks(banglaReply),
    languageDetected: lang,
    matchedProduct: product
  };
}

function formatFAQReply(
  query: string,
  faq: FAQItem,
  lang: 'bangla' | 'english' | 'banglish',
  matchedType: 'product_price' | 'faq' | 'positive_comment' | 'complaint' | 'escalation' | 'general' | 'area_delivery',
  entityName: string,
  confidence: number
): GeneratedReply {
  return {
    id: `reply-${Date.now()}`,
    source: 'local_rule_engine',
    matchedType,
    confidence,
    matchedEntityName: entityName,
    query,
    approvedScript: removeMarkdownAsterisks(faq.banglaReply),
    shortVersion: removeMarkdownAsterisks(faq.shortBn || faq.banglaReply),
    warmVersion: removeMarkdownAsterisks(faq.warmBn || faq.banglaReply),
    englishVersion: removeMarkdownAsterisks(faq.englishReply),
    banglaVersion: removeMarkdownAsterisks(faq.banglaReply),
    languageDetected: lang,
    matchedFAQ: faq
  };
}

function generateEscalationReply(query: string, lang: 'bangla' | 'english' | 'banglish'): GeneratedReply {
  const banglaReply = `প্রিয় গ্রাহক,

ইগলুর সাথে যোগাযোগ করার জন্য আপনাকে ধন্যবাদ।

আপনার প্রশ্নটি সঠিকভাবে বুঝে সার্বিক সমাধান দেওয়ার জন্য অনুগ্রহ করে একটু বিস্তারিত জানান, অথবা আমাদের অফিশিয়াল হেল্পলাইন ১৬৫৫৬ (সকাল ৯:০০টা - সন্ধ্যা ৬:০০টা) নম্বরে যোগাযোগ করুন। আমাদের কাস্টমার সার্ভিস প্রতিনিধি আপনাকে দ্রুত সহায়তা করবেন।

এছাড়াও বিস্তারিত তথ্য ও অনলাইন অর্ডারের জন্য ভিজিট করুন: https://igloobd.com/

ধন্যবাদ।`;

  const englishReply = `Dear Valued Customer,

Thank you for reaching out to Igloo Ice Cream.

To assist you accurately with your inquiry, kindly provide a bit more details or feel free to contact our customer care helpline at 16556 (9:00 AM – 6:00 PM). Our support representative will gladly assist you.

You can also explore all products and order online at: https://igloobd.com/

Thank you for choosing Igloo.`;

  const shortBn = `প্রিয় গ্রাহক, বিস্তারিত তথ্যের জন্য অনুগ্রহ করে আমাদের হেল্পলাইন ১৬৫৫৬ (সকাল ৯টা-সন্ধ্যা ৬টা) নম্বরে কল করুন অথবা ভিজিট করুন igloobd.com। ধন্যবাদ।`;
  const shortEn = `Dear Valued Customer, for assistance please contact our customer helpline at 16556 (9:00 AM - 6:00 PM) or visit igloobd.com. Thank you.`;

  const warmBn = `প্রিয় গ্রাহক, আপনার যেকোনো মতামত বা জিজ্ঞাসায় আমরা সবসময় পাশে আছি। ১৬৫৫৬ নম্বরে কল করে বা ইনবক্সে জানিয়ে দিন আপনার প্রশ্নটি। ধন্যবাদ! ❤️`;
  const warmEn = `Dear Valued Customer, we are always here to help you! Please call 16556 or share your details so our team can assist you right away. Thank you! ❤️`;

  return {
    id: `reply-${Date.now()}`,
    source: 'local_rule_engine',
    matchedType: 'escalation',
    confidence: 0.85,
    matchedEntityName: 'Igloo Customer Support (16556)',
    query,
    approvedScript: removeMarkdownAsterisks(banglaReply),
    shortVersion: removeMarkdownAsterisks(shortBn),
    warmVersion: removeMarkdownAsterisks(warmBn),
    englishVersion: removeMarkdownAsterisks(englishReply),
    banglaVersion: removeMarkdownAsterisks(banglaReply),
    languageDetected: lang
  };
}
