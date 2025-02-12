import Card from '@/components/ui/Card';
import Plans from './components/Plans';
// import PaymentCycleToggle from './components/PaymentCycleToggle'
import Faq from './components/Faq';
import PaymentDialog from './components/PaymentDialog';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  clientId: import.meta.env.PAYPAL_CLIENT_ID,
  enableFunding: 'venmo',
  buyerCountry: 'US',
  currency: 'USD',
  components: 'buttons',
};

const Pricing = () => {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-8">
          <h3>Membresías</h3>
          {/* <PaymentCycleToggle /> */}
        </div>
        <Plans />
      </Card>
      {/* <Faq /> */}
      <PaymentDialog />
    </PayPalScriptProvider>
  );
};

export default Pricing;
