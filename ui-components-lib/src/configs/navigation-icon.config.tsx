import {
  PiHouseLineDuotone,
  PiBriefcaseBold,
  PiStarBold,
  PiArchiveBold,
  PiPlusBold,
  PiUserBold,
  PiMagnifyingGlassDuotone,
  PiSignOutBold,
} from 'react-icons/pi';
import {
  MdCardMembership,
  MdOutlineCurrencyExchange,
  MdOutlinePostAdd,
  MdCreditCard,
  MdOutlineContactPage,
} from 'react-icons/md';
import { JSX } from 'react';

export type NavigationIcons = Record<string, JSX.Element>;

const navigationIcon: NavigationIcons = {
  home: <PiHouseLineDuotone />,
  job: <PiBriefcaseBold />,
  favorites: <PiStarBold />,
  archive: <PiArchiveBold />,
  membership: <MdCardMembership />,
  memberships: <MdCreditCard />,
  candidates: <PiUserBold />,
  new: <PiPlusBold />,
  list: <MdOutlinePostAdd />,
  membershipPlans: <MdOutlineCurrencyExchange />,
  search: <PiMagnifyingGlassDuotone />,
  cv: <MdOutlineContactPage />,
  account: <PiUserBold />,
  logout: <PiSignOutBold />,
};

export default navigationIcon;
