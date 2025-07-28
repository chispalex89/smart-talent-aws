import Container from '@/components/shared/Container';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import JobSearch from './components/JobSearch';
import JobOfferListTableTools from './components/JobListTableTools';

const JobOfferSearch = () => {
  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Búsqueda de Empleo</h3>
          </div>
          <JobOfferListTableTools />
          <JobSearch />
        </div>
      </AdaptiveCard>
    </Container>
  );
};

export default JobOfferSearch;
