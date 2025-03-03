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
import { City, ProfessionalData, User } from '@prisma/client';
import { Alert, DatePicker, Switcher } from '@/components/ui';
import { useCatalogContext } from '../../../../context/catalogContext';
import apiService from '../../../../services/apiService';

type ProfessionalDataSchema = Omit<
  ProfessionalData,
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

type ProfileSchema = ProfessionalDataSchema & UserSchema;

type CountryOption = {
  label: string;
  dialCode: string;
  value: string;
};

type Option = {
  value: number;
  label: string;
  className: string;
};

const { Control } = components;

const validationSchema = z.object({
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
  documentTypeId: z.number().min(1, { message: 'Tipo de documento requerido' }),
  genderId: z.number().min(1, { message: 'Género requerido' }),
  maritalStatusId: z.number().min(1, { message: 'Estado civil requerido' }),
  countryOfResidencyId: z
    .number()
    .min(1, { message: 'País de residencia requerido' }),
  driverLicenseId: z.number().optional(),
});

const countryOptions: Option[] = [
  {
    value: 1,
    label: 'Guatemala',
    className: 'text-gray-900',
  },
];

const maritalStatusOptions: Option[] = [
  {
    value: 1,
    label: 'Soltero(a)',
    className: 'text-gray-900',
  },
  {
    value: 2,
    label: 'Casado(a)',
    className: 'text-gray-900',
  },
  {
    value: 3,
    label: 'Divorciado(a)',
    className: 'text-gray-900',
  },
  {
    value: 4,
    label: 'Viudo(a)',
    className: 'text-gray-900',
  },
];

const documentTypeOptions: Option[] = [
  {
    value: 1,
    label: 'DPI',
    className: 'text-gray-900',
  },
  {
    value: 2,
    label: 'Pasaporte',
    className: 'text-gray-900',
  },
  {
    value: 3,
    label: 'Licencia de Conducir',
    className: 'text-gray-900',
  },
];

const driverLicenseOptions: Option[] = [
  {
    value: 1,
    label: 'Tipo A',
    className: 'text-gray-900',
  },
  {
    value: 2,
    label: 'Tipo B',
    className: 'text-gray-900',
  },
  {
    value: 3,
    label: 'Tipo C',
    className: 'text-gray-900',
  },
  {
    value: 4,
    label: 'Tipo M',
    className: 'text-gray-900',
  },
];

const SettingsProfessionalProfile = () => {
  const { data, mutate } = useSWR('/api/settings/profile/', () => {}, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const [stateId, setStateId] = useState<number | null>(null);

  const {
    academicLevels,
    professions,
    jobHierarchies,
    softwareSkills,
    states,
  } = useCatalogContext();

  const academicLevelOptions = useMemo(() => {
    return academicLevels.map((academicLevel) => ({
      label: academicLevel.name,
      value: academicLevel.id,
      className: 'text-gray-900',
    }));
  }, [academicLevels]);

  const professionOptions = useMemo(() => {
    return professions.map((profession) => ({
      label: profession.name,
      value: profession.id,
      className: 'text-gray-900',
    }));
  }, [professions]);

  const jobHierarchyOptions = useMemo(() => {
    return jobHierarchies.map((jobHierarchy) => ({
      label: jobHierarchy.name,
      value: jobHierarchy.id,
      className: 'text-gray-900',
    }));
  }, [jobHierarchies]);

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
      <h4 className="mb-8">Perfil Profesional</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Último Nivel Académico Completado"
            invalid={Boolean(errors.lastAcademicLevelId)}
            errorMessage={errors.lastAcademicLevelId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="lastAcademicLevelId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Último Nivel Académico Completado"
                  {...field}
                  options={academicLevelOptions}
                  value={academicLevelOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Profesión u Oficio"
            invalid={Boolean(errors.professionId)}
            errorMessage={errors.professionId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="professionId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Profesión u Oficio"
                  {...field}
                  options={professionOptions}
                  value={professionOptions.filter(
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
            label="Último Cargo Ocupado"
            invalid={Boolean(errors.lastJobHierarchyId)}
            errorMessage={errors.lastJobHierarchyId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="lastJobHierarchyId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Último Cargo Ocupado"
                  {...field}
                  options={jobHierarchyOptions}
                  value={jobHierarchyOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-1 gap-4">
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.description)}
            errorMessage={errors.description?.message}
            label="Descripción Profesional"
          >
            <Controller
              name="description"
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

export default SettingsProfessionalProfile;
