import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Form, FormItem } from '@/components/ui/Form';
import NumericInput from '@/components/shared/NumericInput';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import type { ZodType } from 'zod';
import type { GetSettingsProfileResponse } from '../types';
import apiService from '../../../../services/apiService';
import { useUserContext } from '../../../../context/userContext';
import { Recruiter, User } from '@prisma/client';

type RecruiterProfile = Recruiter & User;

type ProfileSchema = Omit<
  RecruiterProfile,
  | 'id'
  | 'userId'
  | 'company_id'
  | 'middleName'
  | 'secondLastName'
  | 'marriedLastName'
  | 'profileImage'
  | 'loginId'
  | 'isAdmin'
  | 'status'
  | 'isDeleted'
  | 'created_at'
  | 'updated_at'
  | 'created_by'
  | 'updated_by'
  | 'companyId'
>;

const validationSchema: ZodType<Partial<ProfileSchema>> = z.object({
  firstName: z.string().min(1, { message: 'First name required' }),
  lastName: z.string().min(1, { message: 'Last name required' }),
  email: z
    .string()
    .min(1, { message: 'Email required' })
    .email({ message: 'Invalid email' }),
  position: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  phone: z.string().min(1, { message: 'Please input your mobile number' }),
  ext: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  phone2: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  ext2: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
});

const SettingsProfile = () => {
  const { data, mutate } = useSWR(
    '/user/recruiter',
    () =>
      apiService.get<GetSettingsProfileResponse>(
        `/user/${recruiter?.userId}/recruiter`
      ),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  );

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(validationSchema),
  });

  const { recruiter } = useUserContext();

  useEffect(() => {
    if (recruiter) {
      mutate();
    }
  }, [recruiter, mutate]);

  useEffect(() => {
    if (data) {
      reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values: ProfileSchema) => {
    await apiService.put(`/recruiter/${recruiter?.id}`, {
      ...values,
      userId: recruiter?.userId,
    });
    reset(values);
    mutate();
  };

  return (
    <>
      <h4 className="mb-8">Información Personal del Reclutador</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
          <FormItem
            label="Cargo o Puesto"
            invalid={Boolean(errors.position)}
            errorMessage={errors.position?.message}
          >
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Cargo"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
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
                  disabled
                  type="email"
                  autoComplete="off"
                  placeholder="correo@correo.com"
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
                <Input
                  autoComplete="off"
                  placeholder="Teléfono"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-full"
            invalid={Boolean(errors.ext)}
            errorMessage={errors.ext?.message}
          >
            <label className="form-label mb-2">Extensión</label>
            <Controller
              name="ext"
              control={control}
              render={({ field }) => (
                <Input
                  autoComplete="off"
                  placeholder="Extensión"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-full"
            invalid={Boolean(errors.phone2)}
            errorMessage={errors.phone2?.message}
          >
            <label className="form-label mb-2">Teléfono 2</label>
            <Controller
              name="phone2"
              control={control}
              render={({ field }) => (
                <Input
                  autoComplete="off"
                  placeholder="Teléfono 2"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-full"
            invalid={Boolean(errors.ext2)}
            errorMessage={errors.ext2?.message}
          >
            <label className="form-label mb-2">Extensión 2</label>
            <Controller
              name="ext2"
              control={control}
              render={({ field }) => (
                <Input
                  autoComplete="off"
                  placeholder="extensión 2"
                  value={field.value || ''}
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

export default SettingsProfile;
