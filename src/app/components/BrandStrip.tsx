import { Gem } from 'lucide-react';

const ITEMS = [
  '18K Gold',
  'Certified Diamonds',
  'Handcrafted',
  'BIS Hallmarked',
  '30 Years of Excellence',
  '10,000+ Happy Customers',
  'Free Engraving',
  'Lifetime Polish',
  'GIA Certified',
  'Ethically Sourced',
  'Custom Sizing',
  'Free Shipping',
];

// Triple for seamless infinite loop (keyframe translates -33.333%)
const TRIPLED = [...ITEMS, ...ITEMS, ...ITEMS];

export function BrandStrip() {
  return (
    <div className="bg-[#0a0a0a] py-4 overflow-hidden border-y border-amber-900/40 select-none">
      <div
        className="flex gap-0 will-change-transform"
        style={{
          animation: 'marquee 38s linear infinite',
          width: 'max-content',
        }}
      >
        {TRIPLED.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap px-6">
            <Gem size={11} className="text-amber-400 mr-3 flex-shrink-0" />
            <span className="text-amber-200/80 text-xs tracking-[0.25em] uppercase font-light">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
