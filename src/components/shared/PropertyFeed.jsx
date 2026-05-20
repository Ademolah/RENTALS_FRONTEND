import { PropertyCard } from './PropertyCard';

// Temporary Mock Data leveraging the exact duplex you successfully tested earlier
const MOCK_PROPERTIES = [
  {
    id: '1',
    title: 'Luxury 4-Bedroom Detached Duplex',
    locality: 'Ikoyi',
    price: '₦ 85,000,000 / yr',
    beds: 4,
    baths: 5,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isPremium: true,
    span: 'md:col-span-2 md:row-span-2', // Massive Cinematic Hero Card on Desktop
  },
  {
    id: '2',
    title: 'Minimalist Studio Apartment',
    locality: 'Victoria Island',
    price: '₦ 12,000,000 / yr',
    beds: 1,
    baths: 1,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isPremium: false,
    span: 'md:col-span-1 md:row-span-1', // Standard Box
  },
  {
    id: '3',
    title: 'Zenith Penthouse Suite',
    locality: 'Lekki Phase 1',
    price: '₦ 150,000,000 / yr',
    beds: 5,
    baths: 6,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    isPremium: true,
    span: 'md:col-span-3 md:row-span-2', // Full Width Horizontal Hero
  }
];

export const PropertyFeed = () => {
  return (
    <div className="bg-brand-midnight md:bg-brand-slate min-h-screen">
      
      {/* 
        THE LAYOUT ENGINE
        Mobile: Full height, hidden scrollbars, mandatory vertical snapping.
        Desktop: Max-width container, 3-column auto-flowing Bento Grid.
      */}
      <div 
        className="
          h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory 
          scrollbar-hide
          md:h-auto md:snap-none md:overflow-visible
          md:max-w-[1400px] md:mx-auto md:p-8 
          md:grid md:grid-cols-3 md:auto-rows-[400px] gap-0 md:gap-6
        "
      >
        {MOCK_PROPERTIES.map((prop) => (
          <PropertyCard key={prop.id} property={prop} />
        ))}
      </div>
      
    </div>
  );
};