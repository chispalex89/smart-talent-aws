import React from 'react';
import { Card } from '@/components/ui';
import PaymentDialog from './PaymentDialog';
import Plans from './Plans';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const paypalClientId =
  import.meta.env.VITE_PAYPAL_CLIENT_ID ||
  process.env.REACT_APP_PAYPAL_CLIENT_ID;

const Pricing = () => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        locale: 'es_ES',
        vault: true,
      }}
    >
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-8">
          <h3>Membresías</h3>
          {/* <PaymentCycleToggle /> */}
        </div>
        <Plans />
      </Card>
      <PaymentDialog />
    </PayPalScriptProvider>
  );
};

export default Pricing;
