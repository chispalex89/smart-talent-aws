import { lazy, Suspense } from 'react';
import {
  LAYOUT_COLLAPSIBLE_SIDE,
  LAYOUT_STACKED_SIDE,
  LAYOUT_TOP_BAR_CLASSIC,
  LAYOUT_FRAMELESS_SIDE,
  LAYOUT_CONTENT_OVERLAY,
  LAYOUT_BLANK,
} from '@/constants/theme.constant';
import Loading from '@/components/shared/Loading';
import type { CommonProps } from '@/@types/common';
import type { JSX, LazyExoticComponent } from 'react';
import type { LayoutType } from '@/@types/theme';
import { NavigationTree } from '@/@types/navigation';
import { LayoutProps } from './components/LayoutProps.interface';

type Layouts = Record<
  string,
  LazyExoticComponent<<T extends LayoutProps>(props: T) => JSX.Element>
>;
interface PostLoginLayoutProps extends LayoutProps {
  layoutType: LayoutType;
}

const layouts: Layouts = {
  [LAYOUT_COLLAPSIBLE_SIDE]: lazy(() => import('./components/CollapsibleSide')),
  [LAYOUT_STACKED_SIDE]: lazy(() => import('./components/StackedSide')),
  [LAYOUT_TOP_BAR_CLASSIC]: lazy(() => import('./components/TopBarClassic')),
  [LAYOUT_FRAMELESS_SIDE]: lazy(() => import('./components/FrameLessSide')),
  [LAYOUT_CONTENT_OVERLAY]: lazy(() => import('./components/ContentOverlay')),
  [LAYOUT_BLANK]: lazy(() => import('./components/Blank')),
};

const PostLoginLayout = ({
  layoutType,
  children,
  navigationConfig,
  user,
}: PostLoginLayoutProps) => {
  const AppLayout = layouts[layoutType] ?? layouts[Object.keys(layouts)[0]];

  return (
    <Suspense fallback={<Loading type="cover" loading={true} />}>
      <AppLayout navigationConfig={navigationConfig}
      user={user}
      >{children}</AppLayout>
    </Suspense>
  );
};

export default PostLoginLayout;
