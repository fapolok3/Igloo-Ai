export interface ProductItem {
  id: string;
  category: string;
  name: string;
  banglaName: string;
  volume: number; // in ml
  pricePerPcs: number; // in BDT
  pricePerCarton: number; // in BDT
  pcsPerCarton?: number;
  description?: string;
  tags: string[];
}

export interface FAQItem {
  id: string;
  category: string;
  topic: string;
  topicBn: string;
  keywords: string[];
  banglaReply: string;
  englishReply: string;
  shortBn?: string;
  shortEn?: string;
  warmBn?: string;
  warmEn?: string;
}

export const CATEGORIES = [
  'All',
  'Stick Normal',
  'Stick Premium',
  'Regular Cup',
  'Premium Cup',
  'Mini Cone',
  'Regular Cone',
  '1 L Regular',
  '1 L Double Sundae',
  '1 L Dessert',
  '1 L Premium',
  'Cake',
  '2 L Regular'
] as const;

export const FAQ_CATEGORIES = [
  'All',
  'অর্ডার ও ডেলিভারি (Order & Delivery)',
  'পণ্য প্রাপ্যতা ও স্টক (Stock & Availability)',
  'অফার ও পেমেন্ট (Offers & Payment)',
  'অভিযোগ ও কোয়ালিটি (Quality & Issues)',
  'ডিলারশিপ ও ফ্রিজ (Dealer & Freezer)',
  'ম্যাংগো লেয়ারস ও কম্বো (Mango Layers)',
  'ম্যাংগো ফিউশন (Mango Fusion)',
  'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
  'ফেসবুক কমেন্ট ও প্রশংসা (Comments & Feedback)',
  'সাধারণ ও সহায়তা (General & Support)'
] as const;

// Comprehensive list of covered Dhaka Metropolitan City areas for free home delivery
export const DHAKA_METRO_AREAS = [
  { name: 'Dhanmondi', bn: 'ধানমন্ডি', aliases: ['dhanmondi', 'ধানমন্ডি', 'dhanmondi 32', 'dhanmondi 27', 'zigatola', 'জিগাতলা', 'shankharibazar', 'science lab', 'সাইন্স ল্যাব', 'kalabagan', 'কলাবাগান', 'sobhanbag', 'সোবহানবাগ', 'sukrabad', 'শুক্রাবাদ'] },
  { name: 'Gulshan', bn: 'গুলশান', aliases: ['gulshan', 'গুলশান', 'gulshan 1', 'gulshan 2', 'গুলশান ১', 'গুলশান ২', 'gulshan-1', 'gulshan-2', 'shahjadpur', 'শাহজাদপুর', 'niketan', 'নিকেতন'] },
  { name: 'Banani', bn: 'বনানী', aliases: ['banani', 'বনানী', 'banani doh', 'banani dohs', 'বনানী ডিওএইচএস', 'kakoli', 'কাকলী', 'kemal ataturk', 'chairmanbari', 'চেয়ারম্যান বাড়ি'] },
  { name: 'Uttara', bn: 'উত্তরা', aliases: ['uttara', 'উত্তরা', 'uttara sector', 'sector 1', 'sector 3', 'sector 4', 'sector 7', 'sector 10', 'sector 11', 'sector 13', 'sector 14', 'আজমপুর', 'azampur', 'house building', 'আব্দুল্লাহপুর', 'abdullahpur', 'diabari', 'দিয়াবাড়ি', 'jasimuddin', 'জসিমউদ্দিন'] },
  { name: 'Mirpur', bn: 'মিরপুর', aliases: ['mirpur', 'মিরপুর', 'mirpur 1', 'mirpur 2', 'mirpur 6', 'mirpur 10', 'mirpur 11', 'mirpur 12', 'mirpur 14', 'মিরপুর ১', 'মিরপুর ২', 'মিরপুর ১০', 'মিরপুর ১১', 'মিরপুর ১২', 'মিরপুর ১৪', 'mirpur dohs', 'মিরপুর ডিওএইচএস', 'pallabi', 'পল্লবী', 'shewrapara', 'শেওড়াপাড়া', 'kazipara', 'কাজীপাড়া', 'agargaon', 'আগারগাঁও', 'rupnagar', 'রূপনগর', 'paikpara', 'পাইকপাড়া', 'kallyanpur', 'কল্যাণপুর', 'gabtoli', 'গাবতলী'] },
  { name: 'Mohammadpur', bn: 'মোহাম্মদপুর', aliases: ['mohammadpur', 'মোহাম্মদপুর', 'adabor', 'আদাবর', 'shekhertek', 'শেখেরটেক', 'town hall', 'টাউন হল', 'nurjahan road', 'noorjahan road', 'tajmahal road', 'তাজমহল রোড', 'iqbal road', 'ইকবাল রোড', 'japan garden city', 'জাপান গার্ডেন সিটি', 'bosila', 'বসিলা', 'ghatfarhadbeg', 'shia masjid', 'শিয়া মসজিদ'] },
  { name: 'Badda', bn: 'বাড্ডা', aliases: ['badda', 'বাড্ডা', 'middle badda', 'মধ্য বাড্ডা', 'north badda', 'উত্তর বাড্ডা', 'merul badda', 'মেরুল বাড্ডা', 'aftabnagar', 'আফতাবনগর', 'south badda', 'দক্ষিণ বাড্ডা'] },
  { name: 'Baridhara', bn: 'বারিধারা', aliases: ['baridhara', 'বারিধারা', 'baridhara dohs', 'বারিধারা ডিওএইচএস', 'diplomatic zone', 'baridhara j block'] },
  { name: 'Bashundhara R/A', bn: 'বসুন্ধরা আবাসিক এলাকা', aliases: ['bashundhara', 'বসুন্ধরা', 'bashundhara r/a', 'bashundhara residential', 'বসুন্ধরা আর/এ', 'block a', 'block c', 'block d', 'block f', 'block i', 'kuril', 'কুড়িল', 'kuril chowrasta', '300 feet', '৩০০ ফিট', 'evercare'] },
  { name: 'Mohakhali', bn: 'মহাখালী', aliases: ['mohakhali', 'মহাখালী', 'mohakhali dohs', 'মহাখালী ডিওএইচএস', 'tb gate', 'wireless', 'ওয়ারলেস', 'amtoli', 'আমতলী', 'rasulbag', 'রসুলবাগ'] },
  { name: 'Tejgaon', bn: 'তেজগাঁও', aliases: ['tejgaon', 'তেজগাঁও', 'tejgaon i/a', 'শিল্পাঞ্চল', 'nakhalpara', 'নাখালপাড়া', 'farmgate', 'ফার্মগেট', 'kunipara', 'কুনিপাড়া', 'arjatpara', 'আরজতপাড়া', 'monipuripara', 'মণিপুরীপাড়া'] },
  { name: 'Khilgaon', bn: 'খিলগাঁও', aliases: ['khilgaon', 'খিলগাঁও', 'taltola', 'তালতলা', 'goran', 'গোড়ান', 'sipahibag', 'সিপাহীবাগ', 'tilpapara', 'তিলপাপাড়া', 'khilgaon chowrasta'] },
  { name: 'Malibagh', bn: 'মালিবাগ', aliases: ['malibagh', 'মালিবাগ', 'mouchak', 'মৌচাক', 'malibagh chowdhury para', 'চৌধুরীপাড়া', 'wireless mor'] },
  { name: 'Shantinagar', bn: 'শান্তিনগর', aliases: ['shantinagar', 'শান্তিনগর', 'sidheshwari', 'সিদ্ধেশ্বরী', 'chamelibag', 'চামেলীবাগ', 'kakrail', 'কাকরাইল', 'bijoynagar', 'বিজয় নগর', 'segunbagicha', 'সেগুনবাগিচা'] },
  { name: 'Motijheel', bn: 'মতিঝিল', aliases: ['motijheel', 'মতিঝিল', 'dilkusha', 'দিলকুশা', 'fakirapool', 'ফকিরাপুল', 'arambagh', 'আরামবাগ', 'kamalapur', 'কমলাপুর', 'dainik bangla', 'দৈনিক বাংলা'] },
  { name: 'Old Dhaka (Puran Dhaka)', bn: 'পুরান ঢাকা', aliases: ['old dhaka', 'puran dhaka', 'পুরান ঢাকা', 'lalbagh', 'লালবাগ', 'chawkbazar', 'চকবাজার', 'sadarghat', 'সদরঘাট', 'wピッ', 'wari', 'ওয়ারী', 'sutrapur', 'সূত্রাপুর', 'kotwali', 'কোতোয়ালী', 'armanitola', 'আরমানীটোলা', 'bangshal', 'বংশাল', 'tatibazar', 'তাঁতীবাজার', 'shakhari bazar', 'shankhari bazar', 'shampur', 'শ্যামপুর', 'gandaria', 'গেন্ডারিয়া', 'narinda', 'নারিন্দা', 'tikotuli', 'টিকাটুলী', 'dayaganj', 'দয়াগঞ্জ', 'hazaribagh', 'হাজারীবাগ', 'kamrangirchar', 'কামরাঙ্গীরচর', 'mitford', 'মিটফোর্ড', 'nazimuddin road', 'নাজিমউদ্দিন রোড'] },
  { name: 'Rampura', bn: 'রামপুরা', aliases: ['rampura', 'রামপুরা', 'banasree', 'বনশ্রী', 'south banasree', 'দক্ষিণ বনশ্রী', 'east rampura', 'পূর্ব রামপুরা', 'hajipara', 'হাজীপাড়া', 'mohanagar project', 'মহানগর প্রজেক্ট', 'tv center'] },
  { name: 'Moghbazar', bn: 'মগবাজার', aliases: ['moghbazar', 'মগবাজার', 'magbazar', 'wireless mor', 'dilu road', 'দিলু রোড', 'nayatola', 'নয়াটোলা', 'peon colony'] },
  { name: 'Bimanbandar & Khilkhet', bn: 'বিমানবন্দর ও খিলক্ষেত', aliases: ['khilkhet', 'খিলক্ষেত', 'airport', 'বিমানবন্দর', 'nikunja', 'নিকুঞ্জ', 'nikunja 1', 'nikunja 2', 'নিকুঞ্জ ১', 'নিকুঞ্জ ২', 'dumni', 'pink city', 'পিংকল সিটি'] },
  { name: 'Cantonment & Kafrul', bn: 'সেনানিবাস ও কাফরুল', aliases: ['cantonment', 'সেনানিবাস', 'kafrul', 'কাফরুল', 'ibrahimpur', 'ইব্রাহিমপুর', 'shewra', 'শেওড়া', 'dhaka cantt'] },
  { name: 'Shahbagh & Elephant Road', bn: 'শাহবাগ ও এলিফ্যান্ট রোড', aliases: ['shahbagh', 'শাহবাগ', 'elephant road', 'এলিফ্যান্ট রোড', 'new market', 'নিউ মার্কেট', 'nilkhet', 'নীলক্ষেত', 'dhaka university', 'ঢাকা বিশ্ববিদ্যালয়', 'du campus', 'katabon', 'কাঁটাবন', 'hatirpool', 'হাতিরপুল', 'paribagh', 'পরীবাগ'] },
  { name: 'Jatrabari & Sayedabad', bn: 'যাত্রাবাড়ী ও সায়েদাবাদ', aliases: ['jatrabari', 'যাত্রাবাড়ী', 'sayedabad', 'সায়েদাবাদ', 'dhalpur', 'ধলপুর', 'donia', 'দনিয়া', 'matuail', 'মাতুয়াইল', 'shanir akhra', 'শনির আখড়া', 'rajerbagh', 'কাজলা', 'kajla', 'jurain', 'জুরাইন', 'postogola', 'পোস্তগোলা'] },
  { name: 'Babu Bazar & Keraniganj Bridge Side', bn: 'বাবু বাজার ও সংলগ্ন এলাকা', aliases: ['babu bazar', 'বাবু বাজার', 'nayabazar', 'নয়াবাজার', 'badamtoli', 'বাদামতলী'] }
];

