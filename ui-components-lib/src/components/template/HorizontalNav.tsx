import HorizontalMenuContent from './HorizontalMenuContent'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import { useSessionUser } from '@/store/authStore'
import { NavigationTree } from '@/@types/navigation';

const HorizontalNav = ({
  translationSetup = true,
  navigationConfig,
}: {
  translationSetup?: boolean;
  navigationConfig: NavigationTree[];
}) => {
  const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey);

  const userAuthority = useSessionUser((state) => state.user.authority);

  return (
    <HorizontalMenuContent
      navigationTree={navigationConfig}
      routeKey={currentRouteKey}
      userAuthority={userAuthority || []}
      translationSetup={translationSetup}
    />
  );
};

export default HorizontalNav
