import { useState, useCallback, useEffect, type ReactNode } from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import BookingModal from '../components/BookingModal/BookingModal';
import type { ServiceCategory, Service } from '../types';
import { getServices } from '../api/client';

export interface BookingActions {
  handleBookClick: () => void;
  handleBookService: (serviceId: string) => void;
  handleMasterClick: (masterId: string) => void;
}

interface PageLayoutProps {
  children: ReactNode | ((actions: BookingActions) => ReactNode);
}

export default function PageLayout({ children }: PageLayoutProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [preselectedMasterId, setPreselectedMasterId] = useState<string | null>(null);
  const [preselectedCategory, setPreselectedCategory] = useState<ServiceCategory | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then(setAllServices).catch(console.error);
  }, []);

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

  const handleBookClick = useCallback(() => openBooking(), [openBooking]);

  const handleBookService = useCallback((serviceId: string) => {
    const service = allServices.find((s) => s.id === serviceId);
    openBooking({ serviceId, category: service?.category as ServiceCategory | undefined });
  }, [openBooking, allServices]);

  const handleMasterClick = useCallback((masterId: string) => {
    openBooking({ masterId });
  }, [openBooking]);

  const actions: BookingActions = { handleBookClick, handleBookService, handleMasterClick };

  return (
    <>
      <Header onBookClick={handleBookClick} />
      <main>
        {typeof children === 'function' ? children(actions) : children}
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
