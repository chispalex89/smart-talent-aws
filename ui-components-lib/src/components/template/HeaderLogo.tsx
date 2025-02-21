import Logo from '@/components/template/Logo';
import { useThemeStore } from '@/store/themeStore';
import appConfig from '@/configs/app.config';
import { Link } from 'react-router-dom';
import type { Mode } from '@/@types/theme';

const HeaderLogo = ({
  mode,
  innerLink,
}: {
  mode?: Mode;
  innerLink: boolean;
}) => {
  const defaultMode = useThemeStore((state) => state.mode);

  return innerLink ? (
    <Link to={appConfig.authenticatedEntryPath}>
      <Logo
        imgClass="max-h-10"
        mode={mode || defaultMode}
        className="hidden lg:block"
      />
    </Link>
  ) : (
    <a href={appConfig.landingPageRoute} rel="noreferrer">
      <Logo
        mode={mode || defaultMode}
      />
    </a>
  );
};

export default HeaderLogo;
