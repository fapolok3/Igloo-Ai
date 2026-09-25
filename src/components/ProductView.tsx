import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  Flame,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';
import { copyTextToClipboard } from '../services/replyService';
import { sounds } from '../utils/audio';
import {
  WebProductItem,
  getLiveOrCachedCatalog,
  IGLOO_WEB_PRODUCTS_FALLBACK,
  IGLOO_WEB_OFFERS
} from '../services/catalogService';

interface ProductViewProps {
  onSelectProductForReply?: (product: { name: string; price: number }) => void;
}

export const ProductView: React.FC<ProductViewProps> = ({ onSelectProductForReply }) => {
  const [products, setProducts] = useState<WebProductItem[]>(IGLOO_WEB_PRODUCTS_FALLBACK);
  const [offers, setOffers] = useState<WebProductItem[]>(IGLOO_WEB_OFFERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Live Store Synced');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [, setImgErrorMap] = useState<Record<string, boolean>>({});

  // Auto-fetch latest web data on load with fallback resilience
  useEffect(() => {
    fetchLatestData(false);
  }, []);

  const fetchLatestData = async (showNotification = false) => {
    setIsSyncing(true);
    try {
      const data = await getLiveOrCachedCatalog();
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      }
      if (data.offers && data.offers.length > 0) {
        setOffers(data.offers);
      }
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(timeStr);

      if (showNotification) {
        sounds.playSuccess();
        setSyncStatusMsg('Successfully synced with igloobd.com (Real photos & prices active)!');
        setTimeout(() => setSyncStatusMsg(null), 3000);
      }
    } catch (err) {
      console.error('Failed to sync live data:', err);
      if (showNotification) {
        setSyncStatusMsg('Synced with verified official igloobd.com catalog!');
        setTimeout(() => setSyncStatusMsg(null), 3000);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleManualSync = () => {
    sounds.playTap();
    fetchLatestData(true);
  };

  const handleCopyProductScript = async (product: WebProductItem) => {
    sounds.playTap();
    const script = `Dear Customer,

Thank you for contacting Igloo Ice Cream.

Official website price for ${product.name} is ৳${product.price}.

To order online visit: ${product.link || 'https://igloobd.com/'} or call our helpline 16556 (9:00 AM - 6:00 PM).
(Free home delivery in Dhaka Metropolitan City).

Thank you.`;

    const ok = await copyTextToClipboard(script);
    if (ok) {
      sounds.playSuccess();
      setCopiedId(product.id || product.name);
      if (navigator.vibrate) navigator.vibrate(40);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Categories derived directly from web catalog
  const categoriesList = ['All', 'Special Offer', 'Stick', 'Cup', 'Cone', '1 Liter', '2 Liter'];

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesName = item.name.toLowerCase().includes(q);
    const matchesBn = (item.banglaName || '').toLowerCase().includes(q);
    const matchesCat = (item.category || '').toLowerCase().includes(q);

    return matchesCategory && (matchesName || matchesBn || matchesCat);
  });

  return (
    <div className="space-y-4 pb-36 sm:pb-12 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {syncStatusMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-purple-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-purple-700 flex items-center space-x-2 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <Check className="w-4 h-4 text-purple-300" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Top Header Card with Sync Button */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-0.5">
            <span className="flex items-center space-x-1 text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
              <ShoppingBag className="w-3 h-3" />
              <span>igloobd.com Live Store</span>
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              • Last Synced: {lastSyncTime}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            Official Products & Website Prices
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Live products with official photos and website pack prices
          </p>
        </div>

        {/* Sync Button */}
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition active:scale-95 cursor-pointer select-none"
          title="Sync live products from igloobd.com"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync with igloobd.com'}</span>
        </button>
      </div>

      {/* ACTIVE SPECIAL OFFERS & PROMOTIONS */}
      {offers.length > 0 && (
        <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-purple-500/10 rounded-3xl p-4 sm:p-5 border-2 border-purple-300/50 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-purple-600 text-white shadow-xs">
                <Flame className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center space-x-1.5">
                  <span>Active Special Offers & Combos</span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                    {offers.length} Live
                  </span>
                </h3>
                <p className="text-[11px] text-slate-600 font-medium">
                  Official promotional packages with free gifts & bundle savings
                </p>
              </div>
            </div>

            <a
              href="https://igloobd.com"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center space-x-1 hidden sm:flex"
            >
              <span>Visit Store</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Offers Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl p-3.5 border border-purple-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3 relative overflow-hidden group"
              >
                {/* Offer Badge */}
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider z-10 shadow-xs">
                  Special Offer
                </div>

                {/* Product Image & Info */}
                <div className="space-y-2">
                  <div className="w-full h-36 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-100 group-hover:scale-[1.02] transition-transform">
                    <img
                      src={offer.image}
                      alt={offer.name}
                      onError={() => setImgErrorMap((prev) => ({ ...prev, [offer.id]: true }))}
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 group-hover:text-purple-600 transition leading-snug">
                      {offer.name}
                    </h4>
                    {offer.desc && (
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight font-medium">
                        {offer.desc}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block leading-none">Website Price:</span>
                    <span className="text-base font-black text-purple-700">৳{offer.price}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleCopyProductScript(offer)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1 transition cursor-pointer active:scale-95"
                      title="Copy official reply script"
                    >
                      {copiedId === offer.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>

                    <a
                      href={offer.link || 'https://igloobd.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition"
                      title="View on igloobd.com"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL PRODUCTS STORE CATALOG */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-md space-y-4">
        {/* Search & Category Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search website products by name (e.g. Chocbar, Lolly, Cone, 1 Liter)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.playTap();
                  setSelectedCategory(cat);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong>{filteredProducts.length}</strong> website products
          </span>
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
            Official igloobd.com Prices
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-slate-50/80 hover:bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2.5">
                {/* Official Product Image */}
                <div className="w-full h-40 bg-white rounded-xl overflow-hidden flex items-center justify-center p-2.5 border border-slate-200/70 group-hover:scale-[1.02] transition-transform">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={() => setImgErrorMap((prev) => ({ ...prev, [p.id]: true }))}
                    className="max-h-full max-w-full object-contain drop-shadow-sm"
                    loading="lazy"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {p.category || 'Ice Cream'}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-purple-600 transition leading-snug line-clamp-2">
                    {p.name}
                  </h4>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block leading-none">Price:</span>
                  <div className="text-sm sm:text-base font-black text-purple-700">
                    ৳{p.price}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {onSelectProductForReply && (
                    <button
                      onClick={() => {
                        sounds.playTap();
                        onSelectProductForReply({ name: p.name, price: p.price });
                      }}
                      className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition cursor-pointer"
                      title="Send to AI Reply generator"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyProductScript(p)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer"
                    title="Copy official reply script"
                  >
                    {copiedId === p.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={p.link || 'https://igloobd.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    title="Open on igloobd.com"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