export const IGLOO_PRODUCTS: ProductItem[] = [
  // Stick Normal
  { id: 'p1', category: 'Stick Normal', name: 'CHOCBAR', banglaName: 'চকবার', volume: 70, pricePerPcs: 35, pricePerCarton: 840, tags: ['chocbar', 'choc bar', 'চকবার', 'stick'] },
  { id: 'p2', category: 'Stick Normal', name: 'CHOCBAR INSTA', banglaName: 'চকবার ইন্সটা', volume: 65, pricePerPcs: 30, pricePerCarton: 720, tags: ['insta', 'chocbar insta', 'চকবার ইন্সটা'] },
  { id: 'p3', category: 'Stick Normal', name: 'SHELL & CORE', banglaName: 'শেল অ্যান্ড কোর', volume: 58, pricePerPcs: 30, pricePerCarton: 750, tags: ['shell & core', 'shell and core', 'শেল অ্যান্ড কোর'] },
  { id: 'p4', category: 'Stick Normal', name: 'LOLLY - LEMON', banglaName: 'ললি - লেমন', volume: 58, pricePerPcs: 20, pricePerCarton: 500, tags: ['lemon lolly', 'লেমন ললি', 'lolly lemon'] },
  { id: 'p5', category: 'Stick Normal', name: 'LOLLY - ORANGE', banglaName: 'ললি - অরেঞ্জ', volume: 58, pricePerPcs: 20, pricePerCarton: 500, tags: ['orange lolly', 'অরেঞ্জ ললি', 'lolly orange'] },
  { id: 'p6', category: 'Stick Normal', name: 'LOLLY - LYCHEE', banglaName: 'ললি - লিচু', volume: 58, pricePerPcs: 25, pricePerCarton: 625, tags: ['lychee lolly', 'লিচু ললি', 'lolly lychee'] },
  { id: 'p7', category: 'Stick Normal', name: 'LOLLY - WATERMELON', banglaName: 'ললি - তরমুজ', volume: 58, pricePerPcs: 25, pricePerCarton: 625, tags: ['watermelon lolly', 'তরমুজ ললি', 'lolly watermelon'] },
  { id: 'p8', category: 'Stick Normal', name: 'DUDH MALAI', banglaName: 'দুধ মালাই', volume: 50, pricePerPcs: 20, pricePerCarton: 625, tags: ['dudh malai', 'দুধ মালাই', 'dudh malai stick'] },

  // Stick Premium
  { id: 'p9', category: 'Stick Premium', name: 'EGO', banglaName: 'ইগো', volume: 75, pricePerPcs: 100, pricePerCarton: 1200, tags: ['ego', 'ইগো', 'premium stick'] },
  { id: 'p10', category: 'Stick Premium', name: 'MEGA', banglaName: 'মেগা', volume: 100, pricePerPcs: 50, pricePerCarton: 960, tags: ['mega', 'মেগা'] },
  { id: 'p11', category: 'Stick Premium', name: 'MACHO', banglaName: 'মাচো', volume: 100, pricePerPcs: 50, pricePerCarton: 960, tags: ['macho', 'মাচো'] },
  { id: 'p12', category: 'Stick Premium', name: 'LOLLY - KIWI', banglaName: 'ললি - কিউই', volume: 58, pricePerPcs: 30, pricePerCarton: 750, tags: ['kiwi lolly', 'কিউই ললি'] },
  { id: 'p13', category: 'Stick Premium', name: 'LOLLY - PEACH', banglaName: 'ললি - পিচ', volume: 58, pricePerPcs: 30, pricePerCarton: 750, tags: ['peach lolly', 'পিচ ললি'] },
  { id: 'p14', category: 'Stick Premium', name: 'ALMOND SPLIT (EXOTIC BAR)', banglaName: 'আমন্ড স্প্লিট (এক্সোটিক বার)', volume: 100, pricePerPcs: 180, pricePerCarton: 1800, tags: ['almond split', 'exotic bar', 'আমন্ড স্প্লিট'] },
  { id: 'p15', category: 'Stick Premium', name: 'SWISS CHOCOLATE (EXOTIC BAR)', banglaName: 'সুইস চকলেট (এক্সোটিক বার)', volume: 100, pricePerPcs: 180, pricePerCarton: 1800, tags: ['swiss chocolate', 'exotic bar', 'সুইস চকলেট'] },

  // Regular Cup
  { id: 'p16', category: 'Regular Cup', name: 'VANILLA CUP', banglaName: 'ভ্যানিলা কাপ', volume: 100, pricePerPcs: 30, pricePerCarton: 540, tags: ['vanilla cup', 'ভ্যানিলা কাপ'] },
  { id: 'p17', category: 'Regular Cup', name: 'STRAWBERRY CUP', banglaName: 'স্ট্রবেরি কাপ', volume: 100, pricePerPcs: 30, pricePerCarton: 540, tags: ['strawberry cup', 'স্ট্রবেরি কাপ'] },
  { id: 'p18', category: 'Regular Cup', name: 'CHOCOLATE CUP', banglaName: 'চকলেট কাপ', volume: 100, pricePerPcs: 30, pricePerCarton: 540, tags: ['chocolate cup', 'চকলেট কাপ'] },
  { id: 'p19', category: 'Regular Cup', name: 'MANGO CUP', banglaName: 'ম্যাংগো কাপ', volume: 100, pricePerPcs: 30, pricePerCarton: 540, tags: ['mango cup', 'ম্যাংগো কাপ'] },
  { id: 'p20', category: 'Regular Cup', name: 'SNOWBALL / FOOTBALL', banglaName: 'স্নোবল / ফুটবল', volume: 100, pricePerPcs: 35, pricePerCarton: 700, tags: ['snowball', 'football', 'স্নোবল', 'ফুটবল'] },
  { id: 'p21', category: 'Regular Cup', name: 'MANGO MAGIC', banglaName: 'ম্যাংগো ম্যাজিক', volume: 125, pricePerPcs: 35, pricePerCarton: 700, tags: ['mango magic', 'ম্যাংগো ম্যাজিক'] },

  // Premium Cup
  { id: 'p22', category: 'Premium Cup', name: 'ICE CAFÉ', banglaName: 'আইস ক্যাফে কাপ', volume: 100, pricePerPcs: 60, pricePerCarton: 720, tags: ['ice cafe', 'coffee cup', 'আইস ক্যাফে'] },
  { id: 'p23', category: 'Premium Cup', name: 'NUTRICKS', banglaName: 'নিউটট্রিকস', volume: 100, pricePerPcs: 60, pricePerCarton: 720, tags: ['nutricks', 'নিউটট্রিকস'] },
  { id: 'p24', category: 'Premium Cup', name: 'DOI FROZEN DESSERT', banglaName: 'দই ফ্রোজেন ডেজার্ট কাপ', volume: 100, pricePerPcs: 70, pricePerCarton: 840, tags: ['doi cup', 'দই কাপ'] },
  { id: 'p25', category: 'Premium Cup', name: 'BLACK FOREST', banglaName: 'ব্ল্যাক ফরেস্ট কাপ', volume: 100, pricePerPcs: 70, pricePerCarton: 840, tags: ['black forest cup', 'ব্ল্যাক ফরেস্ট'] },
  { id: 'p26', category: 'Premium Cup', name: 'KHEER MALAI', banglaName: 'ক্ষীর মালাই কাপ', volume: 100, pricePerPcs: 70, pricePerCarton: 840, tags: ['kheer malai cup', 'ক্ষীর মালাই'] },
  { id: 'p27', category: 'Premium Cup', name: 'BLUEBERRY YOGHURT', banglaName: 'ব্লুবেরি ইয়োগার্ট কাপ', volume: 100, pricePerPcs: 100, pricePerCarton: 1200, tags: ['blueberry yoghurt cup', 'ব্লুবেরি'] },
  { id: 'p28', category: 'Premium Cup', name: 'STRAWBERRY CHEESECAKE', banglaName: 'স্ট্রবেরি চিজকেক কাপ', volume: 100, pricePerPcs: 100, pricePerCarton: 1200, tags: ['strawberry cheesecake cup', 'স্ট্রবেরি চিজকেক'] },
  { id: 'p29', category: 'Premium Cup', name: 'SINGLE SUNDAE', banglaName: 'সিঙ্গেল সানডে', volume: 120, pricePerPcs: 50, pricePerCarton: 600, tags: ['single sundae', 'সানডে'] },

  // Mini Cone & Regular Cone
  { id: 'p30', category: 'Mini Cone', name: 'CORNELLI CLASSIC (MINI)', banglaName: 'কড়নেলি ক্লাসিক (মিনি)', volume: 85, pricePerPcs: 40, pricePerCarton: 960, tags: ['cornelli mini', 'মিনি কোন'] },
  { id: 'p31', category: 'Mini Cone', name: 'BELGIAN CHOCOLATE (MINI)', banglaName: 'বেলজিয়ান চকলেট (মিনি)', volume: 85, pricePerPcs: 45, pricePerCarton: 1080, tags: ['belgian mini', 'বেলজিয়ান মিনি'] },
  { id: 'p32', category: 'Regular Cone', name: 'CORNELLI CLASSIC', banglaName: 'কড়নেলি ক্লাসিক (রেগুলার)', volume: 115, pricePerPcs: 60, pricePerCarton: 840, tags: ['cornelli classic', 'রেগুলার কোন'] },
  { id: 'p33', category: 'Regular Cone', name: 'BELGIAN CHOCOLATE', banglaName: 'বেলজিয়ান চকলেট (রেগুলার)', volume: 115, pricePerPcs: 70, pricePerCarton: 980, tags: ['belgian chocolate cone', 'বেলজিয়ান কোন'] },

  // 1 L Regular
  { id: 'p34', category: '1 L Regular', name: 'VANILLA 1L', banglaName: 'ভ্যানিলা ১ লিটার', volume: 1000, pricePerPcs: 300, pricePerCarton: 300, tags: ['vanilla 1l', 'ভ্যানিলা ১ লিটার'] },
  { id: 'p35', category: '1 L Regular', name: 'STRAWBERRY 1L', banglaName: 'স্ট্রবেরি ১ লিটার', volume: 1000, pricePerPcs: 300, pricePerCarton: 300, tags: ['strawberry 1l', 'স্ট্রবেরি ১ লিটার'] },
  { id: 'p36', category: '1 L Regular', name: 'MANGO 1L', banglaName: 'ম্যাংগো ১ লিটার', volume: 1000, pricePerPcs: 300, pricePerCarton: 300, tags: ['mango 1l', 'ম্যাংগো ১ লিটার'] },
  { id: 'p37', category: '1 L Regular', name: 'CHOCOLATE 1L', banglaName: 'চকলেট ১ লিটার', volume: 1000, pricePerPcs: 300, pricePerCarton: 300, tags: ['chocolate 1l', 'চকলেট ১ লিটার'] },

  // 1 L Double Sundae
  { id: 'p38', category: '1 L Double Sundae', name: 'MANGO MELODY', banglaName: 'ম্যাংগো মেলোডি ১ লিটার', volume: 1000, pricePerPcs: 350, pricePerCarton: 350, tags: ['mango melody', 'ম্যাংগো মেলোডি'] },
  { id: 'p39', category: '1 L Double Sundae', name: 'STRAWBERRY SPARKLE', banglaName: 'স্ট্রবেরি স্পার্কল ১ লিটার', volume: 1000, pricePerPcs: 350, pricePerCarton: 350, tags: ['strawberry sparkle', 'স্ট্রবেরি স্পার্কল'] },
  { id: 'p40', category: '1 L Double Sundae', name: 'CHOCOLATE CHEERS', banglaName: 'চকলেট চেয়ার্স ১ লিটার', volume: 1000, pricePerPcs: 350, pricePerCarton: 350, tags: ['chocolate cheers', 'চকলেট চেয়ার্স'] },
  { id: 'p41', category: '1 L Double Sundae', name: 'CARAMEL COMBO', banglaName: 'ক্যারামেল কম্বো ১ লিটার', volume: 1000, pricePerPcs: 350, pricePerCarton: 350, tags: ['caramel combo', 'ক্যারামেল কম্বো'] },

  // 1 L Dessert
  { id: 'p42', category: '1 L Dessert', name: 'NAWABI MITHAI', banglaName: 'নবাবী মিঠাই ১ লিটার', volume: 1000, pricePerPcs: 400, pricePerCarton: 400, tags: ['nawabi mithai', 'নবাবী মিঠাই'] },
  { id: 'p43', category: '1 L Dessert', name: 'RASH MALAI', banglaName: 'রস মালাই ১ লিটার', volume: 1000, pricePerPcs: 450, pricePerCarton: 450, tags: ['rash malai', 'রস মালাই'] },
  { id: 'p44', category: '1 L Dessert', name: 'KHEER MALAI 1L', banglaName: 'ক্ষীর মালাই ১ লিটার', volume: 1000, pricePerPcs: 400, pricePerCarton: 400, tags: ['kheer malai 1l', 'ক্ষীর মালাই ১ লিটার'] },
  { id: 'p45', category: '1 L Dessert', name: 'DOI FROZEN DESSERT 1L', banglaName: 'দই ফ্রোজেন ডেজার্ট ১ লিটার', volume: 1000, pricePerPcs: 450, pricePerCarton: 450, tags: ['doi 1l', 'দই ১ লিটার'] },
  { id: 'p46', category: '1 L Dessert', name: 'ICE CAFÉ 1L', banglaName: 'আইস ক্যাফে ১ লিটার', volume: 1000, pricePerPcs: 350, pricePerCarton: 350, tags: ['ice cafe 1l', 'কফি ১ লিটার'] },
  { id: 'p47', category: '1 L Dessert', name: 'AMBROSIA', banglaName: 'অ্যামব্রোশিয়া ১ লিটার', volume: 1000, pricePerPcs: 400, pricePerCarton: 400, tags: ['ambrosia', 'অ্যামব্রোশিয়া'] },
  { id: 'p48', category: '1 L Dessert', name: 'BUTTERSCOTCH', banglaName: 'বাটারস্কচ ১ লিটার', volume: 1000, pricePerPcs: 400, pricePerCarton: 400, tags: ['butterscotch', 'বাটারস্কচ'] },

  // 1 L Premium
  { id: 'p49', category: '1 L Premium', name: 'BLUEBERRY YOGHURT 1L', banglaName: 'ব্লুবেরি ইয়োগার্ট ১ লিটার', volume: 1000, pricePerPcs: 600, pricePerCarton: 795, tags: ['blueberry yoghurt 1l', 'ব্লুবেরি ১ লিটার'] },
  { id: 'p50', category: '1 L Premium', name: 'BUTTER PECAN 1L', banglaName: 'বাটার পিকান ১ লিটার', volume: 1000, pricePerPcs: 600, pricePerCarton: 600, tags: ['butter pecan', 'বাটার পিকান'] },
  { id: 'p51', category: '1 L Premium', name: 'FRENCH VANILLA 1L', banglaName: 'ফ্রেঞ্চ ভ্যানিলা ১ লিটার', volume: 1000, pricePerPcs: 500, pricePerCarton: 795, tags: ['french vanilla', 'ফ্রেঞ্চ ভ্যানিলা'] },
  { id: 'p52', category: '1 L Premium', name: 'STRAWBERRY CHEESECAKE 1L', banglaName: 'স্ট্রবেরি চিজকেক ১ লিটার', volume: 1000, pricePerPcs: 500, pricePerCarton: 795, tags: ['strawberry cheesecake 1l', 'স্ট্রবেরি চিজকেক'] },
  { id: 'p53', category: '1 L Premium', name: 'RED VELVET 1L', banglaName: 'রেড ভেলভেট ১ লিটার', volume: 1000, pricePerPcs: 600, pricePerCarton: 795, tags: ['red velvet', 'রেড ভেলভেট'] },

  // Cake & 2L Regular
  { id: 'p54', category: 'Cake', name: 'RIPPLE CAKE 1 LITER', banglaName: 'রিপল কেক ১ লিটার', volume: 1000, pricePerPcs: 500, pricePerCarton: 500, tags: ['ripple cake', 'ice cream cake', 'কেক'] },
  { id: 'p55', category: '2 L Regular', name: 'VANILLA 2L', banglaName: 'ভ্যানিলা ২ লিটার', volume: 2000, pricePerPcs: 520, pricePerCarton: 520, tags: ['vanilla 2l', 'ভ্যানিলা ২ লিটার'] },
  { id: 'p56', category: '2 L Regular', name: 'CHOCOLATE 2L', banglaName: 'চকলেট ২ লিটার', volume: 2000, pricePerPcs: 520, pricePerCarton: 520, tags: ['chocolate 2l', 'চকলেট ২ লিটার'] }
];

