import { Helmet } from 'react-helmet-async';
import Masters from '../components/Masters/Masters';
import PageLayout from '../layouts/PageLayout';

export default function MastersPage() {
  return (
    <PageLayout>
      {({ handleMasterClick }) => (
        <>
          <Helmet>
            <title>Наші майстри — Beauty Room, Варна</title>
            <meta name="description" content="Професійні майстри салону Beauty Room у Варні. Досвідчені спеціалісти з манікюру, педикюру, шугарінгу та оформлення брів." />
            <link rel="canonical" href="https://beautyroomvarna.space/masters" />
          </Helmet>
          <Masters onMasterClick={handleMasterClick} />
        </>
      )}
    </PageLayout>
  );
}
