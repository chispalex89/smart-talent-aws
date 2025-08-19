import { useState } from 'react';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import Segment from '@/components/ui/Segment';
import classNames from '@/utils/classNames';
import sleep from '@/utils/sleep';
import { usePricingStore } from './pricingStore';
import {
  TbCalendar,
  TbCheck,
  TbCreditCard,
  TbLockPassword,
  TbUser,
} from 'react-icons/tb';
import {
  NumericFormat,
  PatternFormat,
  NumberFormatBase,
} from 'react-number-format';
import { useNavigate } from 'react-router-dom';
import { paymentMethods, PaymentMethods } from './types';
import { Input } from '@/components/ui';
import apiService from '../../../services/apiService';
import { useUserContext } from '../../../context/userContext';
import {
  PayPalButtons,
  PayPalScriptProvider,
  PayPalButtonsComponentProps,
} from '@paypal/react-paypal-js';

function limit(val: string, max: string) {
  if (val.length === 1 && val[0] > max[0]) {
    val = '0' + val;
  }

  if (val.length === 2) {
    if (Number(val) === 0) {
      val = '01';
    } else if (val > max) {
      val = max;
    }
  }

  return val;
}

function cardExpiryFormat(val: string) {
  const month = limit(val.substring(0, 2), '12');
  const date = limit(val.substring(2, 4), '31');

  return month + (date.length ? '/' + date : '');
}

const tomorrowDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString();
};

