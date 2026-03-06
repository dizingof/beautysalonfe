import { useState, useCallback } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Masters from './components/Masters/Masters';
import Prices from './components/Prices/Prices';
import Reviews from './components/Reviews/Reviews';
import Footer from './components/Footer/Footer';
import BookingModal from './components/BookingModal/BookingModal';
import type { ServiceCategory } from './types';
import { services } from './data/mockData';

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [preselectedMasterId, setPreselectedMasterId] = useState<string | null>(null);
  const [preselectedCategory, setPreselectedCategory] = useState<ServiceCategory | null>(null);
  const [pricesCategory, setPricesCategory] = useState<ServiceCategory | undefined>(undefined);

  const openBooking = useCallback((options?: {
    serviceId?: string;
    masterId?: string;
    category?: ServiceCategory;
  }) => {
    setPreselectedServiceId(options?.serviceId || null);
    setPreselectedMasterId(options?.masterId || null);
    setPreselectedCategory(options?.category || null);
    setBookingOpen(true);
  }, []);

  const handleBookClick = useCallback(() => {
    openBooking();
  }, [openBooking]);

  const handleCategoryClick = useCallback((category: ServiceCategory) => {
    setPricesCategory(category);
    setTimeout(() => {
      const el = document.getElementById('prices');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const handleBookService = useCallback((serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    openBooking({
      serviceId,
      category: service?.category,
    });
  }, [openBooking]);

  const handleMasterClick = useCallback((masterId: string) => {
    openBooking({ masterId });
  }, [openBooking]);

  return (
    <>
      <Header onBookClick={handleBookClick} />

      <main>
        <Hero onBookClick={handleBookClick} />
        <Services onCategoryClick={handleCategoryClick} />
        <Prices
          onBookService={handleBookService}
          initialCategory={pricesCategory}
        />
        <Masters onMasterClick={handleMasterClick} />
        <Reviews />
      </main>

      <Footer onBookClick={handleBookClick} />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedServiceId={preselectedServiceId}
        preselectedMasterId={preselectedMasterId}
        preselectedCategory={preselectedCategory}
      />
    </>
  );
}
