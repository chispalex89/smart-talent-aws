import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { usePricingStore } from './pricingStore';
// import { apiGetPricingPlans } from '@/services/AccontsService'
// import { featuresList } from '../constants'
import classNames from '@/utils/classNames';
import isLastChild from '@/utils/isLastChild';
import useQuery from '@/utils/hooks/useQuery';
import useSWR from 'swr';
import { NumericFormat } from 'react-number-format';
import { TbCheck } from 'react-icons/tb';
import type { GetPricingPlanResponse } from './types';
import apiService from '../../../services/apiService';
import { useMemo } from 'react';
import { useUserContext } from '../../../context/userContext';

const Plans = () => {
  const { recruiter } = useUserContext();
  const { paymentCycle, setPaymentDialog, setSelectedPlan } = usePricingStore();

  const query = useQuery();
  const subscription = query.get('subscription');
  const cycle = query.get('cycle');

  const { data } = useSWR(
    `/membership-type`,
    (url) => apiService.get<GetPricingPlanResponse>(url),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  const plans = useMemo(() => {
    if (!data) return [];
    return (
      data?.filter((plan) => !plan.isDeleted && plan.status === 'active') || []
    );
  }, [data]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-4">
      {plans?.map((plan, index) => (
        <div
          key={plan.id}
          className={classNames(
            'px-6 pt-2 flex flex-col justify-between',
            !isLastChild(plans, index) &&
              'border-r-0 xl:border-r border-gray-200 dark:border-gray-700'
          )}
        >
          <div>
            <h5 className="mb-6 flex items-center gap-2">
              <span>{plan.name}</span>
              {/* {plan.recommended && (
                <Tag className="rounded-full bg-green-200 font-bold">
                  Recommended
                </Tag>
              )} */}
            </h5>
            <div className="">{plan.description}</div>
            <div className="mt-6">
              {plan.price ? (
                <NumericFormat
                  className="h1"
                  displayType="text"
                  value={plan.price}
                  fixedDecimalScale={true}
                  decimalScale={2}
                  prefix={'Q'}
                  thousandSeparator={true}
                />
              ) : (
                <span className="h1">Gratis</span>
              )}
              <span className="text-lg font-bold">
                {' '}
                / {paymentCycle === 'monthly' ? 'mensualmente' : 'anualmente'}
              </span>
            </div>
            <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              {plan.features.map((feature, j) => (
                <div
                  key={`${index}-${j}`}
                  className="flex items-center gap-4 font-semibold heading-text"
                >
                  <TbCheck className={classNames('text-2xl', 'text-primary')} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <Button
              block
              disabled={
                recruiter?.company?.Membership[0]?.membershipTypeId === plan.id
              }
              onClick={() => {
                setSelectedPlan(plan);
                setPaymentDialog(true);
              }}
            >
              {recruiter?.company?.Membership[0]?.membershipTypeId === plan.id
                ? 'Plan seleccionado'
                : 'Seleccionar plan'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Plans;
