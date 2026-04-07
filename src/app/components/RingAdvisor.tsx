import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Sparkles, ChevronDown, RotateCcw } from 'lucide-react';
import { RING_CATALOG, BUDGET_INR, type CatalogRing } from '../data/ringData';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Prefs {
  purpose: string;
  style: string;
  budget: string;
  metal: string;
  stone: string;
  gender: string;
  band: string;
  sparkle: string;
  personality: string;
}

interface Ring {
  name: string;
  score: number;
  reasons: string[];
}

// ─── Form field config ────────────────────────────────────────────────────────
const FIELDS: {
  key: keyof Prefs;
  label: string;
  options: { label: string; value: string }[];
}[] = [
  {
    key: 'purpose',
    label: 'Purpose',
    options: [
      { label: 'Engagement', value: 'engagement' },
      { label: 'Wedding', value: 'wedding' },
      { label: 'Fashion / Daily Wear', value: 'daily' },
      { label: 'Gift', value: 'gift' },
      { label: 'Special Occasion', value: 'special' },
    ],
  },
  {
    key: 'style',
    label: 'Preferred Style',
    options: [
      { label: 'Classic / Timeless', value: 'classic' },
      { label: 'Modern / Minimalist', value: 'minimal' },
      { label: 'Vintage / Antique', value: 'vintage' },
      { label: 'Bold / Edgy', value: 'bold' },
      { label: 'Romantic', value: 'romantic' },
    ],
  },
  {
    key: 'budget',
    label: 'Budget (INR)',
    options: [
      { label: 'Under ₹5,000', value: 'under5k' },
      { label: '₹5,000 – ₹10,000', value: '5kto10k' },
      { label: '₹10,000 – ₹20,000', value: '10kto20k' },
      { label: '₹20,000 – ₹50,000', value: '20kto50k' },
      { label: '₹50,000 – ₹1,50,000', value: '50kto150k' },
      { label: '₹1,50,000+', value: 'above150k' },
    ],
  },
  {
    key: 'metal',
    label: 'Preferred Metal',
    options: [
      { label: 'Yellow Gold', value: 'gold' },
      { label: 'White Gold', value: 'whitegold' },
      { label: 'Rose Gold', value: 'rosegold' },
      { label: 'Silver', value: 'silver' },
      { label: 'Platinum', value: 'platinum' },
    ],
  },
  {
    key: 'stone',
    label: 'Preferred Stone',
    options: [
      { label: 'Diamond', value: 'diamond' },
      { label: 'Gemstone (Sapphire, Ruby…)', value: 'gemstone' },
      { label: 'Pearl', value: 'pearl' },
      { label: 'Mixed / Multiple Stones', value: 'mixed' },
      { label: 'No Stone', value: 'none' },
    ],
  },
  {
    key: 'gender',
    label: 'Gender',
    options: [
      { label: 'Female', value: 'female' },
      { label: 'Male', value: 'male' },
      { label: 'Unisex', value: 'unisex' },
    ],
  },
  {
    key: 'band',
    label: 'Band Thickness',
    options: [
      { label: 'Thin', value: 'thin' },
      { label: 'Medium', value: 'medium' },
      { label: 'Thick', value: 'thick' },
    ],
  },
  {
    key: 'sparkle',
    label: 'Sparkle Level',
    options: [
      { label: 'Low — subtle shine', value: 'low' },
      { label: 'Medium — refined sparkle', value: 'medium' },
      { label: 'High — brilliant flash', value: 'high' },
      { label: 'Maximum — blinding glam', value: 'max' },
    ],
  },
  {
    key: 'personality',
    label: 'Your Personality',
    options: [
      { label: 'Minimalist', value: 'minimalist' },
      { label: 'Romantic', value: 'romantic' },
      { label: 'Vintage Lover', value: 'vintage' },
      { label: 'Bold / Trendy', value: 'bold' },
      { label: 'Classic / Elegant', value: 'classic' },
    ],
  },
];