export const SPECIAL_ITEMS = [
  {
    name: 'Mango Layers (900ml)',
    banglaName: 'ম্যাংগো লেয়ারস (৯০০ মিলি)',
    price: 390,
    desc: '4-Layer Architecture with real mango pulp infusion',
    link: 'https://igloobd.com/product-details/mango-layers',
    tags: ['mango layers', 'layers', 'ম্যাংগো লেয়ারস']
  },
  {
    name: 'Mango Fusion (900ml)',
    banglaName: 'ম্যাংগো ফিউশন (৯০০ মিলি)',
    price: 390,
    desc: '40% Real Alphonso Mango blend',
    link: 'https://igloobd.com/product-details/mango-fusion',
    tags: ['mango fusion', 'fusion', 'ম্যাংগো ফিউশন']
  },
  {
    name: 'Mango Layers & Fusion Combo',
    banglaName: 'ম্যাংগো লেয়ারস এবং ফিউশন কম্বো',
    price: 780,
    desc: 'Special Double Delight Fruit Dessert Combo',
    link: 'https://igloobd.com/product-details/mango-layers-mango-fusion-combo',
    tags: ['combo 780', 'mango combo']
  },
  {
    name: 'Mango Layers, Fusion & Zero Vanilla Mega Combo',
    banglaName: 'ম্যাংগো লেয়ারস, ফিউশন ও জিরো ভ্যানিলা মেগা কম্বো',
    price: 1030,
    desc: 'Trio Mega Combo Pack',
    link: 'https://igloobd.com/product-details/mango-layers-mango-fusion-zero-vanilla-combo',
    tags: ['combo 1030', 'mega combo']
  }
];

