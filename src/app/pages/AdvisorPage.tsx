import { useEffect } from 'react';
import { RingAdvisor } from '../components/RingAdvisor';

export default function AdvisorPage() {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div className="pt-16">
      <RingAdvisor />
    </div>
  );
}
