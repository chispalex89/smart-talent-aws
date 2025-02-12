import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select, { Option as DefaultOption } from '@/components/ui/Select';
import { Form, FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';
import { TbCreditCard, TbBrandPaypal, TbBuildingBank } from 'react-icons/tb';
import { components } from 'react-select';
import { useCatalogContext } from '../../../context/catalogContext';
import { useMemo } from 'react';
import { Switcher } from '@/components/ui';
import { useState } from 'react';
import type {
  FormSectionBaseProps,
  GetPaymentMethodFields,
  PaymentType,
} from '../JobForm/types';
import type { ControlProps, OptionProps } from 'react-select';
import type { FieldErrors } from 'react-hook-form';
import type { ReactNode } from 'react';
import CreatableSelect from 'react-select/creatable';


type CreditCardFieldError = FieldErrors<
  GetPaymentMethodFields<'creditOrDebitCard'>
>;
type PaypalFieldError = FieldErrors<GetPaymentMethodFields<'paypal'>>;
type BankTransferFieldError = FieldErrors<
  GetPaymentMethodFields<'bankTransfer'>
>;

type ContractDetailsSectionProps = FormSectionBaseProps;

type PaymentMethodOption = {
  label: string;
  value: PaymentType;
  icon: ReactNode;
};

const paymentMethodOptions: PaymentMethodOption[] = [
  {
    label: 'Credit/Debit card',
    value: 'creditOrDebitCard',
    icon: <TbCreditCard />,
  },
  { label: 'Paypal', value: 'paypal', icon: <TbBrandPaypal /> },
  { label: 'Bank transfer', value: 'bankTransfer', icon: <TbBuildingBank /> },
];

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

const { Control } = components;

const CustomSelectOption = (props: OptionProps<PaymentMethodOption>) => {
  return (
    <DefaultOption<PaymentMethodOption>
      {...props}
      customLabel={(data, label) => (
        <span className="flex items-center gap-2">
          <span className="text-xl">{data.icon}</span>
          <span>{label}</span>
        </span>
      )}
    />
  );
};

const CustomControl = ({
  children,
  ...props
}: ControlProps<PaymentMethodOption>) => {
  const selected = props.getValue()[0];
  return (
    <Control {...props}>
      {selected && (
        <span className="text-xl ltr:ml-4 rtl:mr-4 text-primary">
          {selected.icon}
        </span>
      )}
      {children}
    </Control>
  );
};

const contractDetailSection = ({
  control,
  errors,
}: ContractDetailsSectionProps) => {
  const { contractTypes, driverLicenseTypes, salaryRanges, workShifts } =
    useCatalogContext();

  const salaryRangeOptions = useMemo(() => {
    return salaryRanges.map((salaryRange) => ({
      label: salaryRange.range,
      value: salaryRange.id,
    }));
  }, [salaryRanges]);

  const workShiftsOptions = useMemo(() => {
    return workShifts.map((workShift) => ({
      label: workShift.name,
      value: workShift.id,
    }));
  }, [workShifts]);

  const optionContractType = useMemo(() => {
    return contractTypes.map((contractTypes) => ({
      label: contractTypes.name,
      value: contractTypes.id,
    }));
  }, [contractTypes]);

  const driverLicenseTypesOptions = useMemo(() => {
    return driverLicenseTypes.map((driverLicenseType) => ({
      label: driverLicenseType.name,
      value: driverLicenseType.id,
    }));
  }, [driverLicenseTypes]);

  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  return (
    <Card id="contract">
      <h4 className="mb-6">Salario y Contrato</h4>

      <div className="grid md:grid-cols-2 gap-5">
        {/*Salario mensual en rango*/}

        <FormItem
          label="Salario mensual en rango"
          invalid={Boolean(errors.salaryRangeId)}
          errorMessage={errors.salaryRangeId?.message}
        >
          <Controller
            name="salaryRangeId"
            control={control}
            render={({ field }) => (
              <Select
                options={salaryRangeOptions}
                value={salaryRangeOptions.filter(
                  (salaryRanges) => salaryRanges.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
        {/*jornada laboral*/}

        <FormItem
          label="Jornada Laboral"
          invalid={Boolean(errors.workShiftId)}
          errorMessage={errors.workShiftId?.message}
        >
          <Controller
            name="workShiftId"
            control={control}
            render={({ field }) => (
              <Select
                options={workShiftsOptions}
                value={workShiftsOptions.filter(
                  (workShift) => workShift.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
        {/*horario */}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <FormItem
          label="Horario"
          invalid={Boolean(errors.schedule)}
          errorMessage={errors.schedule?.message}
        >
          <Controller
            name="schedule"
            control={control}
            render={({ field }) => (
              <Input
                size="md"
                type="text"
                autoComplete="off"
                placeholder=""
                {...field}
              />
            )}
          />
        </FormItem>
        {/*contract type */}
        <FormItem
          label="Tipo de contrato"
          invalid={Boolean(errors.contractTypeId)}
          errorMessage={errors.contractTypeId?.message}
        >
          <Controller
            name="contractTypeId"
            control={control}
            render={({ field }) => (
              <Select
                options={optionContractType}
                value={optionContractType.filter(
                  (contractType) => contractType.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="grid md:grid-cols-1 gap-5">
          <p>Licencia de conducir</p>
          <Switcher
            className="w-14"
            defaultChecked={checked2}
            onChange={(checked2) => setChecked2(checked2)}
            checked={checked2}
            checkedContent="Si"
            unCheckedContent="No"
            id="requiredDriverLicense"
          />
        </div>
        <FormItem
          label="Tipo de Licencia"
          invalid={Boolean(errors.expectedDriverLicense)}
          errorMessage={errors.expectedDriverLicense?.message}
        >
          <Controller
            name="expectedDriverLicense"
            control={control}
            render={({ field }) => (
              <Select
                isMulti
                options={driverLicenseTypesOptions}
                componentAs={CreatableSelect}
                value={field.value}
                placeholder="Seleccione una opción"
                onChange={(option) => {
                  field.onChange(option);
                }}
                isDisabled={!checked2}
              />
            )}
          />
        </FormItem>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <FormItem
          label="Vacantes disponibles"
          invalid={Boolean(errors.vacancies)}
          errorMessage={errors.vacancies?.message}
        >
          <Controller
            name="vacancies"
            control={control}
            render={({ field }) => (
              <Input
                size="md"
                type="Number"
                min={1}
                max={100}
                autoComplete="off"
                placeholder=""
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem>
          <div className="grid md:grid-cols-1 gap-7">
            <p>Disponibilidad para viajar</p>
            <Switcher
              className="w-14"
              defaultChecked={checked}
              onChange={(checked) => setChecked(checked)}
              checked={checked}
              checkedContent="Si"
              unCheckedContent="No"
              id="requiredAvailabilityToTravel"
              name="requiredAvailabilityToTravel"
            />
          </div>
        </FormItem>
      </div>
    </Card>
  );
};

export default contractDetailSection;
