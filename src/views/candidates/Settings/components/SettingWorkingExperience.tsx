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
import { City, JobExperienceData, User } from '@prisma/client';
import { Alert, DatePicker, Switcher } from '@/components/ui';
import { useCatalogContext } from '../../../../context/catalogContext';
import apiService from '../../../../services/apiService';

type WorkingExperienceDataSchema = Omit<
  JobExperienceData,
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

const SettingsWorkingExperience = () => {
  const { data, mutate } = useSWR('/api/settings/profile/', () => {}, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const [stateId, setStateId] = useState<number | null>(null);

  const {
    countries,
    academicLevels,
    professions,
    jobHierarchies,
    softwareSkills,
    states,
  } = useCatalogContext();

  const countriesOptions = useMemo(() => {
    return countries.map((countries) => ({
      label: countries.name,
      value: countries.id,
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
      <h4 className="mb-8">Experiencia Laboral</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Empresa u Organización"
            invalid={Boolean(errors.companyName)}
            errorMessage={errors.companyName?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  autoComplete="off"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Puesto"
            invalid={Boolean(errors.position)}
            errorMessage={errors.position?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  autoComplete="off"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.countryId)}
            errorMessage={errors.countryId?.message}
            label="País"
          >
            <Controller
              name="countryId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="País"
                  {...field}
                  options={countriesOptions}
                  value={countriesOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.stateId)}
            errorMessage={errors.stateId?.message}
            label="Departamento"
          >
            <Controller
              name="stateId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Departamento"
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
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.cityId)}
            errorMessage={errors.cityId?.message}
            label="Municipio"
          >
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Municipio"
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
            label="Zona"
          >
            <Controller
              name="zone"
              control={control}
              render={({ field }) => (
                <NumericInput
                  autoComplete="off"
                  placeholder="Zona"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Fecha de Inicio"
            invalid={Boolean(errors.startDate)}
            errorMessage={errors.startDate?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Fecha de Finalización"
            invalid={Boolean(errors.endDate)}
            errorMessage={errors.endDate?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-1 gap-4">
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.jobDescription)}
            errorMessage={errors.jobDescription?.message}
            label="Funciones Específicas del Puesto"
          >
            <Controller
              name="jobDescription"
              control={control}
              render={({ field }) => (
                <Input
                  autoComplete="off"
                  rows={3}
                  textArea
                  value={field.value}
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

export default SettingsWorkingExperience;
