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
import type { ControlProps, OptionProps } from 'react-select';
// import { apiGetSettingsProfile } from '@/services/AccontsService'
import sleep from '@/utils/sleep';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { HiOutlineUser } from 'react-icons/hi';
import { TbPlus } from 'react-icons/tb';
import type { ZodType } from 'zod';
import type { GetSettingsProfileResponse } from '../types';
import apiService from '../../../../services/apiService';
import { useAuth } from '@/auth';

type ProfileSchema = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  img: string;
};

type CountryOption = {
  label: string;
  dialCode: string;
  value: string;
};

const { Control } = components;

const validationSchema: ZodType<ProfileSchema> = z.object({
  firstName: z.string().min(1, { message: 'First name required' }),
  lastName: z.string().min(1, { message: 'Last name required' }),
  email: z
    .string()
    .min(1, { message: 'Email required' })
    .email({ message: 'Invalid email' }),
  phone: z
    .string()
    .min(1, { message: 'Please input your mobile number' }),
  img: z.string(),
});

const CustomSelectOption = (
  props: OptionProps<CountryOption> & { variant: 'country' | 'phone' },
) => {
  return (
    <DefaultOption<CountryOption>
      {...props}
      customLabel={(data, label) => (
        <span className="flex items-center gap-2">
          <Avatar
            shape="circle"
            size={20}
            src={`/img/countries/${data.value}.png`}
          />
          {props.variant === 'country' && <span>{label}</span>}
          {props.variant === 'phone' && <span>{data.dialCode}</span>}
        </span>
      )}
    />
  );
};

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
  const selected = props.getValue()[0];
  return (
    <Control {...props}>
      {selected && (
        <Avatar
          className="ltr:ml-4 rtl:mr-4"
          shape="circle"
          size={20}
          src={`/img/countries/${selected.value}.png`}
        />
      )}
      {children}
    </Control>
  );
};

const SettingsProfile = () => {
  const { data, mutate } = useSWR(
    '/user/profile',
    () => apiService.get<GetSettingsProfileResponse>(`/user/${user.userId}/profile/`),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );

  const dialCodeList = useMemo(() => {
    const newCountryList: Array<CountryOption> = JSON.parse(
      JSON.stringify(countryList),
    );

    return newCountryList.map((country) => {
      country.label = country.dialCode;
      return country;
    });
  }, []);

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

  const { user } = useAuth();

  useEffect(() => {
    if (data) {
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values: ProfileSchema) => {
    await apiService.patch(`/user/${user.userId}/profile/`, values);
    reset(values);
    mutate();
  };

  return (
    <>
      <h4 className="mb-8">Personal information</h4>
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
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Nombre"
            invalid={Boolean(errors.firstName)}
            errorMessage={errors.firstName?.message}
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Nombre"
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Apellido"
            invalid={Boolean(errors.lastName)}
            errorMessage={errors.lastName?.message}
          >
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Apellido"
                  {...field}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Cargo o Puesto"
            invalid={Boolean(errors.email)}
            errorMessage={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  autoComplete="off"
                  placeholder="Cargo"
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-full"
            invalid={Boolean(errors.phone)}
            errorMessage={errors.phone?.message}
          >
            <label className="form-label mb-2">Teléfono</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <NumericInput
                  autoComplete="off"
                  placeholder="Teléfono"
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
            label="Correo Electrónico"
            invalid={Boolean(errors.email)}
            errorMessage={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  autoComplete="off"
                  placeholder="correo@correo.com"
                  {...field}
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
