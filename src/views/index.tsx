import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';
import AllRoutes from '@/components/route/AllRoutes';
import type { LayoutType } from '@/@types/theme';
import { protectedRoutes, publicRoutes } from '../config/routes.config';

interface ViewsProps {
  pageContainerType?: 'default' | 'gutterless' | 'contained';
  layout?: LayoutType;
}

const Views = (props: ViewsProps) => {
  return (
    <Suspense fallback={<Loading loading={true} className="w-full" />}>
      <AllRoutes
        protectedRoutes={protectedRoutes}
        publicRoutes={publicRoutes}
        {...props}
      />
    </Suspense>
  );
};

export default Views;
