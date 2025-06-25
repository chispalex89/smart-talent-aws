export type View = 'profile' | 'security' | 'company' | 'billing';

export type CreditCard = {
  cardHolderName: string;
  cardType: string;
  expMonth: string;
  expYear: string;
  last4Number: string;
  primary: boolean;
};

export type CreditCardInfo = { cardId: string } & CreditCard;

export type GetSettingsProfileResponse = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  img: string;
  phone: string;
};

export type GetSettingsBillingResponse = {
  paymentMethods: Array<CreditCardInfo>;
  transactionHistory: Array<{
    id: string;
    item: string;
    status: string;
    amount: number;
    date: number;
  }>;
  currentPlan: {
    plan: string;
    status: string;
    billingCycle: string;
    nextPaymentDate: number;
    amount: number;
  };
};

export type GetSettingsCompanyResponse = {
  id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
};