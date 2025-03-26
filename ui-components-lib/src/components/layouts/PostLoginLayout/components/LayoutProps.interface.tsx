import { CommonProps } from '@/@types/common';
import { NavigationTree } from '@/@types/navigation';
import { UserLayoutProps } from '@/utils/hooks/useLayout';

export interface LayoutProps extends CommonProps {
  navigationConfig: NavigationTree[];
  user: UserLayoutProps;
}