export const IGLOO_FAQS: FAQItem[] = [
  // 1. General Customer Message FAQs
  {
    id: 'faq-1-out-of-stock',
    category: 'পণ্য প্রাপ্যতা ও স্টক (Stock & Availability)',
    topic: 'Out of stock',
    topicBn: 'প্রোডাক্ট স্টক আউট থাকলে',
    keywords: ['out of stock', 'stock', 'স্টক আউট', 'নাই', 'নেই', 'stock out', 'available na'],
    banglaReply: 'দুঃখিত, প্রোডাক্টটি এই মুহূর্তে স্টক আউট রয়েছে। আমরা আশা করছি খুব শীঘ্রই এটি আবার স্টকে উপলব্ধ হবে। আপডেটের জন্য আমাদের সাথেই থাকুন। আপনার আগ্রহের জন্য আন্তরিক ধন্যবাদ।',
    englishReply: 'We sincerely apologize, but this product is currently out of stock. We hope it will be available again very soon. Please stay tuned for updates. Thank you for your interest and patience.'
  },
  {
    id: 'faq-2-cone-biscuits-sale',
    category: 'পণ্য প্রাপ্যতা ও স্টক (Stock & Availability)',
    topic: 'CONE biscuits SALE',
    topicBn: 'কোন বিস্কুট আলাদা বিক্রি হয় কি না',
    keywords: ['cone biscuits', 'cone biscuit', 'কোন বিস্কুট', 'বিস্কুট', 'biscuit alada', 'cone alada'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nদুঃখিত, কোন বিস্কুট আলাদাভাবে বিক্রি করা হয় না। এটি শুধুমাত্র নির্দিষ্ট অফারের সাথে দেওয়া হয়।\n\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest. We apologize, but cone biscuits are not available for separate purchase. They are only provided with selected promotional offers.\n\nThank you for your understanding.'
  },
  {
    id: 'faq-3-out-of-zone',
    category: 'অর্ডার ও ডেলিভারি (Order & Delivery)',
    topic: 'OUT of zone',
    topicBn: 'ডেলিভারি জোনের বাইরে',
    keywords: ['out of zone', 'zone baire', 'ডেলিভারি এরিয়ার বাইরে', 'outside dhaka zone'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার আগ্রহের জন্য ধন্যবাদ। দুঃখিত, বর্তমানে আমাদের হোম ডেলিভারি সার্ভিস শুধুমাত্র ঢাকা মেট্রোপলিটন এলাকার মধ্যে সীমাবদ্ধ।\n\nতবে আপনার নিকটস্থ দোকান বা সুপারশপে Igloo পণ্য পাওয়া যেতে পারে।\n\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest. We apologize, but our home delivery service is currently available only within Dhaka Metropolitan City.\n\nHowever, Igloo products may be available at nearby retail stores and supermarkets. We recommend checking with your local outlets for availability.\n\nThank you for your understanding.'
  },
  {
    id: 'faq-4-how-to-place-order',
    category: 'অর্ডার ও ডেলিভারি (Order & Delivery)',
    topic: 'How can I place an order?',
    topicBn: 'কিভাবে অর্ডার করব?',
    keywords: ['how to order', 'place order', 'kivabe order korbo', 'কিভাবে অর্ডার করব', 'order korar niom', 'order process'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।\n\nঅর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইটে ভিজিট করুন:\nhttps://igloobd.com/\n\nঅথবা আপনি চাইলে সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত ১৬৫৫৬ নম্বরে কল করেও অর্ডার করতে পারবেন।\n\nইগলুর ফ্রি হোম ডেলিভারি সার্ভিস বর্তমানে শুধুমাত্র ঢাকা মেট্রোপলিটন এলাকার মধ্যে উপলব্ধ।\n\nইগলুর সাথে থাকার জন্য আপনাকে ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest in Igloo.\n\nTo place your order, please visit our website:\nhttps://igloobd.com/\n\nOr call us at 16556 between 9:00 AM and 6:00 PM.\nIgloo provides free home delivery service within Dhaka Metropolitan City only.\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-5-is-delivery-available-in-my-area',
    category: 'অর্ডার ও ডেলিভারি (Order & Delivery)',
    topic: 'Is home delivery available in my area?',
    topicBn: 'আমার এলাকায় কি হোম ডেলিভারি পাওয়া যাবে?',
    keywords: ['delivery in my area', 'amr elakay delivery', 'ডেলিভারি পাওয়া যাবে', 'is delivery available'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।\n\nঅনুগ্রহ করে আপনার এলাকার নাম (এলাকা/শহর) আমাদের জানান। আমরা যাচাই করে জানাবো, আপনার এলাকায় হোম ডেলিভারি সেবা উপলব্ধ রয়েছে কি না।\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest.\n\nKindly share your location (Area/City), and we will check whether home delivery is available in your area and let you know accordingly.\nThank you.'
  },
  {
    id: 'faq-6-deliver-outside-dhaka',
    category: 'অর্ডার ও ডেলিভারি (Order & Delivery)',
    topic: 'Do you deliver outside Dhaka?',
    topicBn: 'ঢাকার বাইরে কি ডেলিভারি দেন?',
    keywords: ['outside dhaka', 'dhakar baire', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'barisal', 'mymensingh', 'rangpur', 'comilla', 'gazipur', 'narayanganj', 'savar', 'ঢাকার বাইরে ডেলিভারি'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।\n\nআন্তরিকভাবে দুঃখিত, বর্তমানে আমাদের হোম ডেলিভারি সার্ভিস শুধুমাত্র ঢাকা মেট্রোপলিটন এলাকার মধ্যে উপলব্ধ। ঢাকার বাইরে সরাসরি হোম ডেলিভারি সুবিধা নেই।\n\nতবে আপনার নিকটস্থ দোকান বা সুপারশপে Igloo-এর পণ্য পাওয়া যেতে পারে। ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest.\n\nWe sincerely apologize, but our home delivery service is currently available only within Dhaka Metropolitan City. We do not provide home delivery outside Dhaka.\n\nHowever, Igloo products may be available at your nearest retail stores or supermarkets.\nThank you for your understanding.'
  },
  {
    id: 'faq-7-when-will-i-receive-order',
    category: 'অর্ডার ও ডেলিভারি (Order & Delivery)',
    topic: 'When will I receive my order?',
    topicBn: 'কখন অর্ডার পাব / কতক্ষণ লাগবে?',
    keywords: ['when receive order', 'delivery time', 'koto shomoy lagbe', 'kokhon pabo', 'কতক্ষণ লাগবে'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার অর্ডারের জন্য ধন্যবাদ।\n\nআমরা সর্বদা চেষ্টা করি অর্ডারটি যেদিন করা হয়, সেদিনই ডেলিভারি সম্পন্ন করতে। তবে কোনো অপারেশনাল বা অনিবার্য কারণে একই দিনে ডেলিভারি সম্ভব না হলে, সাধারণত পরবর্তী ২ দিনের মধ্যে আপনার অর্ডারটি ডেলিভারি করা হয়।\nআপনার ধৈর্য ও সহযোগিতার জন্য আন্তরিক ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your order.\n\nWe always try to deliver orders on the same day they are placed. However, if same-day delivery is not possible due to operational reasons, your order will usually be delivered within the next 2 days.\nWe appreciate your patience and understanding.'
  },
  {
    id: 'faq-8-havent-received-order-yet',
    category: 'অর্ডার ও ডেলিভারি (Order & Delivery)',
    topic: "I haven't received my order yet.",
    topicBn: 'এখনও অর্ডার ডেলিভারি পাইনি',
    keywords: ['not received', 'paini', 'order paini', 'late delivery', 'এখনও পাইনি'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার অসুবিধার জন্য আন্তরিকভাবে দুঃখিত।\n\nঅনুগ্রহ করে আপনার Order ID আমাদের সাথে শেয়ার করুন। আমরা আপনার অর্ডারের বর্তমান অবস্থা যাচাই করে যত দ্রুত সম্ভব আপনাকে জানাব।\n\nধন্যবাদ।',
    englishReply: "Dear Valued Customer,\n\nWe sincerely apologize for the delay.\n\nKindly share your Order ID so that we can check the status of your order and update you accordingly.\nThank you."
  },
  {
    id: 'faq-9-product-available-yes',
    category: 'পণ্য প্রাপ্যতা ও স্টক (Stock & Availability)',
    topic: 'Is this product available? YES',
    topicBn: 'পণ্যটি স্টকে আছে (হ্যাঁ)',
    keywords: ['is available', 'ache ki', 'পণ্যটি কি আছে', 'stock ache'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।\n\nজি, পণ্যটি বর্তমানে উপলব্ধ রয়েছে।\n\nঅর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট ব্যবহার করুন অথবা সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত ১৬৫৫৬ নম্বরে যোগাযোগ করুন।\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nYes, this product is currently available.\n\nYou may place your order at your convenience.\nThank you.'
  },
  {
    id: 'faq-10-product-available-no',
    category: 'পণ্য প্রাপ্যতা ও স্টক (Stock & Availability)',
    topic: 'Is this product available? NO',
    topicBn: 'পণ্যটি বর্তমানে নেই (না)',
    keywords: ['unavailable', 'nai', 'nei', 'পণ্যটি নেই'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।\n\nআন্তরিকভাবে দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই। পণ্যটি পুনরায় উপলব্ধ হলে আমাদের অফিসিয়াল পেজে জানানো হবে।\nআপনার ধৈর্য ও বোঝাপড়ার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nWe sincerely apologize, but this product is currently unavailable.\n\nThank you for your understanding.'
  },
  {
    id: 'faq-11-facebook-order',
    category: 'অর্ডার ও ডেলিভারি (Order & Delivery)',
    topic: 'Facebook-এ অর্ডার',
    topicBn: 'ফেসবুকে কি সরাসরি অর্ডার নেওয়া হয়?',
    keywords: ['facebook order', 'fb order', 'ফেসবুকে অর্ডার', 'inbox order'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।\n\nআন্তরিকভাবে দুঃখিত, বর্তমানে ফেসবুকের মাধ্যমে অর্ডার গ্রহণ করা হয় না।\n\nঅর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইটে ভিজিট করুন:\nhttps://igloobd.com/\n\nএছাড়াও, অর্ডার করতে অথবা এ-সংক্রান্ত যেকোনো সহায়তার জন্য সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত ১৬৫৫৬ নম্বরে যোগাযোগ করুন।\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest.\n\nWe sincerely apologize, but we do not accept orders through Facebook.\n\nKindly place your order through our website:\nhttps://igloobd.com/\n\nOr call us at 16556 (9:00 AM – 6:00 PM).\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-12-offers-available-no',
    category: 'অফার ও পেমেন্ট (Offers & Payment)',
    topic: 'Is there any offer available now? NO',
    topicBn: 'বর্তমানে কোনো অফার চলছে কি না (না)',
    keywords: ['any offer', 'ongoing offer', 'কোন অফার আছে', 'offer ache'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার আগ্রহের জন্য ধন্যবাদ।\n\nআন্তরিকভাবে দুঃখিত, বর্তমানে আমাদের কোনো প্রোডাক্টে অফার চলছে না।\nনতুন অফার ও প্রচারণার আপডেট পেতে অনুগ্রহ করে আমাদের অফিসিয়াল ফেসবুক পেজের সাথেই থাকুন।\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest.\n\nWe sincerely apologize, but there are currently no ongoing offers or promotions on our products.\nPlease stay connected with our official ফেসবুক page for updates on future offers and promotions.\nThank you.'
  },
  {
    id: 'faq-13-product-offer-no',
    category: 'অফার ও পেমেন্ট (Offers & Payment)',
    topic: 'এই প্রোডাক্টে কি কোনো অফার আছে? NO',
    topicBn: 'নির্দিষ্ট পণ্যে কোনো অফার নেই',
    keywords: ['offer on this product no', 'ei product e offer ache'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।\n\nদুঃখিত, বর্তমানে এই পণ্যে কোনো অফার চলছে না।\n\nভবিষ্যতের অফার ও প্রোমোশন সম্পর্কে জানতে ইগলুর সাথেই থাকুন।\n\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest.\n\nWe sincerely apologize, but there is currently no offer available on this product.\nPlease stay connected with Igloo for future offers and promotions.\nThank you.'
  },
  {
    id: 'faq-14-product-offer-yes',
    category: 'অফার ও পেমেন্ট (Offers & Payment)',
    topic: 'এই প্রোডাক্টে কি কোনো অফার আছে? YES',
    topicBn: 'নির্দিষ্ট পণ্যে অফার চলমান (হ্যাঁ)',
    keywords: ['offer on this product yes', 'special offer'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।\n\nজি, বর্তমানে এই পণ্যে একটি বিশেষ অফার চলছে।\n\nঅর্ডার করতে আমাদের ওয়েবসাইট ভিজিট করুন অথবা সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত ১৬৫৫৬ নম্বরে কল করুন।\n\nইগলুর সঙ্গে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest.\n\nYes, this product is currently available with a special offer.\n\nKindly place your order through our website or call 16556 (9:00 AM – 6:00 PM) to enjoy the offer.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-15-coupon',
    category: 'অফার ও পেমেন্ট (Offers & Payment)',
    topic: 'coupon',
    topicBn: 'ডিসকাউন্ট কুপন বা প্রোমোকোড',
    keywords: ['coupon', 'promo code', 'discount code', 'কুপন', 'ভাউচার', 'first order coupon'],
    banglaReply: 'দুঃখিত স্যার/ম্যাম, বর্তমানে প্রথম অর্ডারের জন্য কোনো কুপন বা বিশেষ ডিসকাউন্ট অফার নেই। নতুন কোনো অফার বা প্রোমোশন এলে আমাদের পেজে জানানো হবে। ধন্যবাদ।',
    englishReply: "Dear Sir/Ma'am,\n\nWe apologize, but there is currently no coupon or special discount available for first-time orders.\n\nThank you for your interest and understanding."
  },
  {
    id: 'faq-16-i-want-dealership',
    category: 'ডিলারশিপ ও ফ্রিজ (Dealer & Freezer)',
    topic: 'I want dealership.',
    topicBn: 'ডিলারশিপ নিতে চাই (প্রথম ধাপ)',
    keywords: ['want dealership', 'dealer hote chai', 'ডিলারশিপ নিতে চাই', 'agency'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলু ডিলার হওয়ার আগ্রহ প্রকাশ করার জন্য আপনাকে ধন্যবাদ।\n\nঅনুগ্রহ করে আপনার এলাকার নাম (জেলা/শহর) আমাদের জানান। আমরা আপনার লোকেশন অনুযায়ী প্রয়োজনীয় তথ্য ও পরবর্তী করণীয় সম্পর্কে আপনাকে জানাব।\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest in becoming an Igloo dealer.\n\nKindly share your location, and we will guide you further regarding dealership opportunities.\nThank you.'
  },
  {
    id: 'faq-17-dealership-rsm',
    category: 'ডিলারশিপ ও ফ্রিজ (Dealer & Freezer)',
    topic: 'Dealership',
    topicBn: 'ডিলারশিপ ও আরএসএম (RSM) যোগাযোগ',
    keywords: ['dealership rsm', 'rsm contact', 'ডিলারশিপ যোগাযোগ'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার আগ্রহের জন্য ধন্যবাদ।\n\nএ বিষয়ে বিস্তারিত সহায়তার জন্য অনুগ্রহ করে আপনার এলাকার Regional Sales Manager (RSM)-এর সঙ্গে যোগাযোগ করুন।\n\nইগলুর সাথে থাকার জন্য আপনাকে ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest.\n\nFor further assistance, we kindly request you to contact our Regional Sales Manager for your area.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-18-dealership-number-off',
    category: 'ডিলারশিপ ও ফ্রিজ (Dealer & Freezer)',
    topic: 'Dealership/number off/not received',
    topicBn: 'প্রদত্ত নম্বরে যোগাযোগ করা না গেলে',
    keywords: ['number off', 'not received', 'phone dhore na', 'যোগাযোগ করা যাচ্ছে না'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nঅসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।\n\nঅনুগ্রহ করে কিছুক্ষণ পর পুনরায় যোগাযোগ করার চেষ্টা করুন। যদি তখনও যোগাযোগ করতে সমস্যা হয়, তাহলে আমাদের জানান। আমরা বিকল্প যোগাযোগের তথ্য দিয়ে আপনাকে সহায়তা করব।\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nWe sincerely apologize for the inconvenience.\n\nKindly try contacting the number again after some time. If you are still unable to reach them, please let us know. We will be happy to provide you with an alternative contact number.\nThank you.'
  },
  {
    id: 'faq-19-complaint-staff-service',
    category: 'অভিযোগ ও কোয়ালিটি (Quality & Issues)',
    topic: 'Complaint about staff/service.',
    topicBn: 'সার্ভিস বা স্টাফ সংক্রান্ত অভিযোগ',
    keywords: ['staff complaint', 'bad service', 'খারাপ ব্যবহার', 'অভিযোগ', 'service problem'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার অসন্তোষজনক অভিজ্ঞতার জন্য আমরা আন্তরিকভাবে দুঃখিত। আমরা বুঝতে পারছি যে এই বিষয়টি আপনার জন্য হতাশাজনক ছিল, এবং আপনার প্রত্যাশা পূরণ করতে না পারায় আমরা আন্তরিকভাবে ক্ষমাপ্রার্থী।\n\nবিষয়টি আমাদের নজরে আনার জন্য আপনাকে ধন্যবাদ। আপনার মতামত আমাদের কাছে অত্যন্ত মূল্যবান। আমরা আপনার অভিযোগটি সংশ্লিষ্ট টিমের কাছে পর্যালোচনা ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য পাঠিয়ে দেব, যাতে ভবিষ্যতে আরও উন্নত সেবা নিশ্চিত করা যায়।\n\nআপনার ধৈর্য এবং ইগলুর প্রতি আস্থার জন্য আন্তরিক ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nWe sincerely apologize for the inconvenience and for the experience you had. We truly regret that we were unable to meet your expectations.\n\nThank you for bringing this matter to our attention. Your feedback is very important to us, and we will share it with the concerned team for review and necessary action to help improve our service.\nWe sincerely appreciate your patience, understanding, and continued support.'
  },
  {
    id: 'faq-20-thank-you-got-parcel',
    category: 'ফেসবুক কমেন্ট ও প্রশংসা (Comments & Feedback)',
    topic: 'Thank you / Got my parcel',
    topicBn: 'পার্সেল পেয়েছি / ধন্যবাদ মেসেজ',
    keywords: ['got parcel', 'received order', 'পেয়েছি', 'thank you igloo', 'ধন্যবাদ ইগলু'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনি আপনার অর্ডারটি পেয়েছেন জেনে আমরা আনন্দিত।\n\nআশা করি, ইগলুর আইসক্রিম আপনার প্রত্যাশা পূরণ করবে। আপনার ভালোবাসা ও আস্থার জন্য আন্তরিক ধন্যবাদ। ভবিষ্যতেও আপনাকে সেবা দেওয়ার সুযোগ পেলে আমরা আনন্দিত হব।\nধন্যবাদ।',
    englishReply: "Dear Valued Customer,\n\nWe're delighted to know that you have received your order.\n\nWe hope you enjoy your Igloo ice cream. Thank you for choosing Igloo, and we look forward to serving you again."
  },
  {
    id: 'faq-21-freezer-request-1',
    category: 'ডিলারশিপ ও ফ্রিজ (Dealer & Freezer)',
    topic: '"ফ্রিজ চাই",',
    topicBn: 'দোকানের জন্য ফ্রিজ চাই (১ম রিপ্লাই)',
    keywords: ['friz chai', 'freezer lagbe', 'deep freezer', 'দোকানের জন্য ফ্রিজ', 'freezer request'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার আগ্রহের জন্য ধন্যবাদ।\n\nআন্তরিকভাবে দুঃখিত, বর্তমানে নতুনভাবে ফ্রিজ প্রদান কার্যক্রম বন্ধ রয়েছে।\n\nতবে অনুগ্রহ করে আপনার পূর্ণ নাম, মোবাইল নম্বর এবং দোকানের সম্পূর্ণ ঠিকানা আমাদের ইনবক্সে শেয়ার করুন। প্রাপ্যতা সাপেক্ষে আমাদের সংশ্লিষ্ট টিম আপনার সাথে যোগাযোগ করবে।\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest.\n\nWe sincerely apologize, but new freezer allocations are currently unavailable.\n\nKindly share your full name, phone number, and complete shop address in our inbox. Subject to availability, our concerned team will contact you.\nThank you.'
  },
  {
    id: 'faq-22-freezer-request-2',
    category: 'ডিলারশিপ ও ফ্রিজ (Dealer & Freezer)',
    topic: '"ফ্রিজ চাই", 2nd replay',
    topicBn: 'ফ্রিজ রিকোয়েস্টের ২য় রিপ্লাই (তথ্য পাওয়ার পর)',
    keywords: ['freezer 2nd reply', 'friz info given', 'তথ্য সেলস টিমে পাঠানো'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার ধৈর্যের জন্য ধন্যবাদ।\n\nআপনার তথ্য ইতোমধ্যে আমাদের সেলস টিমের সঙ্গে শেয়ার করা হয়েছে। প্রাপ্যতা সাপেক্ষে সংশ্লিষ্ট প্রতিনিধি আপনার সঙ্গে যোগাযোগ করবেন।\n\nইগলুর সঙ্গে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your patience.\n\nYour information has already been shared with our Sales Team. The concerned representative will contact you, subject to availability.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-23-greeting-hi-hello',
    category: 'সাধারণ ও সহায়তা (General & Support)',
    topic: 'যদি কিছু না বলে /"Hi", "Hello",',
    topicBn: 'গ্রিটিংস বা হাই/হ্যালো মেসেজ',
    keywords: ['hi', 'hello', 'হাই', 'হ্যালো', 'salam', 'সালাম', 'hey'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nদয়া করে বলবেন, কীভাবে আপনাকে সহযোগিতা করতে পারি? আপনার প্রশ্ন বা প্রয়োজনটি জানালে আমরা সর্বোচ্চ চেষ্টা করব আপনাকে সহায়তা করার।\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nKindly let us know how we may assist you. Please share your query, and we will be happy to help.\n\nThank you.'
  },
  {
    id: 'faq-24-sponsorship-proposal',
    category: 'সাধারণ ও সহায়তা (General & Support)',
    topic: 'Sponsorship Proposal',
    topicBn: 'স্পন্সরশিপ বা ইভেন্ট প্রপোজাল',
    keywords: ['sponsorship', 'sponsor', 'proposal', 'event', 'স্পন্সর', 'মার্কেটিং টিম'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর সঙ্গে কাজ করার আগ্রহ প্রকাশ করার জন্য আপনাকে ধন্যবাদ।\n\nঅনুগ্রহ করে আপনার প্রস্তাবনা আমাদের Marketing Team-এর ইমেইল ঠিকানায় পাঠান:\n\n[marketing.igloo@amlbd.com]\n\nআপনার প্রস্তাবনা আমাদের প্রয়োজনের সঙ্গে সামঞ্জস্যপূর্ণ হলে, আমাদের টিম আপনার প্রদত্ত ইমেইল ঠিকানা অথবা মোবাইল নম্বরে যোগাযোগ করবে।\n\nআপনার আগ্রহ ও সহযোগিতার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your interest in collaborating with Igloo.\n\nKindly send your proposal to our Marketing Team at [marketing.igloo@amlbd.com]\n\nIf your proposal aligns with our requirements, our team will contact you using the email address or phone number provided in your proposal.\nThank you for your interest and consideration.'
  },
  {
    id: 'faq-25-why-payment-link-came',
    category: 'অফার ও পেমেন্ট (Offers & Payment)',
    topic: 'Why did the payment link come up?',
    topicBn: 'এসএমএস-এ পেমেন্ট লিংক কেন এল?',
    keywords: ['payment link', 'sms link', 'পেমেন্ট লিংক', 'অনলাইন পেমেন্ট'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার সুবিধার জন্য এই এসএমএসটি পাঠানো হয়েছে।\n\nআপনি যদি অনলাইনে পেমেন্ট করতে চান, তাহলে এসএমএসে দেওয়া পেমেন্ট লিংকটি ব্যবহার করতে পারেন।\n\nঅন্যথায়, এসএমএসটি উপেক্ষা করলেও কোনো সমস্যা নেই। আপনার অর্ডারটি ক্যাশ অন ডেলিভারি (Cash on Delivery)-এর মাধ্যমে ডেলিভারি করা হবে।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThis SMS has been sent as an option for your convenience.\n\nIf you would like to make your payment online, you may use the payment link provided in the SMS.\n\nOtherwise, you may simply ignore the message, and your order will be delivered with the Cash on Delivery payment option.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-26-order-placed-no-call',
    category: 'অর্ডার ও ডেলিভারি (Order & Delivery)',
    topic: 'অর্ডার করেছি কিন্তু কোন কল পাইনি',
    topicBn: 'অর্ডারের পর কনফার্মেশন কল না পেলে',
    keywords: ['no call', 'call paini', 'অর্ডার কল পাইনি', 'order confirmation call'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার অর্ডারের জন্য ধন্যবাদ।\n\nআপনার অর্ডার নিশ্চিত করার জন্য আমাদের একজন প্রতিনিধি শীঘ্রই ১৬৫৫৬ নম্বর থেকে আপনার সঙ্গে যোগাযোগ করবেন।\nঅনুগ্রহ করে কলটি রিসিভ করবেন, যাতে আমরা আপনার অর্ডারটি প্রক্রিয়া করতে পারি।\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your order.\n\nOne of our representatives will contact you shortly from 16556 to confirm your order.\nKindly receive the call so that we can proceed with your order.\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-27-melted-complaint',
    category: 'অভিযোগ ও কোয়ালিটি (Quality & Issues)',
    topic: 'My ice cream is always melted',
    topicBn: 'আইসক্রিম গলে যাওয়া বা কোয়ালিটি কমপ্লেইন্ট',
    keywords: ['melted', 'gole geche', 'গলে গেছে', 'নষ্ট আইসক্রিম', 'damaged ice cream', 'defect'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার অভিজ্ঞতার জন্য আমরা আন্তরিকভাবে দুঃখিত।\n\nবিষয়টি আমাদের নজরে আনার জন্য ধন্যবাদ। অনুগ্রহ করে বিষয়টি যাচাই করার জন্য আমাদের ইনবক্সে নিচের তথ্যগুলো শেয়ার করুন:\n\n• পণ্যের নাম\n• ব্যাচ নম্বর\n• MFG ও EXP তারিখ\n• কোথা থেকে পণ্যটি কিনেছেন\n• পণ্য ও প্যাকেজিংয়ের পরিষ্কার ছবি\n\nতথ্যগুলো পাওয়ার পর আমরা বিষয়টি সংশ্লিষ্ট টিমের কাছে তদন্তের জন্য পাঠাব এবং প্রয়োজনীয় সহায়তা প্রদান করব।\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nWe sincerely apologize for the experience you have had.\n\nThank you for bringing this matter to our attention. We take your feedback very seriously and would like to investigate the issue.\n\nKindly share the following details with us in our inbox:\n\n• Product name\n• Batch number\n• MFG & EXP date\n• Place of purchase\n• A clear photo of the product and its packaging\n\nOnce we receive the details, we will forward the matter to our concerned team for further investigation and assist you accordingly.\nThank you for your patience and understanding.'
  },
  {
    id: 'faq-28-sandwich-discontinued',
    category: 'পণ্য প্রাপ্যতা ও স্টক (Stock & Availability)',
    topic: 'Sandwich',
    topicBn: 'আইসক্রিম স্যান্ডউইচ (বন্ধ হওয়া পণ্য)',
    keywords: ['sandwich', 'ice cream sandwich', 'স্যান্ডউইচ', 'sandwich ice cream'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআইসক্রিম স্যান্ডউইচের প্রতি আপনার আগ্রহ ও ভালোবাসার জন্য ধন্যবাদ।\n\nআন্তরিকভাবে দুঃখিত, পণ্যটি বর্তমানে ডিসকন্টিনিউ করা হয়েছে এবং এটি পুনরায় চালু করার কোনো পরিকল্পনা নেই।\n\nআপনার মতামত ও সহযোগিতার জন্য আন্তরিক ধন্যবাদ। ইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your love and interest in our Ice Cream Sandwich.\n\nWe sincerely apologize, but this product has been discontinued and there are currently no plans to bring it back.\n\nWe truly appreciate your feedback and support. Thank you for choosing Igloo.'
  },

  // 2. Facebook Comment Replies
  {
    id: 'faq-29-fb-yummy',
    category: 'ফেসবুক কমেন্ট ও প্রশংসা (Comments & Feedback)',
    topic: '😍 Yummy! /ইয়ামি! / দারুণ লাগছে! / মজার লাগছে!',
    topicBn: 'প্রশংসাসূচক মন্তব্য / ইয়ামি কমেন্ট',
    keywords: ['yummy', 'ইয়ামি', 'দারুণ', 'মজার লাগছে', 'looks great', 'tasty'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার সুন্দর মন্তব্য ও ভালোবাসার জন্য আন্তরিক ধন্যবাদ।\nইগলুর প্রতি আপনার ভালোবাসা জেনে আমরা সত্যিই আনন্দিত। আশা করি, ইগলুর প্রতিটি স্কুপ আপনার মুহূর্তগুলোকে আরও আনন্দময় করে তুলবে।\nইগলুর সাথে থাকার জন্য আন্তরিক ধন্যবাদ।',
    englishReply: "Dear Valued Customer,\n\nThank you so much for your lovely comment.\nWe're delighted to know you like it. We hope you enjoy every scoop of Igloo.\nThank you for choosing Igloo."
  },
  {
    id: 'faq-30-fb-looks-delicious',
    category: 'ফেসবুক কমেন্ট ও প্রশংসা (Comments & Feedback)',
    topic: 'Looks delicious! / দেখতে খুবই মজার লাগছে।',
    topicBn: 'দেখতে চমৎকার ও লোভনীয় কমেন্ট',
    keywords: ['looks delicious', 'দেখতে মজার', 'লোভনীয়', 'delicious'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার সুন্দর মন্তব্যের জন্য ধন্যবাদ।\nআশা করি, খুব শিগগিরই আপনি আপনার প্রিয় ইগলু আইসক্রিম উপভোগ করবেন।\nধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your kind comment.\nWe hope you get to enjoy your favorite Igloo ice cream very soon.\nThank you.'
  },
  {
    id: 'faq-31-fb-love-igloo',
    category: 'ফেসবুক কমেন্ট ও প্রশংসা (Comments & Feedback)',
    topic: 'I love Igloo/ইগলু আমার অনেক পছন্দ।',
    topicBn: 'ইগলুর প্রতি ভালোবাসা ও প্রশংসা',
    keywords: ['love igloo', 'ইগলু অনেক পছন্দ', 'i love igloo', 'favorite brand'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুর প্রতি আপনার ভালোবাসা ও সমর্থনের জন্য আন্তরিক ধন্যবাদ। আপনার ভালোবাসাই আমাদের আরও ভালো সেবা দিতে অনুপ্রাণিত করে। ইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your love and support.\nYour appreciation inspires us to serve you even better.\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-32-fb-my-favorite',
    category: 'ফেসবুক কমেন্ট ও প্রশংসা (Comments & Feedback)',
    topic: 'My favorite ice cream./আমার সবচেয়ে পছন্দের আইসক্রিম।',
    topicBn: 'প্রিয় আইসক্রিম মন্তব্য',
    keywords: ['favorite ice cream', 'পছন্দের আইসক্রিম', 'সবচেয়ে পছন্দ'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nইগলুকে আপনার প্রিয় আইসক্রিম হিসেবে বেছে নেওয়ার জন্য আন্তরিক ধন্যবাদ।\nআপনার ভালোবাসা ও সমর্থন আমাদের কাছে অত্যন্ত মূল্যবান।',
    englishReply: 'Dear Valued Customer,\n\nThank you for making Igloo your favorite.\nYour support means a lot to us.'
  },
  {
    id: 'faq-33-fb-price-feedback',
    category: 'ফেসবুক কমেন্ট ও প্রশংসা (Comments & Feedback)',
    topic: 'Please reduce the price/দাম অনেক বেশি।',
    topicBn: 'মূল্য বেশি হওয়া সংক্রান্ত মতামত',
    keywords: ['reduce price', 'dam beshi', 'দাম বেশি', 'price high', 'kom koren'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nআপনার মূল্যবান মতামতের জন্য আন্তরিক ধন্যবাদ।\n\nপণ্যের মূল্য সম্পর্কে আপনার পরামর্শের জন্য আমরা কৃতজ্ঞ। আপনার মতামত ভবিষ্যৎ বিবেচনার জন্য আমাদের সংশ্লিষ্ট টিমের সঙ্গে শেয়ার করা হবে।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThank you for your valuable feedback.\n\nWe truly appreciate your suggestion regarding the pricing. Your feedback will be shared with our concerned team for future consideration.\n\nThank you for choosing Igloo.'
  },

  // 3. Product FAQ — Mango Layers
  {
    id: 'faq-34-mango-layers-desc',
    category: 'ম্যাংগো লেয়ারস ও কম্বো (Mango Layers)',
    topic: "What is Mango Layers? / 'Mango Layers' আইসক্রিমটা কেমন?",
    topicBn: 'ম্যাংগো লেয়ারস আইসক্রিম কেমন ও বিবরণ',
    keywords: ['what is mango layers', 'ম্যাংগো লেয়ারস কেমন', 'mango layers details'],
    banglaReply: 'প্রিয় গ্রাহক,\n\n"ম্যাংগো লেয়ারস" হলো একটি সুস্বাদু ফ্রোজেন ফ্রুট ডেজার্ট। এতে রয়েছে আসল আমের পাল্প এবং দারুণ স্বাদের ম্যাংগো ফ্লেভারড আইসক্রিমের এক পারফেক্ট কম্বিনেশন।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\n"Mango Layers" is a delicious double-layered frozen fruit dessert. It perfectly combines the irresistible taste of real Mango Pulp with smooth Mango-Flavored Ice Cream.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-35-mango-layers-real-mango',
    category: 'ম্যাংগো লেয়ারস ও কম্বো (Mango Layers)',
    topic: 'Is real mango used? / এতে কি আসল আম দেওয়া হয়েছে?',
    topicBn: 'আসল আমের পাল্প ব্যবহার করা হয়েছে কি না',
    keywords: ['real mango in layers', 'আসল আম', 'mango pulp'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nজি! এতে অথেনটিক ফ্রুট ইনফিউশন বা আসল আমের পাল্প ব্যবহার করা হয়েছে। এটি আপনাকে খাঁটি আমের দারুণ স্বাদ দেবে।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nYes! It is crafted with an authentic fruit infusion, giving you the rich taste of real mango pulp.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-36-mango-layers-4-layer',
    category: 'ম্যাংগো লেয়ারস ও কম্বো (Mango Layers)',
    topic: 'What does 4-layer mean? / ৪-লেয়ার বলতে কী বোঝানো হয়েছে?',
    topicBn: '৪-লেয়ার স্ট্রাকচার বলতে কী বোঝায়',
    keywords: ['4 layer', '4-layer', '৪ লেয়ার', '৪-লেয়ার'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nএটি একটি ইউনিক ৪-লেয়ারের ডেজার্ট। এতে রয়েছে ২টি রিচ ম্যাংগো পাল্পের লেয়ার এবং ২টি ক্রিমি আইসক্রিমের লেয়ার।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nIt features a unique 4-layer architecture consisting of 2 layers of rich mango pulp and 2 layers of creamy ice cream.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-37-mango-layers-price-order',
    category: 'ম্যাংগো লেয়ারস ও কম্বো (Mango Layers)',
    topic: 'Price & Order / দাম কত এবং কীভাবে অর্ডার করবো? (Mango Layers)',
    topicBn: 'ম্যাংগো লেয়ারসের দাম (৩৯০ টাকা) ও অর্ডার নিয়ম',
    keywords: ['mango layers price', 'mango layers 900ml', 'ম্যাংগো লেয়ারস দাম', 'layers price'],
    banglaReply: 'প্রিয় গ্রাহক,\n\n৯০০ মিলি ম্যাংগো লেয়ারস আইসক্রিমের মূল্য ৩৯০ টাকা।\n\nঅর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট https://igloobd.com/product-details/mango-layers ভিজিট করুন অথবা ১৬৫৫৬ বা ০৯৬ ১০১ ১৬৫৫৬ নম্বরে কল করুন। আমাদের কাস্টমার সার্ভিস সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত খোলা থাকে।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThe price of 900 ML Mango Layers Ice Cream is BDT 390.\n\nTo place an order, please visit our website at https://igloobd.com/product-details/mango-layers or call us at 16556 or 096 101 16556. Our customer service hours are from 9:00 AM to 6:00 PM.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-38-combo-1030',
    category: 'ম্যাংগো লেয়ারস ও কম্বো (Mango Layers)',
    topic: 'Mango Layers, Mango Fusion & Zero Vanilla Combo',
    topicBn: 'ম্যাংগো লেয়ারস, ফিউশন ও জিরো ভ্যানিলা কম্বো (১০৩০ টাকা)',
    keywords: ['combo 1030', 'mango layers fusion zero combo', '১০৩০ কম্বো', 'triple combo'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nম্যাংগো লেয়ারস, ম্যাংগো ফিউশন এবং জিরো ভ্যানিলা কম্বোটির মূল্য ১০৩০ টাকা।\n\nঅর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট https://igloobd.com/product-details/mango-layers-mango-fusion-zero-vanilla-combo ভিজিট করুন অথবা ১৬৫৫৬ বা ০৯৬ ১০১ ১৬৫৫৬ নম্বরে কল করুন। আমাদের কাস্টমার সার্ভিস সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত খোলা থাকে।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThe price of the Mango Layers, Mango Fusion & Zero Vanilla Combo is BDT 1030.\n\nTo place an order, please visit our website at https://igloobd.com/product-details/mango-layers-mango-fusion-zero-vanilla-combo or call us at 16556 or 096 101 16556. Our customer service hours are from 9:00 AM to 6:00 PM.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-39-combo-780',
    category: 'ম্যাংগো লেয়ারস ও কম্বো (Mango Layers)',
    topic: 'Mango Layers & Mango Fusion combo',
    topicBn: 'ম্যাংগো লেয়ারস ও ম্যাংগো ফিউশন কম্বো (৭৮০ টাকা)',
    keywords: ['combo 780', 'mango layers and fusion combo', '৭৮০ কম্বো', 'double mango combo'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nম্যাংগো লেয়ারস এবং ম্যাংগো ফিউশন কম্বোটির মূল্য ৭৮০ টাকা।\n\nঅর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট https://igloobd.com/product-details/mango-layers-mango-fusion-combo ভিজিট করুন অথবা ১৬৫৫৬ বা ০৯৬ ১০১ ১৬৫৫৬ নম্বরে কল করুন। আমাদের কাস্টমার সার্ভিস সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত খোলা থাকে।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThe price of the Mango Layers & Mango Fusion Combo is BDT 780.\n\nTo place an order, please visit our website at https://igloobd.com/product-details/mango-layers-mango-fusion-combo or call us at 16556 or 096 101 16556. Our customer service hours are from 9:00 AM to 6:00 PM.\n\nThank you for choosing Igloo.'
  },

  // 4. Product FAQ — Mango Fusion
  {
    id: 'faq-40-mango-fusion-desc',
    category: 'ম্যাংগো ফিউশন (Mango Fusion)',
    topic: "What is Mango Fusion? / 'Mango Fusion' আইসক্রিমটা কেমন?",
    topicBn: 'ম্যাংগো ফিউশন কেমন ও বিবরণ',
    keywords: ['what is mango fusion', 'ম্যাংগো ফিউশন কেমন', 'mango fusion details'],
    banglaReply: 'প্রিয় গ্রাহক,\n\n"ম্যাংগো ফিউশন" হলো একটি সুস্বাদু ফ্রোজেন ফ্রুট ডেজার্ট। এতে রয়েছে ৪০% আসল আমের ব্লেন্ড এবং দারুণ স্বাদের ম্যাংগো মিক্স, যা আপনাকে দেবে আল্ট্রা-ক্রিমি টেক্সচার।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\n"Mango Fusion" is a deliciously crafted frozen fruit dessert. It brings together a 40% authentic mango blend with a flavorful mango mix for an ultra-creamy texture.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-41-mango-fusion-real-mango',
    category: 'ম্যাংগো ফিউশন (Mango Fusion)',
    topic: 'Is real mango used in Fusion? / এতে কি আসল আম দেওয়া হয়েছে?',
    topicBn: 'ফিউশনে ৪০% আসল আম ব্যবহার',
    keywords: ['real mango fusion', '40% mango', '৪০% আসল আম'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nজি! এতে ৪০% আসল আম ব্যবহার করা হয়েছে, যা আপনাকে দেবে খাঁটি ট্রপিকাল ফলের দারুণ রিচনেস।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nYes! It features 40% real mango, giving you high-potency authentic tropical fruit richness.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-42-mango-fusion-price-order',
    category: 'ম্যাংগো ফিউশন (Mango Fusion)',
    topic: 'Price & Order / দাম কত এবং কীভাবে অর্ডার করবো? (Mango Fusion)',
    topicBn: 'ম্যাংগো ফিউশনের দাম (৩৯০ টাকা) ও অর্ডার',
    keywords: ['mango fusion price', 'fusion price', 'ম্যাংগো ফিউশন দাম', 'fusion 900ml'],
    banglaReply: 'প্রিয় গ্রাহক,\n\n৯০০ মিলি ম্যাংগো ফিউশন আইসক্রিমের মূল্য ৩৯০ টাকা।\n\nঅর্ডার করতে অনুগ্রহ করে আমাদের ওয়েবসাইট https://igloobd.com/product-details/mango-fusion ভিজিট করুন অথবা ১৬৫৫৬ বা ০৯৬ ১০১ ১৬৫৫৬ নম্বরে কল করুন। আমাদের কাস্টমার সার্ভিস সকাল ৯:০০টা থেকে সন্ধ্যা ৬:০০টা পর্যন্ত খোলা থাকে।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nThe price of 900 ML Mango Fusion is BDT 390.\n\nTo place an order, please visit our website at https://igloobd.com/product-details/mango-fusion or call us at 16556 or 096 101 16556. Our customer service hours are from 9:00 AM to 6:00 PM.\n\nThank you for choosing Igloo.'
  },
  {
    id: 'faq-43-mango-fusion-speciality',
    category: 'ম্যাংগো ফিউশন (Mango Fusion)',
    topic: 'What is special about it? / এর বিশেষত্ব কী?',
    topicBn: 'ম্যাংগো ফিউশনের বিশেষত্ব ও ভেলভেটি ফিনিশ',
    keywords: ['special about fusion', 'connoisseur choice', 'ফিউশনের বিশেষত্ব'],
    banglaReply: 'প্রিয় গ্রাহক,\n\nএটি প্যাশনেট ম্যাংগো লাভারদের জন্য স্পেশালি তৈরি করা হয়েছে, যা মুখে দিলেই মিলিয়ে যাওয়ার মতো ভেলভেটি ফিনিশ এবং আল্ট্রা-স্মুথ ক্রিমি টেক্সচার দেবে।\n\nইগলুর সাথে থাকার জন্য ধন্যবাদ।',
    englishReply: 'Dear Valued Customer,\n\nIt is the ultimate "Connoisseur Choice," created specifically for passionate mango lovers, delivering a velvety finish and ultra-smooth creamy mouthfeel.\n\nThank you for choosing Igloo.'
  },

  // 5. Product FAQ — Zero (Sugar-Conscious Frozen Dessert)
  {
    id: 'faq-45-zero-sugar-free',
    category: 'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
    topic: "Is it completely sugar-free? / Does 'Zero' mean it contains absolutely zero sugar?",
    topicBn: 'জিরো কি পুরোপুরি চিনিমুক্ত?',
    keywords: ['completely sugar free', 'zero sugar', 'সম্পূর্ণ চিনিমুক্ত', 'sugar free ice cream'],
    banglaReply: 'প্রিয় গ্রাহক, না। সাধারণ পণ্যের মতো এতে টেবিল সুগার (সুক্রোজ) এবং গ্লুকোজ নেই। তবে, দুধের উপাদান থাকায় এতে প্রাকৃতিকভাবে থাকা দুধের চিনি (ল্যাকটোজ) রয়েছে। ধন্যবাদ।',
    englishReply: 'Dear Customer, No. It is free from table sugar (sucrose) and glucose compared with regular products. However, natural sugar such as lactose from milk solids is present as a component of milk. Thank you.'
  },
  {
    id: 'faq-46-zero-palm-oil',
    category: 'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
    topic: 'Does this product contain palm oil?',
    topicBn: 'জিরোতে কি পাম অয়েল আছে?',
    keywords: ['palm oil', 'contain palm oil', 'পাম তেল', 'পাম অয়েল'],
    banglaReply: 'প্রিয় গ্রাহক, না। এতে মিল্ক ফ্যাট এবং কোকোনাট অয়েল রয়েছে, যা মিডিয়াম-চেইন ফ্যাটি এসিডের একটি উৎস। ধন্যবাদ।',
    englishReply: 'Dear Customer, No. It contains milk fat and coconut oil, which is a source of medium-chain fatty acids. Thank you.'
  },
  {
    id: 'faq-47-zero-diabetes',
    category: 'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
    topic: 'Is it suitable for people with diabetes?',
    topicBn: 'ডায়াবেটিস রোগীদের জন্য কি উপযুক্ত?',
    keywords: ['diabetes', 'diabetic patient', 'ডায়াবেটিস', 'ডায়াবেটিক রোগী'],
    banglaReply: 'প্রিয় গ্রাহক, না। এটি শুধুমাত্র চিনি সম্পর্কে সচেতন (sugar-conscious) গ্রাহকদের জন্য উপযুক্ত। ধন্যবাদ।',
    englishReply: 'Dear Customer, No. It is suitable only for sugar-conscious consumers. Thank you.'
  },
  {
    id: 'faq-48-zero-frozen-dessert-vs-ice-cream',
    category: 'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
    topic: 'What is the difference between ice cream and a frozen dessert? / Why is it categorized as a frozen dessert?',
    topicBn: 'আইসক্রিম এবং ফ্রোজেন ডেজার্টের পার্থক্য কী?',
    keywords: ['frozen dessert vs ice cream', 'difference between ice cream and frozen dessert', 'ফ্রোজেন ডেজার্ট'],
    banglaReply: 'প্রিয় গ্রাহক, বিডিএস (BDS) স্ট্যান্ডার্ড অনুযায়ী আইসক্রিমে সর্বোচ্চ ১৬% চিনি থাকতে হয়। কিন্তু এই পণ্যে চিনি যোগ করার বদলে সুগার রিপ্লেসার ব্যবহার করা হয়েছে, তাই একে ফ্রোজেন ডেজার্ট হিসেবে তালিকাভুক্ত করা হয়েছে। ধন্যবাদ।',
    englishReply: 'Dear Customer, Ice cream is characterized according to BDS standards, including a maximum sugar content of 16%. However, in this product, sugar replacers are used instead of added sugar, so it is categorized as a Frozen Dessert. Thank you.'
  },
  {
    id: 'faq-49-zero-calories-500ml',
    category: 'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
    topic: 'How many calories are there in a 500 ml tub?',
    topicBn: '৫০০ মিলি টবে কত ক্যালরি রয়েছে?',
    keywords: ['how many calories 500ml', '500ml calories', '৫০০ মিলি ক্যালরি', '496 kcal'],
    banglaReply: 'প্রিয় গ্রাহক, এই পণ্যটিতে প্রতি ১০০ গ্রামে ১৬৭ কিলোক্যালরি রয়েছে, যা একটি ৫০০ মিলি বক্সে প্রায় ৪৯৬ কিলোক্যালরির সমান। ধন্যবাদ।',
    englishReply: 'Dear Customer, The product provides 167 kcal per 100 g, equivalent to approximately 496 kcal per 500 ml tub. Thank you.'
  },
  {
    id: 'faq-50-zero-calorie-comparison',
    category: 'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
    topic: 'How does the calorie count compare to regular Igloo Vanilla ice cream?',
    topicBn: 'রেগুলার ভ্যানিলার সাথে ক্যালরির তুলনা',
    keywords: ['calorie comparison', 'compare with vanilla', 'ক্যালরির তুলনা'],
    banglaReply: 'প্রিয় গ্রাহক, জিরো ফ্রোজেন ডেজার্টে প্রতি ১০০ গ্রামে ১৬৭.১৬ কিলোক্যালরি রয়েছে, যেখানে রেগুলার ভ্যানিলা আইসক্রিমে প্রতি ১০০ গ্রামে ১৯৮.৩৪ কিলোক্যালরি থাকে (যা লেবেলে উল্লেখ করা আছে)। ধন্যবাদ।',
    englishReply: 'Dear Customer, Zero Frozen Dessert contains 167.16 kcal per 100 g, whereas regular Vanilla Ice Cream contains 198.34 kcal per 100 g, as mentioned on the respective product labels. Thank you.'
  },
  {
    id: 'faq-51-zero-sweetener-used',
    category: 'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
    topic: 'What kind of sweetener is used in this product?',
    topicBn: 'কী ধরনের সুইটেনার বা মিষ্টি উপাদান ব্যবহার করা হয়েছে?',
    keywords: ['sweetener', 'steviol', 'erythritol', 'সুইটেনার', 'মিষ্টির উপাদান'],
    banglaReply: 'প্রিয় গ্রাহক, এই পণ্যটিতে উদ্ভিদ থেকে তৈরি ফুড-গ্রেড স্টিভিওল (Steviol), এবং এর সাথে পলিওল (এরিথ্রিটল) ও মাল্টোডেক্সট্রিন ব্যবহার করা হয়েছে। ধন্যবাদ।',
    englishReply: 'Dear Customer, The product uses plant-derived, food-grade Steviol, in combination with polyol (Erythritol) and Maltodextrin as a bulking agent. Thank you.'
  },
  {
    id: 'faq-52-zero-contains-dairy',
    category: 'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
    topic: 'Does it contain dairy?',
    topicBn: 'এতে কি ডেইরি বা দুধের উপাদান আছে?',
    keywords: ['contain dairy', 'milk solids', 'ডেইরি উপাদান', 'দুধের উপাদান'],
    banglaReply: 'প্রিয় গ্রাহক, হ্যাঁ। এতে ডেইরি উপাদান হিসেবে মিল্ক সলিড রয়েছে, যার মধ্যে মিল্ক ফ্যাট এবং মিল্ক সলিড নন-ফ্যাট অন্তর্ভুক্ত। ধন্যবাদ।',
    englishReply: 'Dear Customer, Yes. It contains milk solids, including milk fat and milk solid non-fat, as dairy ingredients. Thank you.'
  },
  {
    id: 'faq-53-zero-ingredients',
    category: 'জিরো ফ্রোজেন ডেজার্ট (Zero Sugar)',
    topic: "What are the ingredients used in the 'Zero' product?",
    topicBn: 'জিরো পণ্যের উপাদানসমূহ কী কী?',
    keywords: ['ingredients used in zero', 'zero ingredients', 'জিরো উপাদানসমূহ'],
    banglaReply: 'প্রিয় গ্রাহক, লেবেলে উল্লেখিত উপাদানগুলোর মধ্যে রয়েছে ট্রিটেড পানি, মিল্ক সলিড, কোকোনাট অয়েল, চিনির বিকল্প (স্টিভিওল এবং এরিথ্রিটল), মাল্টোডেক্সট্রিন, ইমালসিফায়ার, স্টেবিলাইজার এবং অনুমোদিত ফুড-গ্রেড কালার ও ফ্লেভার। ধন্যবাদ।',
    englishReply: 'Dear Customer, The ingredients mentioned on the label include treated water, milk solids, coconut oil, sugar alternatives (Steviol and Erythritol), Maltodextrin, emulsifier and stabilizer, and permitted food-grade color and flavor. Thank you.'
  }
];
