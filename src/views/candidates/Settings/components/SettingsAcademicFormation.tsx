import { useMemo, useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Notification from '@/components/ui/Notification';
import { Form, FormItem } from '@/components/ui/Form';
import { components } from 'react-select';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { AcademicData, User } from '@prisma/client';
import { Card, DatePicker, toast } from '@/components/ui';
import { useCatalogContext } from '../../../../context/catalogContext';
import apiService from '../../../../services/apiService';
import { useUserContext } from '../../../../context/userContext';

type AcademicDataSchema = Omit<
  AcademicData,
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

type ProfileSchema = AcademicDataSchema & UserSchema;

type AcademicFormationsSchema = {
  academicFormations: ProfileSchema[];
};

type Option = {
  value: number;
  label: string;
  className: string;
};

const { Control } = components;

const validationSchema = z.object({
  academicFormations: z.array(
    z.object({
      id: z.number().optional().or(z.null()),
      institutionName: z
        .string()
        .nonempty('Por favor ingrese el nombre de la institución.'),
      academicLevelId: z
        .number()
        .int()
        .nonnegative('Por favor seleccione un nivel académico.'),
      academicStatusId: z
        .number()
        .int()
        .nonnegative(
          'Por favor seleccione un estado de su formación académica.'
        ),
      employmentSectorId: z
        .number()
        .int()
        .nonnegative('Por favor seleccione un área de estudios.'),
      titleObtained: z
        .string()
        .nonempty('Por favor ingrese el título obtenido.'),
      startDate: z
        .date()
        .transform((val) => val.toISOString())
        .or(z.string().min(1, { message: 'Fecha de inicio requerida' })),
      endDate: z.date().optional().or(z.null()).or(z.string()),
    })
  ),
});

const SettingsAcademicFormation = () => {
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

  const { academicLevels, professions, academicStatuses } = useCatalogContext();

  const academicLevelOptions = useMemo(() => {
    return academicLevels.map((academicLevel) => ({
      label: academicLevel.name,
      value: academicLevel.id,
      className: 'text-gray-900',
    }));
  }, [academicLevels]);

  const academicStatusOptions = useMemo(() => {
    return academicStatuses.map((academicStatus) => ({
      label: academicStatus.name,
      value: academicStatus.id,
      className: 'text-gray-900',
    }));
  }, [academicStatuses]);

  const professionOptions = useMemo(() => {
    return professions.map((profession) => ({
      label: profession.name,
      value: profession.id,
      className: 'text-gray-900',
    }));
  }, [professions]);

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
    getValues,
  } = useForm<AcademicFormationsSchema>({
    resolver: zodResolver(validationSchema),
  });

  const [formationsToRemove, setFormationsToRemove] = useState([] as number[]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'academicFormations',
  });

  useEffect(() => {
    if (user) {
      mutate();
    }
  }, [user]);

  useEffect(() => {
    if (data) {
      const { academicData: academicFormations } = data;
      reset({
        academicFormations,
      });
    }
  }, [data]);

  const onSubmit = async (values: AcademicFormationsSchema) => {
    try {
      const { id } = data;
      const promises = values.academicFormations.map((formation) => {
        if (formation.id) {
          return apiService.put(`/academic-data/${formation.id}`, formation);
        }
        return apiService.post('/academic-data', {
          ...formation,
          applicantId: id,
        });
      });

      const removePromises = formationsToRemove.map((id) => {
        return apiService.delete(`/academic-data/${id}`);
      });
      const results = await Promise.allSettled([
        ...promises,
        ...removePromises,
      ]);

      const hasErrors = results.some((result) => result.status === 'rejected');

      if (hasErrors) {
        toast.push(
          <Notification type="danger">
            Ha ocurrido un error al guardar la información académica.
          </Notification>
        );
      } else {
        toast.push(
          <Notification type="success">
            La información académica se ha guardado correctamente.
          </Notification>
        );
      }
      await mutate();
    } catch (error) {
      toast.push(
        <Notification type="danger">
          Ha ocurrido un error al guardar la información académica.
        </Notification>
      );
    }
  };

  return (
    <>
      <h4 className="mb-8">Formación Académica</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <Card
            key={field.id}
            bodyClass="grid md:grid-cols-2 gap-4"
            className="mb-4"
          >
            <FormItem
              label="Nombre de la Institución"
              invalid={Boolean(
                errors.academicFormations?.[index]?.institutionName
              )}
              errorMessage={
                errors.academicFormations?.[index]?.institutionName?.message
              }
              className="w-[calc(100%-30px)] md:w-[100%]"
            >
              <Controller
                name={`academicFormations.${index}.institutionName`}
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
              label="Nivel de Estudio"
              invalid={Boolean(
                errors.academicFormations?.[index]?.academicLevelId
              )}
              errorMessage={
                errors.academicFormations?.[index]?.academicLevelId?.message
              }
              className="w-[calc(100%-30px)] md:w-[100%]"
            >
              <Controller
                name={`academicFormations.${index}.academicLevelId`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="Nivel de Estudio"
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
              className="w-[calc(100%-30px)] md:w-[100%]"
              invalid={Boolean(
                errors.academicFormations?.[index]?.employmentSectorId
              )}
              errorMessage={
                errors.academicFormations?.[index]?.employmentSectorId?.message
              }
              label="Área de Estudios"
            >
              <Controller
                name={`academicFormations.${index}.employmentSectorId`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="Área de Estudios"
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
            <FormItem
              className="w-[calc(100%-30px)] md:w-[100%]"
              invalid={Boolean(
                errors.academicFormations?.[index]?.academicStatusId
              )}
              errorMessage={
                errors.academicFormations?.[index]?.academicStatusId?.message
              }
              label="Estado Actual"
            >
              <Controller
                name={`academicFormations.${index}.academicStatusId`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="Estado Actual del Estudio"
                    {...field}
                    options={academicStatusOptions}
                    value={academicStatusOptions.filter(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </FormItem>
            <FormItem
              className="w-[calc(100%-30px)] md:w-[100%]"
              invalid={Boolean(
                errors.academicFormations?.[index]?.titleObtained
              )}
              errorMessage={
                errors.academicFormations?.[index]?.titleObtained?.message
              }
              label="Título Obtenido"
            >
              <Controller
                name={`academicFormations.${index}.titleObtained`}
                control={control}
                render={({ field }) => (
                  <Input
                    autoComplete="off"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label="Fecha de Inicio"
              invalid={Boolean(errors.academicFormations?.[index]?.startDate)}
              errorMessage={
                errors.academicFormations?.[index]?.startDate?.message
              }
              className="w-[calc(100%-30px)] md:w-[100%]"
            >
              <Controller
                name={`academicFormations.${index}.startDate`}
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
              invalid={Boolean(errors.academicFormations?.[index]?.endDate)}
              errorMessage={
                errors.academicFormations?.[index]?.endDate?.message
              }
              className="w-[calc(100%-30px)] md:w-[100%]"
            >
              <Controller
                name={`academicFormations.${index}.endDate`}
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
            <div className="flex w-full justify-end items-center">
              <FormItem>
                <Controller
                  name={`academicFormations.${index}.id`}
                  control={control}
                  render={({ field }) => <Input type="hidden" {...field} />}
                />
              </FormItem>
              <Button
                type="button"
                className={
                  'border-gray ring-1 ring-error text-error hover:border-error hover:bg-error hover:ring-error hover:text-white'
                }
                style={{
                  width: '250px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  textWrap: 'wrap',
                }}
                onClick={() => {
                  setFormationsToRemove([
                    ...formationsToRemove,
                    getValues().academicFormations[index].id,
                  ]);
                  remove(index);
                }}
              >
                Eliminar Formación Académica
              </Button>
            </div>
          </Card>
        ))}
        <Button
          type="button"
          onClick={() => {
            if (formationsToRemove.length) {
              setFormationsToRemove(formationsToRemove.splice(-1));
            }
            append({} as ProfileSchema);
          }}
          style={{ marginTop: '10px' }}
        >
          Agregar Formación Académica
        </Button>
        <div className="flex justify-end">
          <Button variant="solid" type="submit" loading={isSubmitting}>
            Guardar
          </Button>
        </div>
      </Form>
    </>
  );
};

export default SettingsAcademicFormation;
