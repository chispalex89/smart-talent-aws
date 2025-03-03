import { useMemo, useEffect } from 'react';
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
import { PersonalData, User } from '@prisma/client';
import { Alert, DatePicker, Switcher } from '@/components/ui';

type PersonalDataSchema = Omit<
  PersonalData,
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

type ProfileSchema = PersonalDataSchema & UserSchema;

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

const genderOptions: Option[] = [
  {
    value: 1,
    label: 'Masculino',
    className: 'text-gray-900',
  },
  {
    value: 2,
    label: 'Femenino',
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

const SettingsProfile = () => {
  const { data, mutate } = useSWR('/api/settings/profile/', () => {}, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const beforeUpload = (files: FileList | null) => {
    let valid: string | boolean = true;

    const allowedFileType = ['image/jpeg', 'image/png'];
    if (files) {
      for (const file of files) {
        if (!allowedFileType.includes(file.type)) {
          valid = 'Please upload a .jpeg or .png file!';
        }
      }
    }

    return valid;
  };

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
      <h4 className="mb-8">Datos Personales</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-8">
          <Controller
            name="img"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-4">
                <Avatar
                  size={90}
                  className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                  icon={<HiOutlineUser />}
                  src={field.value}
                />
                <div className="flex items-center gap-2">
                  <Upload
                    showList={false}
                    uploadLimit={1}
                    beforeUpload={beforeUpload}
                    onChange={(files) => {
                      if (files.length > 0) {
                        field.onChange(URL.createObjectURL(files[0]));
                      }
                    }}
                  >
                    <Button
                      variant="solid"
                      size="sm"
                      type="button"
                      icon={<TbPlus />}
                    >
                      Upload Image
                    </Button>
                  </Upload>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => {
                      field.onChange('');
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <FormItem
            label="Primer Nombre"
            invalid={Boolean(errors.firstName)}
            errorMessage={errors.firstName?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Primer Nombre"
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Segundo Nombre"
            invalid={Boolean(errors.middleName)}
            errorMessage={errors.middleName?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Segundo Nombre"
                  {...field}
                />
              )}
            />
          </FormItem>
          <div></div>
          <FormItem
            label="Primer Apellido"
            invalid={Boolean(errors.lastName)}
            errorMessage={errors.lastName?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Primer Apellido"
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Segundo Apellido"
            invalid={Boolean(errors.secondLastName)}
            errorMessage={errors.secondLastName?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="secondLastName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Segundo Apellido"
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Apellido de Casada"
            invalid={Boolean(errors.marriedLastName)}
            errorMessage={errors.marriedLastName?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="marriedLastName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Apellido de Casada"
                  {...field}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Email"
            invalid={Boolean(errors.email)}
            errorMessage={errors.email?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  autoComplete="off"
                  placeholder="Email"
                  disabled
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.dateOfBirth)}
            errorMessage={errors.dateOfBirth?.message}
            label="Fecha de Nacimiento"
          >
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <>
                  <DatePicker
                    {...field}
                    placeholder="Fecha de Nacimiento"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                  <Alert type="warning" style={{ marginTop: 5, fontSize: 12 }}>
                    Debes ser mayor de 18 años para aplicar a trabajos.
                  </Alert>
                </>
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.phone)}
            errorMessage={errors.phone?.message}
            label="Teléfono de Casa"
          >
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <NumericInput
                  autoComplete="off"
                  placeholder="Teléfono de Casa"
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.mobile)}
            errorMessage={errors.mobile?.message}
            label="Teléfono Celular"
          >
            <Controller
              name="mobile"
              control={control}
              render={({ field }) => (
                <NumericInput
                  autoComplete="off"
                  placeholder="Teléfono Celular"
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Sexo"
            invalid={Boolean(errors.genderId)}
            errorMessage={errors.genderId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="genderId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Sexo"
                  {...field}
                  options={genderOptions}
                  value={genderOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Estado Civil"
            invalid={Boolean(errors.maritalStatusId)}
            errorMessage={errors.maritalStatusId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="maritalStatusId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Estado Civil"
                  {...field}
                  options={maritalStatusOptions}
                  value={maritalStatusOptions.filter(
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
            label="Tipo de Documento"
            invalid={Boolean(errors.documentTypeId)}
            errorMessage={errors.documentTypeId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="documentTypeId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Tipo de Documento"
                  {...field}
                  options={documentTypeOptions}
                  value={documentTypeOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.documentId)}
            errorMessage={errors.documentId?.message}
            label="Documento de Identificación"
          >
            <Controller
              name="documentId"
              control={control}
              render={({ field }) => (
                <NumericInput
                  autoComplete="off"
                  placeholder="Documento de Identificación"
                  value={field.value as string}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Licencia de Conducir"
            invalid={Boolean(errors.driverLicenseId)}
            errorMessage={errors.driverLicenseId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="driverLicenseId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Tipo de Documento"
                  {...field}
                  options={driverLicenseOptions}
                  value={driverLicenseOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Disponibilidad para viajar"
            invalid={Boolean(errors.availabilityToTravel)}
            errorMessage={errors.availabilityToTravel?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="availabilityToTravel"
              control={control}
              render={({ field }) => (
                <Switcher
                  {...field}
                  checked={field.value}
                  onChange={(checked) => field.onChange(checked)}
                  unCheckedContent="No"
                  checkedContent="Sí"
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

export default SettingsProfile;
