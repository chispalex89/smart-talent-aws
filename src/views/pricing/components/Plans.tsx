import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { usePricingStore } from '../store/pricingStore';
import classNames from '@/utils/classNames';
import isLastChild from '@/utils/isLastChild';
import { NumericFormat } from 'react-number-format';
import { TbCheck } from 'react-icons/tb';
import { useCatalogContext } from '../../../context/catalogContext';

const Plans = () => {
  const { membershipTypes } = useCatalogContext();
  const { paymentCycle, setPaymentDialog, setSelectedPlan } = usePricingStore();
  

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-4">
      {membershipTypes?.filter(x => !x.isDeleted && x.status === 'active').map((plan, index) => (
        <div
          key={plan.id}
          className={classNames(
            'px-6 pt-2 flex flex-col justify-between',
            !isLastChild(membershipTypes, index) &&
              'border-r-0 xl:border-r border-gray-200 dark:border-gray-700'
          )}
        >
          <div>
            <h5 className="mb-6 flex items-center gap-2">
              <span>{plan.name}</span>
              {plan.name === 'Oro' && (
                <Tag className="rounded-full bg-green-200 font-bold">
                  Recomendado
                </Tag>
              )}
              {

              }
            </h5>
            <div className="">{plan.description}</div>
            <div className="mt-6">
              {(plan.price || 0) > 0 ? (
                <>
                  <NumericFormat
                    className="h1"
                    displayType="text"
                    value={plan.price}
                    prefix={'Q'}
                    thousandSeparator={true}
                    fixedDecimalScale={true}
                    decimalScale={2}
                  />
                  <span className="text-lg font-bold">
                    {' '}
                    / mensualmente
                    {/*paymentCycle === 'monthly' ? 'month' : 'year'*/}
                  </span>
                </>
              ) : (
                <span className="h1">Gratis</span>
              )}
            </div>
            <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              {plan.features.map((feature: any, index: number) => (
                <div
                  key={`${feature}-${index}`}
                  className="font-semibold heading-text grid grid-cols-8"
                >
                  <TbCheck className={classNames('text-2xl', 'text-primary')} />
                  <span className="col-span-6">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <Button
              block
              // disabled={subcription === plan.id && cycle === paymentCycle}
              onClick={() => {
                setSelectedPlan({
                  paymentCycle,
                  planName: plan.name,
                  price: {
                    monthly: plan.price,
                  },
                });
                setPaymentDialog(true);
              }}
            >
              {/* {subcription === plan.id && cycle === paymentCycle
                ? 'Current plan'
                : 'Select plan'} */}
              Seleccionar plan
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Plans;
