import { useMemo, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Upload from '@/components/ui/Upload';
import Input from '@/components/ui/Input';
import Select, { Option as DefaultOption } from '@/components/ui/Select';
import Avatar from '@/components/ui/Avatar';
import { Form, FormItem } from '@/components/ui/Form';
import NumericInput from '@/components/shared/NumericInput';
import { countryList } from '@/constants/countries.constant';
import { components } from 'react-select';
import sleep from '@/utils/sleep';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { HiOutlineUser } from 'react-icons/hi';
import { TbPlus } from 'react-icons/tb';
import type { ZodType } from 'zod';
import type { GetSettingsProfileResponse } from '../types';
import { City, JobPreferences, User } from '@prisma/client';
import { Alert, DatePicker, Switcher } from '@/components/ui';
import { useCatalogContext } from '../../../../context/catalogContext';
import apiService from '../../../../services/apiService';

type WorkingExperienceDataSchema = Omit<
  JobPreferences,
  | 'id'
  | 'userId'
  | 'created_at'
  | 'updated_at'
  | 'applicantId'
  | 'companyId'
  | 'created_by'
  | 'updated_by'
>;

type UserSchema = Omit<
  User,
  | 'id'
  | 'loginId'
  | 'status'
  | 'password'
  | 'isDeleted'
  | 'created_at'
  | 'updated_at'
  | 'created_by'
  | 'updated_by'
>;

type ProfileSchema = WorkingExperienceDataSchema & UserSchema;

type Option = {
  value: number;
  label: string;
  className: string;
};

const { Control } = components;

const validationSchema = z.array(
  z.object({
    firstName: z.string().min(1, { message: 'Nombre requerido' }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: 'Apellido requerido' }),
    secondLastName: z.string().optional(),
    email: z.string().email({ message: 'Email invalido' }),
    marriedLastName: z.string().optional(),
    documentId: z
      .string()
      .min(1, { message: 'Documento de Identificación requerido' }),
    address: z.string().min(1, { message: 'Dirección requerida' }),
    phone: z.string().optional().or(z.literal('')),
    mobile: z.string().optional().or(z.literal('')),
    availabilityToTravel: z.boolean(),
    documentTypeId: z
      .number()
      .min(1, { message: 'Tipo de documento requerido' }),
    genderId: z.number().min(1, { message: 'Género requerido' }),
    maritalStatusId: z.number().min(1, { message: 'Estado civil requerido' }),
    countryOfResidencyId: z
      .number()
      .min(1, { message: 'País de residencia requerido' }),
    driverLicenseId: z.number().optional(),
  })
);

