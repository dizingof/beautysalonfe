import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Services from '../components/Services/Services';
import Prices from '../components/Prices/Prices';
import PageLayout from '../layouts/PageLayout';
import type { ServiceCategory } from '../types';

export default function ServicesPage() {
  const [pricesCategory, setPricesCategory] = useState<ServiceCategory | undefined>(undefined);
  const navigate = useNavigate();

  const handleCategoryClick = useCallback((category: ServiceCategory) => {
    setPricesCategory(category);
    navigate('/prices');
  }, [navigate]);

  return (
    <PageLayout>
      {({ handleBookService }) => (
        <>
          <Helmet>
            <title>Послуги та ціни — Beauty Room, Варна</title>
            <meta name="description" content="Повний каталог послуг салону Beauty Room у Варні: шугарінг, манікюр, педикюр, оформлення брів та вій. Ціни та запис онлайн." />
            <link rel="canonical" href="https://beautyroomvarna.space/services" />
          </Helmet>
          <Services onCategoryClick={handleCategoryClick} />
          <Prices onBookService={handleBookService} initialCategory={pricesCategory} />
        </>
      )}
    </PageLayout>
  );
}
