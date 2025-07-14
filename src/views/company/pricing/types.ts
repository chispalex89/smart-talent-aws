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

export const planColors: {
  [key: string]: string;
} = {
  basic: '#0074D9', // blue
  bronce: '#0074D9', // blue
  premium: '#C0C0C0', // silver
  plata: '#C0C0C0', // silver
  enterprise: '#FFD700', // gold
  oro: '#FFD700', // gold
};