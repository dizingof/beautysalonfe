import { Helmet } from 'react-helmet-async';
import Prices from '../components/Prices/Prices';
import PageLayout from '../layouts/PageLayout';

export default function PricesPage() {
  return (
    <PageLayout>
      {({ handleBookService }) => (
        <>
          <Helmet>
            <title>Ціни на послуги — Beauty Room, Варна</title>
            <meta name="description" content="Актуальні ціни на послуги салону Beauty Room у Варні: шугарінг, манікюр, педикюр, брови та вії. Доступні ціни в євро." />
            <link rel="canonical" href="https://beautyroomvarna.space/prices" />
          </Helmet>
          <Prices onBookService={handleBookService} />
        </>
      )}
    </PageLayout>
  );
}
