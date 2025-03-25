import { useMemo, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Notification from '@/components/ui/Notification';
import { Form, FormItem } from '@/components/ui/Form';
import NumericInput from '@/components/shared/NumericInput';
import { components } from 'react-select';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { City, PersonalData, User } from '@prisma/client';
import { toast } from '@/components/ui';
import { useCatalogContext } from '../../../../context/catalogContext';
import apiService from '../../../../services/apiService';
import { useUserContext } from '../../../../context/userContext';

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

type Option = {
  value: number;
  label: string;
  className: string;
};

const { Control } = components;

const validationSchema = z.object({
  address: z.string().nonempty('Por favor ingrese su dirección.'),
  countryOfResidencyId: z
    .number()
    .int()
    .nonnegative('Por favor seleccione un país.'),
  stateId: z
    .number()
    .int()
    .nonnegative('Por favor seleccione un departamento.'),
  cityId: z.number().int().nonnegative('Por favor seleccione un municipio.'),
  zone: z.string().nonempty('Por favor ingrese su zona.'),
});

const SettingsLocation = () => {
  const { user } = useUserContext();

  const { data, mutate } = useSWR(
    `/applicant/${user?.id || 0}/applicant-data`,
    (url) => apiService.get<any>(url),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (user) {
      mutate();
    }
  }, [user]);

  const [stateId, setStateId] = useState<number | null>(null);

  const { countries, states } = useCatalogContext();

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
    setValue,
    control,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      const { personalData, ...rest } = data;
      reset({ ...rest, ...personalData[0] });
      setStateId(personalData[0].stateId);
    }
  }, [data]);

  const onSubmit = async (values: ProfileSchema) => {
    try {
      const { personalData } = data;

      await apiService.put(`/personal-data/${personalData[0].id}`, {
        ...values,
      });

      toast.push(
        <Notification type="success">
          ¡Perfil actualizado con éxito!
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      toast.push(
        <Notification type="danger">
          ¡Error al actualizar el perfil!
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } finally {
      mutate();
    }
  };

  return (
    <>
      <h4 className="mb-8">Residencia</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-1 gap-4">
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.address)}
            errorMessage={errors.address?.message}
            label="Dirección"
          >
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input
                  autoComplete="off"
                  placeholder="Dirección"
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
            label="País de Residencia"
            invalid={Boolean(errors.countryOfResidencyId)}
            errorMessage={errors.countryOfResidencyId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="countryOfResidencyId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="País de Residencia"
                  {...field}
                  options={countriesOptions}
                  value={countriesOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => {
                    field.onChange(option?.value);
                    setValue('stateId', -1);
                    setValue('cityId', -1);
                  }}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Departamento"
            invalid={Boolean(errors.stateId)}
            errorMessage={errors.stateId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
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
                  onChange={(option) => {
                    field.onChange(option?.value);
                    setStateId(option?.value || 0);
                    setValue('cityId', -1);
                  }}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Municipio"
            invalid={Boolean(errors.cityId)}
            errorMessage={errors.cityId?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
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
        <div className="flex justify-end">
          <Button variant="solid" type="submit" loading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </Form>
    </>
  );
};

export default SettingsLocation;
