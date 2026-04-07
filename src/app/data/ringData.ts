export interface CatalogRing {
  id: number;
  category: string;
  style: string;
  metal: string;
  stone: string;
  budget_range: string;
  gender: string;
  personality: string;
  occasion: string;
  design: string;
  image_url: string;
}

// ─── INR price display ────────────────────────────────────────────────────────
export const BUDGET_INR: Record<string, string> = {
  '0-5k':     '₹0 – ₹5,000',
  '5k-10k':   '₹5,000 – ₹10,000',
  '10k-20k':  '₹10,000 – ₹20,000',
  '10k-50k':  '₹10,000 – ₹50,000',
  '20k-50k':  '₹20,000 – ₹50,000',
  '50k-150k': '₹50,000 – ₹1,50,000',
  '150k+':    '₹1,50,000+',
};

// ─── Real Unsplash images mapped by ring style ────────────────────────────────
const STYLE_IMG: Record<string, string> = {
  'Solitaire':    'https://images.unsplash.com/photo-1763256614634-7feb3ff79ff3?w=480&q=80&fm=jpg&fit=crop',
  'Halo':         'https://images.unsplash.com/photo-1766910699521-eab05158a2a1?w=480&q=80&fm=jpg&fit=crop',
  'Three Stone':  'https://images.unsplash.com/photo-1763256614634-7feb3ff79ff3?w=480&q=80&fm=jpg&fit=crop',
  'Vintage':      'https://images.unsplash.com/photo-1774110101478-bb066db7ccf0?w=480&q=80&fm=jpg&fit=crop',
  'Band':         'https://images.unsplash.com/photo-1738800076744-c37b80b37d31?w=480&q=80&fm=jpg&fit=crop',
  'Stackable':    'https://images.unsplash.com/photo-1774504347325-85faf377dcf1?w=480&q=80&fm=jpg&fit=crop',
  'Cocktail':     'https://images.unsplash.com/photo-1774504347325-85faf377dcf1?w=480&q=80&fm=jpg&fit=crop',
  'Signet':       'https://images.unsplash.com/photo-1738800076744-c37b80b37d31?w=480&q=80&fm=jpg&fit=crop',
  'Knuckle':      'https://images.unsplash.com/photo-1774110101478-bb066db7ccf0?w=480&q=80&fm=jpg&fit=crop',
};

function cdnUrl(_id: number, style: string, _metal: string): string {
  return STYLE_IMG[style] ?? STYLE_IMG['Band'];
}

function img(style: string, _stone: string): string {
  return STYLE_IMG[style] ?? STYLE_IMG['Band'];
}

