import { useMemo, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Notification from '@/components/ui/Notification';
import { Form, FormItem } from '@/components/ui/Form';
import { components } from 'react-select';
import sleep from '@/utils/sleep';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { ProfessionalData, User } from '@prisma/client';
import { useCatalogContext } from '../../../../context/catalogContext';
import { toast } from '@/components/ui';
import apiService from '../../../../services/apiService';
import { useUserContext } from '../../../../context/userContext';

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

type Option = {
  value: number;
  label: string;
  className: string;
};

const { Control } = components;

const validationSchema = z.object({
  lastAcademicLevelId: z
    .number()
    .int()
    .nonnegative('Por favor seleccione un nivel académico.'),
  professionId: z
    .number()
    .int()
    .nonnegative('Por favor seleccione una profesión.'),
  lastJobHierarchyId: z
    .number()
    .int()
    .nonnegative('Por favor seleccione un cargo.'),
  description: z.string().nonempty('Por favor ingrese una descripción.'),
});

const SettingsProfessionalProfile = () => {
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

  const { academicLevels, professions, jobHierarchies } = useCatalogContext();

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
      const { professionalData, ...rest } = data;
      reset({ ...rest, ...professionalData[0] });
    }
  }, [data]);

  const onSubmit = async (values: ProfileSchema) => {
    try {
      const { professionalData } = data;
      const professional = professionalData[0];
      await apiService.put(`/professional-data/${professional?.id || 0}`, {
        ...values,
      });
      toast.push(
        <Notification type="success">
          ¡Información profesional actualizada con éxito!
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch {
      toast.push(
        <Notification type="danger">
          ¡Error al actualizar la información profesional!
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
