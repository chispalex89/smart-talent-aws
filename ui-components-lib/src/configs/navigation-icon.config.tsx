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

export type NavigationIcons = Record<string, (mode: 'light' | 'dark') => JSX.Element>;

const navigationIcon: NavigationIcons = {
  home: (mode) => <PiHouseLineDuotone fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  job: (mode) => <PiBriefcaseBold fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  favorites: (mode) => <PiStarBold fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  archive: (mode) => <PiArchiveBold fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  membership: (mode) => <MdCardMembership fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  memberships: (mode) => <MdCreditCard fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  candidates: (mode) => <PiUserBold fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  new: (mode) => <PiPlusBold fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  list: (mode) => <MdOutlinePostAdd fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  membershipPlans: (mode) => <MdOutlineCurrencyExchange fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  search: (mode) => <PiMagnifyingGlassDuotone fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  cv: (mode) => <MdOutlineContactPage fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  account: (mode) => <PiUserBold fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
  logout: (mode) => <PiSignOutBold fill={mode === 'dark' ? "#FFFFFF" : "#5994FF"} />,
};

export default navigationIcon;
