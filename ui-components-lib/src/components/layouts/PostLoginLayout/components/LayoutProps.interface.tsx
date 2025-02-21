import { CommonProps } from '@/@types/common';
import { NavigationTree } from '@/@types/navigation';

export interface LayoutProps extends CommonProps {
  navigationConfig: NavigationTree[];
}