// ─── Recommendation engine ────────────────────────────────────────────────────
function computeRecommendations(prefs: Prefs): Ring[] {
  const { purpose, style, budget, stone, sparkle, personality, band } = prefs;

  const budgetTier = ({
    under5k:   0,
    '5kto10k': 1,
    '10kto20k':1,
    '20kto50k':2,
    '50kto150k':3,
    above150k: 4,
  } as Record<string, number>)[budget] ?? 2;

  const sr = (name: string, fn: () => [number, string[]]): Ring => {
    const [score, reasons] = fn();
    return { name, score, reasons: reasons.slice(0, 2) };
  };

  const rings: Ring[] = [
    sr('Solitaire', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'engagement') { s += 3; r.push('Classic, timeless choice for engagement'); }
      if (purpose === 'wedding')    { s += 1; }
      if (style === 'classic')  { s += 3; r.push('Perfectly suits your timeless aesthetic'); }
      if (style === 'romantic') { s += 2; r.push('Beautifully elegant and romantic'); }
      if (style === 'minimal')  { s += 1; r.push('Clean and refined minimalist profile'); }
      if (sparkle === 'medium') { s += 3; r.push('Understated brilliance suits your preference'); }
      if (sparkle === 'high')   { s += 1; }
      if (sparkle === 'low')    { s -= 1; }
      if (stone === 'diamond')  { s += 3; r.push('Showcases your diamond beautifully'); }
      if (stone === 'gemstone') { s += 1; r.push('Works elegantly with a coloured stone'); }
      if (stone === 'none')     { s -= 2; }
      if (band === 'thin')      { s += 2; r.push('Thin band elevates the centre stone'); }
      if (band === 'medium')    { s += 1; }
      if (personality === 'romantic')   { s += 3; r.push('Ideal for your romantic personality'); }
      if (personality === 'classic')    { s += 3; r.push('Matches your refined, classic elegance'); }
      if (personality === 'minimalist') { s += 1; r.push('Simple yet iconic — fits you well'); }
      if (budgetTier < 1)  { s -= 2; }
      if (budgetTier >= 2) { s += 1; }
      return [s, r];
    }),

    sr('Halo', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'engagement') { s += 3; r.push('Maximum sparkle for your engagement'); }
      if (purpose === 'special')    { s += 2; r.push('Show-stopping for special occasions'); }
      if (style === 'classic')  { s += 2; r.push('Timeless halo silhouette suits you'); }
      if (style === 'romantic') { s += 2; r.push('Luxuriously romantic design'); }
      if (style === 'bold')     { s += 1; }
      if (sparkle === 'high')   { s += 3; r.push('Delivers the brilliant sparkle you crave'); }
      if (sparkle === 'max')    { s += 2; r.push('Endless brilliance from every angle'); }
      if (sparkle === 'medium') { s += 1; }
      if (sparkle === 'low')    { s -= 2; }
      if (stone === 'diamond')  { s += 3; r.push('Halo diamonds amplify your centre stone'); }
      if (stone === 'gemstone') { s += 1; r.push('Gemstone centre beautifully framed'); }
      if (stone === 'none')     { s -= 3; }
      if (personality === 'romantic')   { s += 2; r.push('Suits your romantic, luxurious taste'); }
      if (personality === 'minimalist') { s -= 2; }
      if (budgetTier < 1)  { s -= 3; }
      if (budgetTier < 2)  { s -= 1; }
      if (budgetTier >= 3) { s += 2; r.push('Your budget supports premium craftsmanship'); }
      return [s, r];
    }),

    sr('Three-Stone', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'engagement') { s += 3; r.push('Symbolises past, present & future'); }
      if (purpose === 'wedding')    { s += 2; r.push('Beautiful symbolic wedding choice'); }
      if (style === 'classic')  { s += 2; r.push('Balanced, timeless design suits you'); }
      if (style === 'romantic') { s += 3; r.push('Deeply romantic and meaningful'); }
      if (style === 'vintage')  { s += 2; r.push('Echoes vintage charm beautifully'); }
      if (sparkle === 'medium') { s += 3; r.push('Triple stones balance sparkle perfectly'); }
      if (sparkle === 'high')   { s += 2; r.push('Trio creates satisfying brilliance'); }
      if (sparkle === 'low')    { s -= 1; }
      if (stone === 'diamond')  { s += 3; r.push('Triple diamonds radiate pure elegance'); }
      if (stone === 'gemstone') { s += 2; r.push('Gemstones add colour and deep meaning'); }
      if (stone === 'none')     { s -= 2; }
      if (personality === 'romantic') { s += 3; r.push('Matches your deeply romantic nature'); }
      if (personality === 'classic')  { s += 2; r.push('Timeless balance reflects your taste'); }
      if (budgetTier < 1)  { s -= 2; }
      if (budgetTier >= 2) { s += 1; }
      return [s, r];
    }),

    sr('Vintage / Filigree', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'engagement') { s += 2; r.push('Vintage rings feel deeply personal'); }
      if (purpose === 'special')    { s += 2; r.push('Unique antique flair for special moments'); }
      if (style === 'vintage')  { s += 3; r.push('Made for your antique aesthetic'); }
      if (style === 'romantic') { s += 2; r.push('Intricate romantic detailing'); }
      if (sparkle === 'medium') { s += 2; r.push('Filigree details add subtle shimmer'); }
      if (sparkle === 'low')    { s += 1; }
      if (stone === 'gemstone') { s += 3; r.push('Gemstones glow in vintage settings'); }
      if (stone === 'diamond')  { s += 2; r.push('Old-cut diamonds perfect for filigree'); }
      if (stone === 'pearl')    { s += 2; r.push('Pearls complement antique aesthetics beautifully'); }
      if (stone === 'none')     { s -= 1; }
      if (personality === 'vintage')    { s += 3; r.push('Tailor-made for your vintage soul'); }
      if (personality === 'romantic')   { s += 2; r.push('Romantic detailing mirrors your nature'); }
      if (personality === 'minimalist') { s -= 2; }
      if (budgetTier >= 1) { s += 1; }
      return [s, r];
    }),

    sr('Minimal Band', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'daily')   { s += 3; r.push('Perfect for everyday effortless wear'); }
      if (purpose === 'wedding') { s += 2; r.push('Sleek and modern for wedding bands'); }
      if (style === 'minimal')   { s += 3; r.push('The clean modern look you crave'); }
      if (style === 'classic')   { s += 1; }
      if (style === 'bold')      { s -= 1; }
      if (sparkle === 'low')    { s += 3; r.push('Subtle finish matches your preference'); }
      if (sparkle === 'medium') { s += 1; }
      if (sparkle === 'high')   { s -= 1; }
      if (sparkle === 'max')    { s -= 2; }
      if (stone === 'none')     { s += 3; r.push('Stone-free band is clean and modern'); }
      if (stone === 'diamond')  { s += 1; }
      if (stone === 'gemstone') { s -= 1; }
      if (band === 'thin')   { s += 2; r.push('Thin profile adds delicate elegance'); }
      if (band === 'medium') { s += 1; }
      if (band === 'thick')  { s -= 1; }
      if (personality === 'minimalist') { s += 3; r.push('Mirrors your minimalist lifestyle perfectly'); }
      if (personality === 'classic')    { s += 1; }
      if (personality === 'bold')       { s -= 2; }
      if (budgetTier === 0) { s += 2; r.push('Budget-friendly without compromising style'); }
      if (budgetTier >= 1)  { s += 1; }
      return [s, r];
    }),

    sr('Cluster', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'special') { s += 3; r.push('Dramatic multi-stone impact for events'); }
      if (purpose === 'gift')    { s += 2; r.push('Impressive and memorable gift choice'); }
      if (style === 'bold')    { s += 3; r.push('Bold clustered design suits your style'); }
      if (style === 'vintage') { s += 1; r.push('Cluster settings echo vintage glamour'); }
      if (sparkle === 'max')    { s += 3; r.push('Every stone catches light — maximum glam'); }
      if (sparkle === 'high')   { s += 3; r.push('Multiple stones deliver brilliant sparkle'); }
      if (sparkle === 'medium') { s += 1; }
      if (sparkle === 'low')    { s -= 2; }
      if (stone === 'diamond') { s += 3; r.push('Diamond clusters radiate pure brilliance'); }
      if (stone === 'gemstone') { s += 2; r.push('Mixed gemstones make a bold statement'); }
      if (stone === 'mixed')   { s += 3; r.push('Multi-stone setting is made for your taste'); }
      if (stone === 'none')    { s -= 3; }
      if (personality === 'bold')       { s += 3; r.push('Matches your bold, trendy personality'); }
      if (personality === 'minimalist') { s -= 3; }
      if (budgetTier < 1)  { s -= 2; }
      if (budgetTier >= 3) { s += 1; r.push('Premium budget unlocks stunning clusters'); }
      return [s, r];
    }),

    sr('Eternity Band', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'wedding')    { s += 3; r.push('Ultimate symbol of endless love'); }
      if (purpose === 'engagement') { s += 2; r.push('Continuous stones for a stunning proposal'); }
      if (style === 'romantic') { s += 3; r.push('Endlessly romantic continuous band'); }
      if (style === 'classic')  { s += 2; r.push('Timeless classic that never fades'); }
      if (sparkle === 'high')   { s += 3; r.push('High sparkle all the way around the band'); }
      if (sparkle === 'medium') { s += 2; r.push('Gentle continuous shimmer suits you'); }
      if (sparkle === 'max')    { s += 2; r.push('All-around brilliance for glam lovers'); }
      if (sparkle === 'low')    { s -= 1; }
      if (stone === 'diamond')  { s += 3; r.push('Continuous diamonds symbolise infinite love'); }
      if (stone === 'gemstone') { s += 1; }
      if (stone === 'none')     { s -= 3; }
      if (personality === 'romantic') { s += 3; r.push('Your romantic nature loves this symbolic ring'); }
      if (personality === 'classic')  { s += 2; r.push('Refined classic matches your elegance'); }
      if (budgetTier < 1)  { s -= 3; }
      if (budgetTier < 2)  { s -= 1; }
      if (budgetTier >= 3) { s += 2; r.push('Your budget fits a full eternity band beautifully'); }
      return [s, r];
    }),

    sr('Cocktail / Statement', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'special') { s += 3; r.push('Makes the ultimate statement at any event'); }
      if (purpose === 'gift')    { s += 2; r.push('An unforgettable and luxurious gift'); }
      if (style === 'bold')    { s += 3; r.push('Built for bold, confident personalities'); }
      if (style === 'vintage') { s += 1; r.push('Vintage cocktail rings have dramatic flair'); }
      if (style === 'minimal') { s -= 2; }
      if (sparkle === 'max')    { s += 3; r.push('Maximum sparkle — this ring was made for you'); }
      if (sparkle === 'high')   { s += 2; r.push('Dazzling high-sparkle suits your taste'); }
      if (sparkle === 'medium') { s -= 1; }
      if (sparkle === 'low')    { s -= 2; }
      if (stone === 'gemstone') { s += 3; r.push('Vibrant gemstones perfect for cocktail rings'); }
      if (stone === 'diamond')  { s += 2; r.push('Diamond statement rings are luxury defined'); }
      if (stone === 'mixed')    { s += 2; r.push('Multi-stone cocktail rings maximise impact'); }
      if (stone === 'none')     { s -= 2; }
      if (band === 'thick') { s += 2; r.push('Thick band adds bold dramatic presence'); }
      if (personality === 'bold')       { s += 3; r.push('Your bold personality and this ring are a match'); }
      if (personality === 'vintage')    { s += 2; r.push('Vintage cocktail aesthetic suits you perfectly'); }
      if (personality === 'minimalist') { s -= 3; }
      if (budgetTier < 1)  { s -= 2; }
      if (budgetTier >= 3) { s += 1; }
      return [s, r];
    }),

    sr('Open Ring', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'daily') { s += 3; r.push('Trendy open design for daily wear'); }
      if (purpose === 'gift')  { s += 2; r.push('Adjustable fit makes it a thoughtful gift'); }
      if (style === 'minimal') { s += 2; r.push('Minimalist open form is effortlessly chic'); }
      if (style === 'bold')    { s += 2; r.push('Open form makes a contemporary statement'); }
      if (style === 'classic') { s -= 1; }
      if (sparkle === 'low')    { s += 2; r.push('Low-key sparkle suits your preference'); }
      if (sparkle === 'medium') { s += 2; r.push('A single stone catches light beautifully'); }
      if (stone === 'none')    { s += 2; r.push('Clean open band is sleekly minimal'); }
      if (stone === 'diamond') { s += 1; }
      if (personality === 'minimalist') { s += 2; r.push('Effortlessly minimal for your lifestyle'); }
      if (personality === 'bold')       { s += 2; r.push('Open ring feels modern and trend-forward'); }
      if (personality === 'vintage')    { s -= 1; }
      if (budgetTier === 0) { s += 2; r.push('Accessible price range matches your budget'); }
      if (budgetTier >= 1)  { s += 1; }
      return [s, r];
    }),

    sr('Stackable Rings', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'daily') { s += 3; r.push('Mix-and-match sets perfect for daily styling'); }
      if (purpose === 'gift')  { s += 2; r.push('A curated stack makes an excellent gift'); }
      if (style === 'minimal') { s += 3; r.push('Minimalist stacking is your signature move'); }
      if (style === 'classic') { s += 1; }
      if (sparkle === 'low')    { s += 2; r.push('Low-sparkle bands stack beautifully'); }
      if (sparkle === 'medium') { s += 2; r.push('Mix sparkly and plain bands in your stack'); }
      if (stone === 'none')    { s += 2; r.push('Plain bands create the cleanest stack'); }
      if (stone === 'diamond') { s += 1; r.push('Thin diamond bands stack luxuriously'); }
      if (band === 'thin')   { s += 3; r.push('Thin bands are essential for great stacking'); }
      if (band === 'medium') { s += 1; }
      if (band === 'thick')  { s -= 2; }
      if (personality === 'minimalist') { s += 3; r.push('Your minimalist nature loves the art of stacking'); }
      if (personality === 'bold')       { s += 1; r.push('A bold stack of contrasting metals makes impact'); }
      if (budgetTier === 0) { s += 2; r.push('Start with one and grow the stack over time'); }
      if (budgetTier >= 1)  { s += 1; }
      return [s, r];
    }),

    sr('Signet Ring', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'daily') { s += 2; r.push('Versatile identity ring for everyday wear'); }
      if (purpose === 'gift')  { s += 2; r.push('A personalised signet is a meaningful gift'); }
      if (style === 'classic') { s += 3; r.push('The ultimate classic identity piece'); }
      if (style === 'bold')    { s += 2; r.push('Flat-top signet reads bold and confident'); }
      if (style === 'minimal') { s += 1; r.push('Plain signet is quietly powerful'); }
      if (sparkle === 'low')    { s += 3; r.push('Stone-free signet has understated luxury'); }
      if (sparkle === 'medium') { s += 1; }
      if (sparkle === 'high')   { s -= 1; }
      if (sparkle === 'max')    { s -= 2; }
      if (stone === 'none')     { s += 3; r.push('Signet rings shine without stones'); }
      if (stone === 'gemstone') { s += 1; r.push('Inset gemstone adds personal meaning'); }
      if (stone === 'diamond')  { s -= 1; }
      if (band === 'thick')  { s += 2; r.push('Thick band anchors the bold flat surface'); }
      if (band === 'medium') { s += 1; }
      if (personality === 'classic')    { s += 3; r.push('Classic elegance defines a signet ring'); }
      if (personality === 'bold')       { s += 2; r.push('Bold identity statement reflects your nature'); }
      if (personality === 'minimalist') { s += 1; }
      if (personality === 'vintage')    { s += 1; r.push('Signets carry rich historical roots'); }
      s += 1;
      return [s, r];
    }),

    sr('Geometric Ring', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'daily') { s += 3; r.push('Modern shapes make every day stand out'); }
      if (purpose === 'gift')  { s += 2; r.push('Uniquely eye-catching gift choice'); }
      if (style === 'bold')    { s += 3; r.push('Geometric forms match your bold style'); }
      if (style === 'minimal') { s += 2; r.push('Clean lines suit your minimalist aesthetic'); }
      if (style === 'vintage') { s -= 1; }
      if (style === 'classic') { s -= 1; }
      if (sparkle === 'medium') { s += 2; r.push('Angular facets catch light beautifully'); }
      if (sparkle === 'low')    { s += 1; }
      if (sparkle === 'high')   { s += 1; }
      if (stone === 'none')     { s += 2; r.push('Geometry alone creates striking visual impact'); }
      if (stone === 'diamond')  { s += 1; }
      if (stone === 'gemstone') { s += 2; r.push('Geometric settings let gemstones truly pop'); }
      if (band === 'thick')  { s += 2; r.push('Thick geometric band is architectural and bold'); }
      if (band === 'medium') { s += 1; }
      if (personality === 'bold')       { s += 3; r.push('Reflects your bold, creative personality'); }
      if (personality === 'minimalist') { s += 2; r.push('Geometric minimalism is your aesthetic'); }
      if (personality === 'classic')    { s -= 1; }
      if (personality === 'vintage')    { s -= 1; }
      s += 1;
      return [s, r];
    }),

    sr('Nature-Inspired Ring', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'engagement') { s += 2; r.push('Organic forms make engagement feel poetic'); }
      if (purpose === 'special')    { s += 2; r.push('Floral motifs elevate special occasions'); }
      if (purpose === 'daily')      { s += 1; }
      if (style === 'vintage')  { s += 3; r.push('Floral vintage aesthetic feels true to you'); }
      if (style === 'romantic') { s += 3; r.push('Nature motifs feel deeply romantic'); }
      if (style === 'bold')     { s += 1; }
      if (sparkle === 'medium') { s += 2; r.push('Nature settings have organic, living sparkle'); }
      if (sparkle === 'low')    { s += 1; }
      if (sparkle === 'high')   { s += 1; }
      if (stone === 'gemstone') { s += 3; r.push("Coloured stones echo nature's palette"); }
      if (stone === 'pearl')    { s += 2; r.push('Pearl centres feel naturally elegant'); }
      if (stone === 'diamond')  { s += 1; r.push('Diamonds set in nature motifs feel magical'); }
      if (stone === 'none')     { s -= 1; }
      if (personality === 'vintage')    { s += 2; r.push('Your vintage sensibility loves floral details'); }
      if (personality === 'romantic')   { s += 3; r.push('Nature designs mirror your warm heart'); }
      if (personality === 'minimalist') { s -= 1; }
      if (budgetTier >= 1) { s += 1; }
      return [s, r];
    }),

    sr('Adjustable Ring', () => {
      let s = 0; const r: string[] = [];
      if (purpose === 'daily') { s += 3; r.push('Flexible sizing for active daily lifestyles'); }
      if (purpose === 'gift')  { s += 3; r.push('No sizing stress — a perfect thoughtful gift'); }
      if (style === 'minimal') { s += 2; r.push('Simple and fuss-free suits your minimalism'); }
      if (style === 'bold')    { s += 1; }
      if (sparkle === 'low')    { s += 2; r.push('Understated sparkle fits casual wear'); }
      if (sparkle === 'medium') { s += 1; }
      if (stone === 'none')     { s += 2; r.push('Plain adjustable band is versatile and clean'); }
      if (stone === 'gemstone') { s += 1; r.push('A pop of colour keeps it playful'); }
      if (personality === 'minimalist') { s += 2; r.push('No-fuss style matches your minimalist life'); }
      if (personality === 'bold')       { s += 1; }
      if (budgetTier === 0) { s += 3; r.push('Budget-friendly without sacrificing style'); }
      if (budgetTier === 1) { s += 2; r.push('Great value at your price point'); }
      if (budgetTier >= 2)  { s += 1; }
      return [s, r];
    }),
  ];

  return rings
    .filter((r) => r.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

// ─── Rank badge helper ────────────────────────────────────────────────────────
function rankBadgeClass(rank: number) {
  if (rank === 1) return 'bg-amber-400 text-black';
  if (rank === 2) return 'bg-gray-300 text-black';
  if (rank === 3) return 'bg-amber-700 text-white';
  return 'bg-white/10 text-gray-300';
}

const RANK_LABELS: Record<number, string> = { 1: 'Best Match', 2: 'Runner Up', 3: 'Top Pick' };

const EMPTY_PREFS: Prefs = {
  purpose: '', style: '', budget: '', metal: '', stone: '', gender: '', band: '', sparkle: '', personality: '',
};

// ─── Catalog matching engine ──────────────────────────────────────────────────
function matchCatalogRings(prefs: Prefs): CatalogRing[] {
  const catMap: Record<string, string[]> = {
    engagement: ['Engagement'],
    wedding:    ['Wedding', 'Luxury'],
    daily:      ['Casual'],
    gift:       [],
    special:    ['Statement', 'Luxury'],
  };

  // form budget → catalog budget_range values that overlap
  const budgetMap: Record<string, string[]> = {
    under5k:    ['0-5k'],
    '5kto10k':  ['5k-10k'],
    '10kto20k': ['10k-20k', '10k-50k'],
    '20kto50k': ['20k-50k', '10k-50k'],
    '50kto150k':['50k-150k'],
    above150k:  ['150k+'],
  };

  const metalMap: Record<string, string[]> = {
    gold:      ['Gold'],
    whitegold: ['Platinum'],
    rosegold:  ['Rose Gold'],
    silver:    ['Silver'],
    platinum:  ['Platinum'],
  };

  const stoneMap: Record<string, string[]> = {
    diamond:  ['Diamond'],
    gemstone: ['Gemstone'],
    pearl:    ['Gemstone'],
    mixed:    ['Diamond', 'Gemstone'],
    none:     ['None'],
  };

  const personalityMap: Record<string, string[]> = {
    minimalist: ['Minimal', 'Modern', 'Simple'],
    romantic:   ['Romantic', 'Elegant'],
    vintage:    ['Classic', 'Elegant'],
    bold:       ['Bold', 'Trendy'],
    classic:    ['Classic', 'Elegant', 'Simple'],
  };

  const genderMap: Record<string, string[]> = {
    female: ['Female', 'Unisex'],
    male:   ['Male', 'Unisex'],
    unisex: ['Female', 'Male', 'Unisex'],
  };

  const categories    = catMap[prefs.purpose] ?? [];
  const budgets       = budgetMap[prefs.budget] ?? [];
  const metals        = metalMap[prefs.metal] ?? [];
  const stones        = stoneMap[prefs.stone] ?? [];
  const personalities = personalityMap[prefs.personality] ?? [];
  const genders       = genderMap[prefs.gender] ?? ['Female', 'Male', 'Unisex'];

  const scored = RING_CATALOG.map((ring) => {
    let score = 0;
    if (budgets.includes(ring.budget_range))                                   score += 5;
    if (genders.includes(ring.gender))                                         score += 3;
    if (categories.length === 0 || categories.includes(ring.category))         score += 3;
    if (metals.includes(ring.metal))                                           score += 3;
    if (stones.includes(ring.stone))                                           score += 2;
    if (personalities.includes(ring.personality))                              score += 2;
    return { ring, score };
  });

  return scored
    .filter((s) => s.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 9)
    .map((s) => s.ring);
}

// ─── Catalog ring card ────────────────────────────────────────────────────────
function CatalogRingCard({ ring, index }: { ring: CatalogRing; index: number }) {
  const stoneLabel = ring.stone !== 'None' ? ring.stone : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group bg-white/[0.04] border border-white/10 overflow-hidden hover:border-amber-400/30 transition-colors duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        <img
          src={ring.image_url}
          alt={`${ring.style} ${ring.metal} ring`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[9px] tracking-widest px-2 py-1 uppercase">
          {ring.category}
        </span>
        {stoneLabel && (
          <span className="absolute top-3 right-3 bg-amber-400/90 text-black text-[9px] tracking-widest px-2 py-1 uppercase font-bold">
            {stoneLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-serif text-base leading-tight mb-0.5">{ring.style}</h4>
        <p className="text-gray-500 text-xs mb-1">{ring.metal}{stoneLabel ? ` · ${stoneLabel}` : ''}</p>
        <p className="text-gray-600 text-[11px] italic mb-3">{ring.design}</p>
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-[10px] tracking-widest text-gray-600 uppercase">{ring.occasion}</span>
          <span className="text-amber-400 text-sm font-semibold">
            {BUDGET_INR[ring.budget_range] ?? ring.budget_range}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function RingAdvisor() {
  const [prefs, setPrefs] = useState<Prefs>(EMPTY_PREFS);
  const [results, setResults] = useState<Ring[] | null>(null);
  const [catalogMatches, setCatalogMatches] = useState<CatalogRing[] | null>(null);
  const [showError, setShowError] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const handle = (key: keyof Prefs, value: string) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    setResults(null);
    setCatalogMatches(null);
    setShowError(false);
  };

  const submit = () => {
    const allFilled = Object.values(prefs).every((v) => v !== '');
    if (!allFilled) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setResults(computeRecommendations(prefs));
    setCatalogMatches(matchCatalogRings(prefs));
    setTimeout(() => {
      document.getElementById('advisor-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const reset = () => {
    setPrefs(EMPTY_PREFS);
    setResults(null);
    setCatalogMatches(null);
    setShowError(false);
    document.getElementById('ring-advisor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="ring-advisor" className="py-24 px-6 bg-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Sparkles className="text-amber-400 w-5 h-5" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">
            Your Perfect Ring, Revealed
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed tracking-wide">
            Answer eight simple questions and our expert stylist ranks the ring designs made
            specifically for you.
          </p>
        </motion.div>

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {FIELDS.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label
                  htmlFor={`field-${field.key}`}
                  className="text-[10px] tracking-widest text-gray-500 uppercase font-medium"
                >
                  {field.label}
                </label>
                <div className="relative">
                  <select
                    id={`field-${field.key}`}
                    value={prefs[field.key]}
                    onChange={(e) => handle(field.key, e.target.value)}
                    className={[
                      'w-full bg-white/5 py-3 pl-4 pr-10 appearance-none text-sm',
                      'focus:outline-none transition-colors duration-200 cursor-pointer border',
                      prefs[field.key] ? 'text-white' : 'text-gray-500',
                      showError && !prefs[field.key]
                        ? 'border-red-500/60'
                        : prefs[field.key]
                        ? 'border-amber-400/40 focus:border-amber-400/70'
                        : 'border-white/15 focus:border-white/40',
                    ].join(' ')}
                  >
                    <option value="" disabled className="bg-[#111] text-gray-400">
                      Choose…
                    </option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#111] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4"
                    aria-hidden
                  />
                </div>
              </div>
            ))}
          </div>

          {showError && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs text-center mb-6 tracking-wide"
            >
              Please fill in all fields to get your personalised recommendation.
            </motion.p>
          )}

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={submit}
              className="flex items-center gap-2.5 px-12 py-4 bg-amber-400 text-black font-semibold tracking-widest text-xs hover:bg-amber-300 transition-colors duration-200"
            >
              <Sparkles className="w-4 h-4" />
              FIND MY PERFECT RING
            </motion.button>
          </div>
        </motion.div>

        {/* ── Results ── */}
        {results !== null && (
          <motion.div
            id="advisor-results"
            key={JSON.stringify(prefs)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-20"
          >
            {/* Results header */}
            <div className="text-center mb-10">
              <p className="text-[10px] tracking-widest text-amber-400 uppercase mb-1">
                🎯 Your Best Ring Matches
              </p>
              <h3 className="text-2xl font-serif mb-2">Ranked for You</h3>
              <p className="text-gray-600 text-xs tracking-wide">
                From best to least suitable, based on your preferences
              </p>
            </div>

            {results.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-10">
                No strong matches found. Try adjusting your preferences above.
              </p>
            ) : (
              <div className="space-y-3 max-w-3xl mx-auto">
                {results.map((ring, i) => (
                  <motion.div
                    key={ring.name}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    className="flex items-start gap-4 p-5 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-200"
                  >
                    {/* Rank badge */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${rankBadgeClass(i + 1)}`}
                    >
                      {i + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg leading-tight mb-1.5">{ring.name}</h4>
                      <ul className="space-y-1">
                        {ring.reasons.map((reason, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                            <span className="text-amber-400 text-xs mt-0.5 shrink-0">✔</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Top-3 label */}
                    {RANK_LABELS[i + 1] && (
                      <div className="shrink-0 hidden sm:flex items-center">
                        <span className="text-[9px] tracking-widest text-gray-600 uppercase">
                          {RANK_LABELS[i + 1]}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── Catalog Rings ── */}
            {catalogMatches !== null && (
              <div className="mt-20">
                <div className="text-center mb-10">
                  <p className="text-[10px] tracking-widest text-amber-400 uppercase mb-1">
                    From Our Collection
                  </p>
                  <h3 className="text-2xl font-serif mb-2">Rings Matching Your Style</h3>
                  <p className="text-gray-600 text-xs tracking-wide">
                    {catalogMatches.length > 0
                      ? `${catalogMatches.length} ring${catalogMatches.length !== 1 ? 's' : ''} curated for you — price in INR`
                      : 'No catalog match for this exact combination. Try adjusting budget or metal.'}
                  </p>
                </div>

                {catalogMatches.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {catalogMatches.map((ring, i) => (
                      <CatalogRingCard key={ring.id} ring={ring} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Start over */}
            <div className="flex justify-center mt-14">
              <button
                onClick={reset}
                className="flex items-center gap-2 text-xs tracking-widest text-gray-500 hover:text-gray-300 transition-colors uppercase"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
