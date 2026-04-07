import { Hero }                 from '../components/Hero';
import { BrandStrip }           from '../components/BrandStrip';
import { Collections }          from '../components/Collections';
import { TrendingRings }        from '../components/TrendingRings';
import { InfiniteRingCarousel } from '../components/InfiniteRingCarousel';
import { About }                from '../components/About';
import { Craftsmanship }        from '../components/Craftsmanship';
import { SizeGuide }            from '../components/SizeGuide';
import { RingAdvisor }          from '../components/RingAdvisor';
import { Contact }              from '../components/Contact';

export default function HomePage() {
  return (
    <div className="w-full">
      <Hero />
      <BrandStrip />
      <Collections />
      <TrendingRings />
      <InfiniteRingCarousel />
      <About />
      <Craftsmanship />
      <SizeGuide />
      <RingAdvisor />
      <Contact />
    </div>
  );
}