// ─── 60-ring catalog ──────────────────────────────────────────────────────────
export const RING_CATALOG: CatalogRing[] = [
  { id: 1,  category: 'Engagement', style: 'Solitaire',   metal: 'Gold',      stone: 'Diamond',  budget_range: '50k-150k', gender: 'Female', personality: 'Classic',  occasion: 'Proposal',   design: 'Minimal Elegant',   image_url: cdnUrl(1, 'Solitaire', 'Gold')  },
  { id: 2,  category: 'Engagement', style: 'Halo',        metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Proposal',   design: 'Premium Detailed',  image_url: cdnUrl(2, 'Halo', 'Platinum')  },
  { id: 3,  category: 'Wedding',    style: 'Band',        metal: 'Gold',      stone: 'None',     budget_range: '20k-50k',  gender: 'Male',   personality: 'Classic',  occasion: 'Marriage',   design: 'Simple Smooth',     image_url: cdnUrl(3, 'Band', 'Gold')     },
  { id: 4,  category: 'Casual',     style: 'Stackable',   metal: 'Silver',    stone: 'None',     budget_range: '0-5k',     gender: 'Female', personality: 'Trendy',   occasion: 'Daily Wear', design: 'Minimal Modern',    image_url: cdnUrl(4, 'Stackable', 'Silver')     },
  { id: 5,  category: 'Luxury',     style: 'Three Stone', metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Wedding',    design: 'Premium Royal',     image_url: cdnUrl(5, 'Three Stone', 'Platinum')  },
  { id: 6,  category: 'Statement',  style: 'Signet',      metal: 'Gold',      stone: 'Gemstone', budget_range: '10k-50k',  gender: 'Male',   personality: 'Bold',     occasion: 'Party',      design: 'Heavy Unique',      image_url: img('Signet',      'Gemstone') },
  { id: 7,  category: 'Casual',     style: 'Band',        metal: 'Silver',    stone: 'None',     budget_range: '0-5k',     gender: 'Unisex', personality: 'Minimal',  occasion: 'Daily Wear', design: 'Plain',             image_url: img('Band',        'None')     },
  { id: 8,  category: 'Engagement', style: 'Vintage',     metal: 'Rose Gold', stone: 'Diamond',  budget_range: '50k-150k', gender: 'Female', personality: 'Romantic', occasion: 'Proposal',   design: 'Antique',           image_url: img('Vintage',     'Diamond')  },
  { id: 9,  category: 'Luxury',     style: 'Halo',        metal: 'Gold',      stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Wedding',    design: 'Intricate',         image_url: img('Halo',        'Diamond')  },
  { id: 10, category: 'Casual',     style: 'Stackable',   metal: 'Rose Gold', stone: 'Gemstone', budget_range: '5k-10k',   gender: 'Female', personality: 'Trendy',   occasion: 'Daily Wear', design: 'Colorful',          image_url: img('Stackable',   'Gemstone') },
  { id: 11, category: 'Engagement', style: 'Solitaire',   metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Classic',  occasion: 'Proposal',   design: 'Luxury Minimal',    image_url: img('Solitaire',   'Diamond')  },
  { id: 12, category: 'Wedding',    style: 'Band',        metal: 'Platinum',  stone: 'None',     budget_range: '50k-150k', gender: 'Male',   personality: 'Modern',   occasion: 'Marriage',   design: 'Matte Finish',      image_url: img('Band',        'None')     },
  { id: 13, category: 'Casual',     style: 'Knuckle',     metal: 'Silver',    stone: 'None',     budget_range: '0-5k',     gender: 'Female', personality: 'Trendy',   occasion: 'Daily Wear', design: 'Slim',              image_url: img('Knuckle',     'None')     },
  { id: 14, category: 'Statement',  style: 'Cocktail',    metal: 'Gold',      stone: 'Gemstone', budget_range: '20k-50k',  gender: 'Female', personality: 'Bold',     occasion: 'Party',      design: 'Large Centerpiece', image_url: img('Cocktail',    'Gemstone') },
  { id: 15, category: 'Luxury',     style: 'Three Stone', metal: 'Gold',      stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Wedding',    design: 'Brilliant Cut',     image_url: img('Three Stone', 'Diamond')  },
  { id: 16, category: 'Casual',     style: 'Band',        metal: 'Titanium',  stone: 'None',     budget_range: '5k-10k',   gender: 'Male',   personality: 'Minimal',  occasion: 'Daily Wear', design: 'Matte',             image_url: img('Band',        'None')     },
  { id: 17, category: 'Engagement', style: 'Halo',        metal: 'Rose Gold', stone: 'Diamond',  budget_range: '50k-150k', gender: 'Female', personality: 'Romantic', occasion: 'Proposal',   design: 'Floral',            image_url: img('Halo',        'Diamond')  },
  { id: 18, category: 'Statement',  style: 'Signet',      metal: 'Silver',    stone: 'Gemstone', budget_range: '5k-10k',   gender: 'Male',   personality: 'Bold',     occasion: 'Party',      design: 'Engraved',          image_url: img('Signet',      'Gemstone') },
  { id: 19, category: 'Casual',     style: 'Stackable',   metal: 'Gold',      stone: 'None',     budget_range: '10k-20k',  gender: 'Female', personality: 'Minimal',  occasion: 'Daily Wear', design: 'Thin Bands',        image_url: img('Stackable',   'None')     },
  { id: 20, category: 'Luxury',     style: 'Vintage',     metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Classic',  occasion: 'Wedding',    design: 'Antique Inspired',  image_url: img('Vintage',     'Diamond')  },
  { id: 21, category: 'Engagement', style: 'Solitaire',   metal: 'Gold',      stone: 'Diamond',  budget_range: '20k-50k',  gender: 'Female', personality: 'Simple',   occasion: 'Proposal',   design: 'Budget Elegant',    image_url: img('Solitaire',   'Diamond')  },
  { id: 22, category: 'Casual',     style: 'Band',        metal: 'Silver',    stone: 'Gemstone', budget_range: '5k-10k',   gender: 'Female', personality: 'Trendy',   occasion: 'Daily Wear', design: 'Colored Stones',    image_url: img('Band',        'Gemstone') },
  { id: 23, category: 'Statement',  style: 'Cocktail',    metal: 'Rose Gold', stone: 'Gemstone', budget_range: '10k-50k',  gender: 'Female', personality: 'Bold',     occasion: 'Party',      design: 'Artistic',          image_url: img('Cocktail',    'Gemstone') },
  { id: 24, category: 'Luxury',     style: 'Halo',        metal: 'Gold',      stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Wedding',    design: 'Double Halo',       image_url: img('Halo',        'Diamond')  },
  { id: 25, category: 'Wedding',    style: 'Band',        metal: 'Gold',      stone: 'Diamond',  budget_range: '50k-150k', gender: 'Unisex', personality: 'Classic',  occasion: 'Marriage',   design: 'Diamond Band',      image_url: img('Band',        'Diamond')  },
  { id: 26, category: 'Casual',     style: 'Knuckle',     metal: 'Gold',      stone: 'None',     budget_range: '5k-10k',   gender: 'Female', personality: 'Trendy',   occasion: 'Daily Wear', design: 'Minimal',           image_url: img('Knuckle',     'None')     },
  { id: 27, category: 'Engagement', style: 'Three Stone', metal: 'Gold',      stone: 'Diamond',  budget_range: '50k-150k', gender: 'Female', personality: 'Elegant',  occasion: 'Proposal',   design: 'Balanced',          image_url: img('Three Stone', 'Diamond')  },
  { id: 28, category: 'Statement',  style: 'Signet',      metal: 'Platinum',  stone: 'None',     budget_range: '50k-150k', gender: 'Male',   personality: 'Bold',     occasion: 'Formal',     design: 'Luxury Signet',     image_url: img('Signet',      'None')     },
  { id: 29, category: 'Casual',     style: 'Stackable',   metal: 'Silver',    stone: 'Gemstone', budget_range: '0-5k',     gender: 'Female', personality: 'Trendy',   occasion: 'Daily Wear', design: 'Layered',           image_url: img('Stackable',   'Gemstone') },
  { id: 30, category: 'Luxury',     style: 'Vintage',     metal: 'Gold',      stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Classic',  occasion: 'Wedding',    design: 'Heritage',          image_url: img('Vintage',     'Diamond')  },
  { id: 31, category: 'Engagement', style: 'Halo',        metal: 'Gold',      stone: 'Diamond',  budget_range: '50k-150k', gender: 'Female', personality: 'Elegant',  occasion: 'Proposal',   design: 'Shiny',             image_url: img('Halo',        'Diamond')  },
  { id: 32, category: 'Casual',     style: 'Band',        metal: 'Steel',     stone: 'None',     budget_range: '0-5k',     gender: 'Male',   personality: 'Minimal',  occasion: 'Daily Wear', design: 'Industrial',        image_url: img('Band',        'None')     },
  { id: 33, category: 'Statement',  style: 'Cocktail',    metal: 'Gold',      stone: 'Gemstone', budget_range: '20k-50k',  gender: 'Female', personality: 'Bold',     occasion: 'Party',      design: 'Oversized',         image_url: img('Cocktail',    'Gemstone') },
  { id: 34, category: 'Luxury',     style: 'Solitaire',   metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Wedding',    design: 'Premium Cut',       image_url: img('Solitaire',   'Diamond')  },
  { id: 35, category: 'Wedding',    style: 'Band',        metal: 'Rose Gold', stone: 'Diamond',  budget_range: '50k-150k', gender: 'Unisex', personality: 'Modern',   occasion: 'Marriage',   design: 'Diamond Line',      image_url: img('Band',        'Diamond')  },
  { id: 36, category: 'Casual',     style: 'Stackable',   metal: 'Silver',    stone: 'None',     budget_range: '0-5k',     gender: 'Female', personality: 'Minimal',  occasion: 'Daily Wear', design: 'Clean',             image_url: img('Stackable',   'None')     },
  { id: 37, category: 'Engagement', style: 'Vintage',     metal: 'Gold',      stone: 'Diamond',  budget_range: '50k-150k', gender: 'Female', personality: 'Romantic', occasion: 'Proposal',   design: 'Floral Antique',    image_url: img('Vintage',     'Diamond')  },
  { id: 38, category: 'Statement',  style: 'Signet',      metal: 'Gold',      stone: 'None',     budget_range: '20k-50k',  gender: 'Male',   personality: 'Bold',     occasion: 'Formal',     design: 'Classic Signet',    image_url: img('Signet',      'None')     },
  { id: 39, category: 'Luxury',     style: 'Three Stone', metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Wedding',    design: 'Triple Sparkle',    image_url: img('Three Stone', 'Diamond')  },
  { id: 40, category: 'Casual',     style: 'Band',        metal: 'Silver',    stone: 'None',     budget_range: '0-5k',     gender: 'Unisex', personality: 'Minimal',  occasion: 'Daily Wear', design: 'Plain Smooth',      image_url: img('Band',        'None')     },
  { id: 41, category: 'Engagement', style: 'Solitaire',   metal: 'Rose Gold', stone: 'Diamond',  budget_range: '50k-150k', gender: 'Female', personality: 'Romantic', occasion: 'Proposal',   design: 'Soft Shine',        image_url: img('Solitaire',   'Diamond')  },
  { id: 42, category: 'Casual',     style: 'Stackable',   metal: 'Gold',      stone: 'Gemstone', budget_range: '10k-20k',  gender: 'Female', personality: 'Trendy',   occasion: 'Daily Wear', design: 'Bright',            image_url: img('Stackable',   'Gemstone') },
  { id: 43, category: 'Luxury',     style: 'Halo',        metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Wedding',    design: 'Full Halo',         image_url: img('Halo',        'Diamond')  },
  { id: 44, category: 'Statement',  style: 'Cocktail',    metal: 'Silver',    stone: 'Gemstone', budget_range: '5k-10k',   gender: 'Female', personality: 'Bold',     occasion: 'Party',      design: 'Art',               image_url: img('Cocktail',    'Gemstone') },
  { id: 45, category: 'Wedding',    style: 'Band',        metal: 'Gold',      stone: 'None',     budget_range: '20k-50k',  gender: 'Male',   personality: 'Classic',  occasion: 'Marriage',   design: 'Smooth Finish',     image_url: img('Band',        'None')     },
  { id: 46, category: 'Casual',     style: 'Knuckle',     metal: 'Silver',    stone: 'None',     budget_range: '0-5k',     gender: 'Female', personality: 'Trendy',   occasion: 'Daily Wear', design: 'Thin',              image_url: img('Knuckle',     'None')     },
  { id: 47, category: 'Engagement', style: 'Three Stone', metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Proposal',   design: 'Luxury Trio',       image_url: img('Three Stone', 'Diamond')  },
  { id: 48, category: 'Statement',  style: 'Signet',      metal: 'Gold',      stone: 'Gemstone', budget_range: '20k-50k',  gender: 'Male',   personality: 'Bold',     occasion: 'Party',      design: 'Royal',             image_url: img('Signet',      'Gemstone') },
  { id: 49, category: 'Luxury',     style: 'Vintage',     metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Classic',  occasion: 'Wedding',    design: 'Ornate',            image_url: img('Vintage',     'Diamond')  },
  { id: 50, category: 'Casual',     style: 'Band',        metal: 'Steel',     stone: 'None',     budget_range: '0-5k',     gender: 'Male',   personality: 'Minimal',  occasion: 'Daily Wear', design: 'Matte Basic',       image_url: img('Band',        'None')     },
  { id: 51, category: 'Engagement', style: 'Halo',        metal: 'Gold',      stone: 'Diamond',  budget_range: '50k-150k', gender: 'Female', personality: 'Elegant',  occasion: 'Proposal',   design: 'Classic Halo',      image_url: img('Halo',        'Diamond')  },
  { id: 52, category: 'Casual',     style: 'Stackable',   metal: 'Rose Gold', stone: 'None',     budget_range: '5k-10k',   gender: 'Female', personality: 'Trendy',   occasion: 'Daily Wear', design: 'Layer Rings',       image_url: img('Stackable',   'None')     },
  { id: 53, category: 'Luxury',     style: 'Solitaire',   metal: 'Platinum',  stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Classic',  occasion: 'Wedding',    design: 'Timeless',          image_url: img('Solitaire',   'Diamond')  },
  { id: 54, category: 'Statement',  style: 'Cocktail',    metal: 'Gold',      stone: 'Gemstone', budget_range: '20k-50k',  gender: 'Female', personality: 'Bold',     occasion: 'Party',      design: 'Statement Piece',   image_url: img('Cocktail',    'Gemstone') },
  { id: 55, category: 'Wedding',    style: 'Band',        metal: 'Platinum',  stone: 'Diamond',  budget_range: '50k-150k', gender: 'Unisex', personality: 'Modern',   occasion: 'Marriage',   design: 'Diamond Edge',      image_url: img('Band',        'Diamond')  },
  { id: 56, category: 'Casual',     style: 'Band',        metal: 'Silver',    stone: 'None',     budget_range: '0-5k',     gender: 'Unisex', personality: 'Minimal',  occasion: 'Daily Wear', design: 'Smooth',            image_url: img('Band',        'None')     },
  { id: 57, category: 'Engagement', style: 'Vintage',     metal: 'Gold',      stone: 'Diamond',  budget_range: '50k-150k', gender: 'Female', personality: 'Romantic', occasion: 'Proposal',   design: 'Antique Floral',    image_url: img('Vintage',     'Diamond')  },
  { id: 58, category: 'Luxury',     style: 'Halo',        metal: 'Gold',      stone: 'Diamond',  budget_range: '150k+',    gender: 'Female', personality: 'Elegant',  occasion: 'Wedding',    design: 'Double Sparkle',    image_url: img('Halo',        'Diamond')  },
  { id: 59, category: 'Statement',  style: 'Signet',      metal: 'Silver',    stone: 'None',     budget_range: '5k-10k',   gender: 'Male',   personality: 'Bold',     occasion: 'Formal',     design: 'Flat Top',          image_url: img('Signet',      'None')     },
  { id: 60, category: 'Casual',     style: 'Stackable',   metal: 'Gold',      stone: 'None',     budget_range: '10k-20k',  gender: 'Female', personality: 'Minimal',  occasion: 'Daily Wear', design: 'Thin Stack',        image_url: img('Stackable',   'None')     },

  // ─── Real scraped products ────────────────────────────────────────────────
  { id: 61, category: 'Engagement', style: 'Band',        metal: 'Gold',      stone: 'Diamond',  budget_range: '50k-150k', gender: 'Male',   personality: 'Classic',  occasion: 'Engagement', design: 'Accented Lumen',    image_url: '/rings/accented-lumen-men-ring/image_01_diagonal.jpg' },
];

// ─── Enriched catalog (adds price, description, rating, reviews, tags) ────────

export interface EnrichedRing extends CatalogRing {
  price: number;
  description: string;
  rating: number;
  reviews: number;
  tags: string[];
}

const PRICE_MIDPOINTS: Record<string, number> = {
  '0-5k':     3200,
  '5k-10k':   7500,
  '10k-20k':  14500,
  '10k-50k':  28000,
  '20k-50k':  35000,
  '50k-150k': 88000,
  '150k+':    260000,
};

export const METAL_MULTIPLIER: Record<string, number> = {
  Gold: 1, 'Rose Gold': 1.05, 'White Gold': 1.1,
  Platinum: 1.25, Silver: 0.65, Titanium: 0.55, Steel: 0.4,
};

export const STONE_MULTIPLIER: Record<string, number> = {
  Diamond: 1.2, Gemstone: 1.12, Pearl: 1.06, None: 0.9,
};

export const CUSTOM_METALS = ['Gold', 'Rose Gold', 'White Gold', 'Platinum', 'Silver'] as const;
export const CUSTOM_STONES = ['Diamond', 'Sapphire', 'Ruby', 'Emerald', 'None'] as const;

const STONE_MULT_CUSTOM: Record<string, number> = {
  Diamond: 1.2, Sapphire: 1.14, Ruby: 1.14, Emerald: 1.1, None: 0.9,
};

export function customizedPrice(base: number, metal: string, stone: string): number {
  const m = METAL_MULTIPLIER[metal] ?? 1;
  const s = STONE_MULT_CUSTOM[stone] ?? 1;
  return Math.round(base * m * s);
}

const CATEGORY_TAGS: Record<string, string[]> = {
  Engagement: ['engagement', 'proposal'],
  Wedding:    ['wedding', 'bridal'],
  Casual:     ['everyday', 'casual'],
  Luxury:     ['luxury', 'premium'],
  Statement:  ['statement', 'party'],
};

const PERSONALITY_ADJ: Record<string, string> = {
  Classic: 'timeless classic', Elegant: 'elegantly crafted', Romantic: 'finely romantic',
  Trendy: 'on-trend', Bold: 'boldly designed', Minimal: 'minimalist',
  Modern: 'sleekly modern', Simple: 'understated', Vintage: 'vintage-inspired',
};

function ringDescription(r: CatalogRing): string {
  const adj = PERSONALITY_ADJ[r.personality] ?? 'beautifully crafted';
  const metal = r.metal.toLowerCase();
  const stone = r.stone !== 'None' ? ` with a brilliant ${r.stone.toLowerCase()}` : '';
  return `A ${adj} ${r.style.toLowerCase()} ring crafted in ${metal}${stone}. ${r.design} silhouette — ideal for ${r.occasion.toLowerCase()}.`;
}

// ─── Real product overrides (scraped data) ────────────────────────────────────
const REAL_PRODUCT_DATA: Record<number, Partial<EnrichedRing>> = {
  61: {
    description: 'Diamond flush-set into the grooved surface to provide an accented burst of light.',
    price: 88000,
    rating: 4.6,
    reviews: 84,
    tags: ['engagement', 'wedding', 'daily wear', 'gifting', 'self-gift'],
  },
};

export const ENRICHED_CATALOG: EnrichedRing[] = RING_CATALOG.map((ring) => {
  const base = PRICE_MIDPOINTS[ring.budget_range] ?? 15000;
  const price = Math.round(base * (1 + ((ring.id * 3) % 5) * 0.07));
  const ratingRaw = 3.7 + ((ring.id * 11) % 13) / 10;
  const enriched: EnrichedRing = {
    ...ring,
    price,
    description: ringDescription(ring),
    rating: Math.round(Math.min(5, ratingRaw) * 10) / 10,
    reviews: 12 + (ring.id * 19) % 170,
    tags: CATEGORY_TAGS[ring.category] ?? [],
  };
  // Apply real product overrides if available
  const overrides = REAL_PRODUCT_DATA[ring.id];
  if (overrides) Object.assign(enriched, overrides);
  return enriched;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const formatINR = (n: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const GALLERY_IMGS: Record<string, string[]> = {
  Solitaire:     [STYLE_IMG.Solitaire,    STYLE_IMG.Halo,         STYLE_IMG['Three Stone']],
  Halo:          [STYLE_IMG.Halo,         STYLE_IMG.Solitaire,    STYLE_IMG.Vintage],
  'Three Stone': [STYLE_IMG['Three Stone'],STYLE_IMG.Halo,        STYLE_IMG.Vintage],
  Vintage:       [STYLE_IMG.Vintage,      STYLE_IMG.Solitaire,    STYLE_IMG.Halo],
  Band:          [STYLE_IMG.Band,         STYLE_IMG.Stackable,    STYLE_IMG.Signet],
  Stackable:     [STYLE_IMG.Stackable,    STYLE_IMG.Band,         STYLE_IMG.Knuckle],
  Cocktail:      [STYLE_IMG.Cocktail,     STYLE_IMG.Vintage,      STYLE_IMG.Halo],
  Signet:        [STYLE_IMG.Signet,       STYLE_IMG.Band,         STYLE_IMG.Cocktail],
  Knuckle:       [STYLE_IMG.Knuckle,      STYLE_IMG.Stackable,    STYLE_IMG.Band],
};

// ─── Per-ring gallery overrides (real product images) ─────────────────────────
const RING_GALLERY: Record<number, string[]> = {
  61: [
    '/rings/accented-lumen-men-ring/image_01_diagonal.jpg',
    '/rings/accented-lumen-men-ring/image_02_top.jpg',
    '/rings/accented-lumen-men-ring/image_03_side.jpg',
    '/rings/accented-lumen-men-ring/image_04_side.jpg',
    '/rings/accented-lumen-men-ring/image_05_shank.jpg',
  ],
};

export function getProductGallery(ring: CatalogRing): string[] {
  return RING_GALLERY[ring.id] ?? GALLERY_IMGS[ring.style] ?? [ring.image_url, ring.image_url, ring.image_url];
}