const SettingsWorkingPreferences = () => {
  const { data, mutate } = useSWR('/api/settings/profile/', () => {}, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const [stateId, setStateId] = useState<number | null>(null);

  const {
    contractTypes,
    countries,
    employmentStatuses,
    employmentSectors,
    salaryRanges,
    states,
    workShifts,
  } = useCatalogContext();

  const employmentStatusOptions = useMemo(() => {
    return employmentStatuses.map((employmentStatus) => ({
      label: employmentStatus.name,
      value: employmentStatus.id,
      className: 'text-gray-900',
    }));
  }, [employmentStatuses]);

  const employmentSectorOptions = useMemo(() => {
    return employmentSectors.map((employmentSector) => ({
      label: employmentSector.name,
      value: employmentSector.id,
      className: 'text-gray-900',
    }));
  }, [employmentSectors]);

  const workShiftOptions = useMemo(() => {
    return workShifts.map((workShift) => ({
      label: workShift.name,
      value: workShift.id,
      className: 'text-gray-900',
    }));
  }, [workShifts]);

  const salaryRangeOptions = useMemo(() => {
    return salaryRanges.map((salaryRange) => ({
      label: salaryRange.range,
      value: salaryRange.id,
      className: 'text-gray-900',
    }));
  }, [salaryRanges]);

  const contractTypeOptions = useMemo(() => {
    return contractTypes.map((contractType) => ({
      label: contractType.name,
      value: contractType.id,
      className: 'text-gray-900',
    }));
  }, [contractTypes]);

  const countryOptions = useMemo(() => {
    return countries.map((country) => ({
      label: country.name,
      value: country.id,
      className: 'text-gray-900',
    }));
  }, [countries]);

  const stateOptions = useMemo(() => {
    return states.map((state) => ({
      label: state.name,
      value: state.id,
      className: 'text-gray-900',
    }));
  }, [states]);

  const [cityOptions, setCityOptions] = useState(
    [] as { label: string; value: number; className: string }[]
  );

  useEffect(() => {
    if (stateId) {
      apiService.get<City[]>('/city', { stateId }).then((data: City[]) => {
        const cityOptions = data.map((city) => ({
          label: city.name,
          value: city.id,
          className: 'text-gray-900',
        }));
        setCityOptions(cityOptions);
      });
    }
  }, [stateId]);

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values: ProfileSchema) => {
    await sleep(500);
    if (data) {
      mutate({ ...data, ...values }, false);
    }
  };

  return (
    <>
      <h4 className="mb-8">Preferencias de Trabajo</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Situación Actual"
            invalid={Boolean(errors.currentEmploymentStatusId)}
            errorMessage={errors.currentEmploymentStatusId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="currentEmploymentStatusId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Situación Actual"
                  {...field}
                  options={employmentStatusOptions}
                  value={employmentStatusOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Puesto de Trabajo Deseado"
            invalid={Boolean(errors.desiredEmploymentSectorId)}
            errorMessage={errors.desiredEmploymentSectorId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="desiredEmploymentSectorId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Puesto de Trabajo Deseado"
                  {...field}
                  options={employmentSectorOptions}
                  value={employmentSectorOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Área de Trabajo Donde Se Ha Desempeñado"
            invalid={Boolean(errors.previousEmploymentSectorId)}
            errorMessage={errors.previousEmploymentSectorId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="previousEmploymentSectorId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Área de Trabajo Donde Se Ha Desempeñado"
                  {...field}
                  options={employmentSectorOptions}
                  value={employmentSectorOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Salario Deseado"
            invalid={Boolean(errors.expectedSalaryId)}
            errorMessage={errors.expectedSalaryId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="expectedSalaryId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Salario Deseado"
                  {...field}
                  options={salaryRangeOptions}
                  value={salaryRangeOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Jornada de Trabajo"
            invalid={Boolean(errors.workingDayId)}
            errorMessage={errors.workingDayId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="workingDayId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Jornada de Trabajo"
                  {...field}
                  options={workShiftOptions}
                  value={workShiftOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Tipo de Contrato"
            invalid={Boolean(errors.contractTypeId)}
            errorMessage={errors.contractTypeId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="contractTypeId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Tipo de Contrato"
                  {...field}
                  options={contractTypeOptions}
                  value={contractTypeOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="País donde desea Trabajar"
            invalid={Boolean(errors.countryId)}
            errorMessage={errors.countryId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="countryId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="País donde desea Trabajar"
                  {...field}
                  options={countryOptions}
                  value={countryOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Departamento donde desea Trabajar"
            invalid={Boolean(errors.stateId)}
            errorMessage={errors.stateId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="stateId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Departamento donde desea Trabajar"
                  {...field}
                  options={stateOptions}
                  value={stateOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Municipio donde desea Trabajar"
            invalid={Boolean(errors.cityId)}
            errorMessage={errors.cityId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Municipio donde desea Trabajar"
                  {...field}
                  options={cityOptions}
                  value={cityOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.zone)}
            errorMessage={errors.zone?.message}
            label="Zona donde desea Trabajar"
          >
            <Controller
              name="zone"
              control={control}
              render={({ field }) => (
                <NumericInput
                  autoComplete="off"
                  placeholder="Zona donde desea Trabajar"
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="flex justify-end">
          <Button variant="solid" type="submit" loading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </Form>
    </>
  );
};

export default SettingsWorkingPreferences;