const PaymentDialog = () => {
  const { recruiter, refetchRecruiter } = useUserContext();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods | null>(
    'creditCard'
  );
  const [loading, setLoading] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const navigate = useNavigate();

  const { paymentDialog, setPaymentDialog, selectedPlan } = usePricingStore();

  console.log(selectedPlan);

  const handleDialogClose = async () => {
    setPaymentDialog(false);
    await sleep(200);
    setPaymentMethod('creditCard');
    setPaymentSuccessful(false);
  };

  const handlePaymentChange = (paymentMethod: PaymentMethods) => {
    setPaymentMethod(paymentMethod);
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      // await apiService.post('/payment', {
      //   planId: selectedPlan.id,
      //   paymentMethod,
      // });

      await apiService.patch(`/company/${recruiter?.companyId}/membership`, {
        membershipTypeId: selectedPlan.id,
      });
      await refetchRecruiter();
      setPaymentSuccessful(true);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    navigate('/profile/company?category=billing');
    await handleDialogClose();
  };

  return (
    <Dialog
      isOpen={paymentDialog}
      closable={!paymentSuccessful}
      onClose={handleDialogClose}
      onRequestClose={handleDialogClose}
    >
      {paymentSuccessful ? (
        <>
          <div className="text-center mt-6 mb-2">
            <div className="inline-flex rounded-full p-5 bg-success">
              <TbCheck className="text-5xl text-white" />
            </div>
            <div className="mt-6">
              <h4>¡Gracias por tu compra!</h4>
              <p className="text-base max-w-[400px] mx-auto mt-4 leading-relaxed">
                Hemos recibido tu pago y tu suscripción ha sido activada.
                <br />
                Puedes administrar tu suscripción en cualquier momento desde tu
                perfil.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-8">
              <Button block onClick={handleManageSubscription}>
                Ver mi suscripción
              </Button>
              <Button block variant="solid" onClick={handleDialogClose}>
                Cerrar
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h4>Suscripción {selectedPlan.name}</h4>
          <div className="mt-6">
            <Segment
              defaultValue={paymentMethod || 'creditCard'}
              className="gap-4 flex bg-transparent"
              onChange={(value) => handlePaymentChange(value as PaymentMethods)}
            >
              {Object.entries(paymentMethods).map(([key, value]) => (
                <Segment.Item key={key} value={key}>
                  {({ active, onSegmentItemClick }) => {
                    return (
                      <div
                        className={classNames(
                          'flex justify-between border rounded-xl border-gray-300 py-5 px-4 select-none ring-1 w-1/2',
                          active
                            ? 'ring-primary border-primary '
                            : 'ring-transparent bg-gray-100'
                        )}
                        role="button"
                        onClick={onSegmentItemClick}
                      >
                        <div>
                          <div className="heading-text mb-0.5">
                            Pagar con <br />
                            {value}
                          </div>
                        </div>
                        {active && <TbCheck className="text-primary text-xl" />}
                      </div>
                    );
                  }}
                </Segment.Item>
              ))}
            </Segment>
          </div>
          {paymentMethod === 'creditCard' && (
            <div className="mt-6 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center justify-between p-4">
                <div className="w-full">
                  <span>Tarjeta de Crédito</span>
                  <div className="grid grid-cols-10 items-center gap-2 mt-2">
                    <div className="col-span-1">
                      <TbUser className="text-2xl" />
                    </div>
                    <Input
                      className="col-span-9 heading-text w-full border-transparent focus:border-transparent"
                      placeholder="Nombre del titular"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      inputMode="text"
                      maxLength={30}
                      pattern="[A-Za-z\s]+"
                    />
                    <div className="col-span-1">
                      <TbCreditCard className="text-2xl" />
                    </div>
                    <PatternFormat
                      className="col-span-9 focus:outline-none heading-text w-full"
                      placeholder="Número de tarjeta de crédito"
                      format="#### #### #### ####"
                    />
                    <div className="col-span-1">
                      <TbCalendar className="text-2xl" />
                    </div>
                    <NumberFormatBase
                      className="col-span-4 focus:outline-none heading-text max-w-12 sm:max-w-28"
                      placeholder="MM/YY"
                      format={cardExpiryFormat}
                    />
                    <div className="col-span-1">
                      <TbLockPassword className="text-2xl" />
                    </div>
                    <PatternFormat
                      className="col-span-4 focus:outline-none heading-text max-w-12 sm:max-w-28"
                      placeholder="CVC"
                      format="####"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 flex flex-col items-end">
            <h4>
              <span>Pagar ahora: </span>
              <span>
                <NumericFormat
                  displayType="text"
                  value={selectedPlan.price || 0}
                  prefix={'Q'}
                  fixedDecimalScale={true}
                  decimalScale={2}
                  thousandSeparator={true}
                />
              </span>
            </h4>
            <div className="max-w-[350px] ltr:text-right rtl:text-left leading-none mt-2 opacity-80">
              <small>
                Al hacer click &quot;Pagar&quot;, aceptas a que se te cobre{' '}
                <NumericFormat
                  displayType="text"
                  value={selectedPlan.price || 0}
                  prefix={'Q'}
                  fixedDecimalScale={true}
                  decimalScale={2}
                  thousandSeparator={true}
                />{' '}
                mensualmente por tu suscripción.
                <br />
                Puedes cancelar en cualquier momento.
              </small>
            </div>
          </div>
          <div className="mt-6">
            {(paymentMethod === 'creditCard' || selectedPlan.price === 0) && (
              <Button
                block
                variant="solid"
                loading={loading}
                onClick={handlePay}
              >
                Pagar
              </Button>
            )}
            {paymentMethod === 'paypal' && selectedPlan.price! > 0 && (
              <PayPalButtons
                style={{
                  shape: 'rect',
                  layout: 'vertical',
                  label: 'subscribe',
                }}
                message={{
                  amount: selectedPlan.price,
                }}
                createSubscription={(data, actions) => {
                  return actions.subscription.create({
                    /* Creates the subscription */
                    plan_id: selectedPlan.paypalPlanId!,
                  });
                }}
                onApprove={async (data, actions) => {
                  await apiService.patch(
                    `/company/${recruiter?.companyId}/membership`,
                    {
                      subscriptionId: data.subscriptionID,
                    }
                  );
                }}
              />
            )}
          </div>
        </>
      )}
    </Dialog>
  );
};

export default PaymentDialog;
