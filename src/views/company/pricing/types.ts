import React, { createElement } from 'react';
import { MembershipType } from '@prisma/client';

export type PaymentCycle = 'monthly' | 'annually';
export type PaymentMethods = 'creditCard' | 'paypal';

export const paymentMethods: {
  [key in PaymentMethods]: string | React.ReactNode;
} = {
  creditCard: 'Tarjeta de crédito',
  paypal: createElement('img', {
    src: 'https://smart-talent-dev.s3.us-east-1.amazonaws.com/images/static/paypal.svg',
    alt: 'PayPal',
  }),
};

export type GetPricingPlanResponse = MembershipType[];

// export type GetPricingPanResponse = {
//   featuresModel: {
//     id: string;
//     description: string;
//   }[];
//   plans: {
//     id: string;
//     name: string;
//     description: string;
//     price: {
//       monthly: number;
//       annually: number;
//     };
//     features: string[];
//     recommended: boolean;
//   }[];
// };
