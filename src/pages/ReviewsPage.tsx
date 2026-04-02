import { Helmet } from 'react-helmet-async';
import Reviews from '../components/Reviews/Reviews';
import PageLayout from '../layouts/PageLayout';

export default function ReviewsPage() {
  return (
    <PageLayout>
      <>
        <Helmet>
          <title>Відгуки клієнтів — Beauty Room, Варна</title>
          <meta name="description" content="Відгуки клієнтів про салон Beauty Room у Варні. Реальні враження від послуг: шугарінг, манікюр, педикюр, брови." />
          <link rel="canonical" href="https://beautyroomvarna.space/reviews" />
        </Helmet>
        <Reviews />
      </>
    </PageLayout>
  );
}
