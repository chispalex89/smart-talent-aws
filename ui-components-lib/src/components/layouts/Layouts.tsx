import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';
import type { CommonProps } from '@/@types/common';
import { useAuth } from '@/auth';
import { useThemeStore } from '@/store/themeStore';
import PostLoginLayout from './PostLoginLayout';
import { LayoutProps } from './PostLoginLayout/components/LayoutProps.interface';

const Layout = ({ children, navigationConfig, user }: LayoutProps) => {
  const layoutType = useThemeStore((state) => state.layout.type);
  return (
    <Suspense
      fallback={
        <div className="flex flex-auto flex-col h-[100vh]">
          <Loading loading={true} />
        </div>
      }
    >
      <PostLoginLayout
        layoutType={layoutType}
        navigationConfig={navigationConfig}
        user={user}
      >
        {children}
      </PostLoginLayout>
    </Suspense>
  );
};

export default Layout;
