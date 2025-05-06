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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { City, JobExperienceData, User } from '@prisma/client';
import { Card, DatePicker, Switcher, toast } from '@/components/ui';
import { useCatalogContext } from '../../../../context/catalogContext';
import apiService from '../../../../services/apiService';
import { useUserContext } from '../../../../context/userContext';

type WorkingExperienceDataSchema = Omit<
  JobExperienceData,
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

type WorkingExperienceSchema = {
  workingExperiences: ProfileSchema[];
};

type Option = {
  value: number;
  label: string;
  className: string;
};

type StateOption = Option & { countryId: number };
type CityOption = Option & { stateId: number };

const { Control } = components;

const validationSchema = z.object({
  workingExperiences: z.array(
    z.object({
      id: z.number().optional().or(z.undefined()).or(z.null()),
      useForReference: z.boolean().or(z.undefined()).or(z.null()),
      companyName: z
        .string()
        .min(1, { message: 'Nombre de la empresa requerido' }),
      position: z.string().min(1, { message: 'Puesto requerido' }),
      countryId: z.number().min(1, { message: 'País requerido' }),
      stateId: z.number().min(1, { message: 'Departamento requerido' }),
      cityId: z.number().min(1, { message: 'Municipio requerido' }),
      zone: z.string().optional(),
      startDate: z
        .date()
        .transform((val) => val.toISOString())
        .or(z.string().min(1, { message: 'Fecha de inicio requerida' })),
      endDate: z.date().optional().or(z.string()).or(z.null()),
      jobDescription: z
        .string()
        .min(1, { message: 'Descripción del puesto requerida' }),
    })
  ),
});

const SettingsWorkingExperience = () => {
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

  const { countries, states, cities } = useCatalogContext();

  const countriesOptions: Option[] = useMemo(() => {
    return countries.map((countries) => ({
      label: countries.name,
      value: countries.id,
      className: 'text-gray-900',
    }));
  }, [countries]);

  const stateOptions: Array<StateOption> = useMemo(() => {
    return states.map((state) => ({
      label: state.name,
      value: state.id,
      countryId: state.countryId,
      className: 'text-gray-900',
    }));
  }, [states]);

  const cityOptions: Array<CityOption> = useMemo(() => {
    return cities.map((city) => ({
      label: city.name,
      value: city.id,
      stateId: city.stateId,
      className: 'text-gray-900',
    }));
  }, [cities]);

  const [countryOptionList, setCountryOptionList] = useState<Array<Option[]>>(
    []
  );
  const [stateOptionList, setStateOptionList] = useState<Array<StateOption[]>>(
    []
  );
  const [cityOptionList, setCityOptionList] = useState<Array<CityOption[]>>([]);

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm<WorkingExperienceSchema>({
    resolver: zodResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workingExperiences',
  });

  useEffect(() => {
    if (data) {
      const { jobExperienceData: workingExperiences } = data;
      const prevOptions: {
        countries: Array<Option[]>;
        states: Array<StateOption[]>;
        cities: Array<CityOption[]>;
      } = workingExperiences?.reduce(
        (
          prev: {
            countries: Array<Option[]>;
            states: Array<StateOption[]>;
            cities: Array<CityOption[]>;
          },
          curr: ProfileSchema
        ) => {
          return {
            countries: [...prev.countries, countriesOptions],
            states: [
              ...prev.states,
              stateOptions.filter(
                (state) => state.countryId === curr.countryId
              ),
            ],
            cities: [
              ...prev.cities,
              cityOptions.filter((city) => city.stateId === curr.stateId),
            ],
          };
        },
        {
          countries: [],
          states: [],
          cities: [],
        }
      );
      setCountryOptionList(prevOptions?.countries || []);
      setStateOptionList(prevOptions?.states || []);
      setCityOptionList(prevOptions?.cities || []);
      reset({
        workingExperiences,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (values: WorkingExperienceSchema) => {
    try {
      const { id } = data;
      const promises = values.workingExperiences.map((experience) => {
        if (experience.id) {
          return apiService.put(
            `/job-experience/${experience.id}`,
            experience
          );
        }
        return apiService.post('/job-experience', {
          ...experience,
          applicantId: id,
        });
      });
      const results = await Promise.allSettled(promises);

      const hasErrors = results.some((result) => result.status === 'rejected');

      if (hasErrors) {
        toast.push(
          <Notification type="danger">
            Ha ocurrido un error al guardar la experiencia laboral.
          </Notification>
        );
      } else {
        toast.push(
          <Notification type="success">
            La experiencia laboral se ha guardado correctamente.
          </Notification>
        );
      }
      await mutate();
    } catch (error) {
      toast.push(
        <Notification type="danger">
          Ha ocurrido un error al guardar la experiencia laboral.
        </Notification>
      );
    }
  };

  console.log(countryOptionList);
  console.log(stateOptionList);
  console.log(cityOptionList);
  return (
    <>
      <h4 className="mb-8">Experiencia Laboral</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <Card
            key={field.id}
            bodyClass="grid md:grid-cols-2 gap-4"
            className="mb-4"
          >
            <FormItem
              label="Usar como referencia"
              className="h-[30px] col-span-2"
            >
              <Controller
                name={`workingExperiences.${index}.useForReference`}
                control={control}
                render={({ field }) => (
                  <Switcher
                    {...field}
                    id={`workingExperiences.${index}.useForReference`}
                    className="w-14"
                    checkedContent="Si"
                    unCheckedContent="No"
                    checked={field.value}
                    onChange={(e) => {
                      const updatedFields = fields.map((f, i) => ({
                        ...f,
                        useForReference: i === index ? e : false,
                      }));
                      updatedFields.forEach((f, i) => {
                        setValue(
                          `workingExperiences.${i}.useForReference`,
                          f.useForReference
                        );
                      });
                    }}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label="Empresa u Organización"
              invalid={Boolean(errors.workingExperiences?.[index]?.companyName)}
              errorMessage={
                errors.workingExperiences?.[index]?.companyName?.message
              }
              className="w-[calc(100%-30px)] md:w-[100%]"
            >
              <Controller
                name={`workingExperiences.${index}.companyName`}
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
              invalid={Boolean(errors.workingExperiences?.[index]?.position)}
              errorMessage={
                errors.workingExperiences?.[index]?.position?.message
              }
              className="w-[calc(100%-30px)] md:w-[100%]"
            >
              <Controller
                name={`workingExperiences.${index}.position`}
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
              className="w-[calc(100%-30px)] md:w-[100%]"
              invalid={Boolean(errors.workingExperiences?.[index]?.countryId)}
              errorMessage={
                errors.workingExperiences?.[index]?.countryId?.message
              }
              label="País"
            >
              <Controller
                name={`workingExperiences.${index}.countryId`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="País"
                    {...field}
                    options={countryOptionList[index]}
                    value={countryOptionList[index]?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => {
                      field.onChange(option?.value);
                      fields[index].stateId = -1;
                      fields[index].cityId = -1;
                      const newStateOptionList = [...stateOptionList];
                      newStateOptionList[index] = stateOptions.filter(
                        (state) => state.countryId === option?.value
                      );
                      setStateOptionList(newStateOptionList);
                      const newCityOptionList = [...cityOptionList];
                      newCityOptionList[index] = [];
                      setCityOptionList(newCityOptionList);
                    }}
                  />
                )}
              />
            </FormItem>
            <FormItem
              className="w-[calc(100%-30px)] md:w-[100%]"
              invalid={Boolean(errors.workingExperiences?.[index]?.stateId)}
              errorMessage={
                errors.workingExperiences?.[index]?.stateId?.message
              }
              label="Departamento"
            >
              <Controller
                name={`workingExperiences.${index}.stateId`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="Departamento"
                    {...field}
                    options={stateOptionList[index]}
                    value={stateOptionList[index]?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => {
                      field.onChange(option?.value);
                      fields[index].cityId = -1;
                      const newCityOptionList = [...cityOptionList];
                      newCityOptionList[index] = cityOptions.filter(
                        (city) => city.stateId === option?.value
                      );
                      setCityOptionList(newCityOptionList);
                    }}
                  />
                )}
              />
            </FormItem>
            <FormItem
              className="w-[calc(100%-30px)] md:w-[100%]"
              invalid={Boolean(errors.workingExperiences?.[index]?.cityId)}
              errorMessage={errors.workingExperiences?.[index]?.cityId?.message}
              label="Municipio"
            >
              <Controller
                name={`workingExperiences.${index}.cityId`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="Municipio"
                    {...field}
                    options={cityOptionList[index]}
                    value={cityOptionList[index]?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </FormItem>
            <FormItem
              className="w-[calc(100%-30px)] md:w-[100%]"
              invalid={Boolean(errors.workingExperiences?.[index]?.zone)}
              errorMessage={errors.workingExperiences?.[index]?.zone?.message}
              label="Zona"
            >
              <Controller
                name={`workingExperiences.${index}.zone`}
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
            <FormItem
              label="Fecha de Inicio"
              invalid={Boolean(errors.workingExperiences?.[index]?.startDate)}
              errorMessage={
                errors.workingExperiences?.[index]?.startDate?.message
              }
              className="w-[calc(100%-30px)] md:w-[100%]"
            >
              <Controller
                name={`workingExperiences.${index}.startDate`}
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
              invalid={Boolean(errors.workingExperiences?.[index]?.endDate)}
              errorMessage={
                errors.workingExperiences?.[index]?.endDate?.message
              }
              className="w-[calc(100%-30px)] md:w-[100%]"
            >
              <Controller
                name={`workingExperiences.${index}.endDate`}
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
              className="w-[calc(100%-30px)] md:w-[100%]"
              invalid={Boolean(
                errors.workingExperiences?.[index]?.jobDescription
              )}
              errorMessage={
                errors.workingExperiences?.[index]?.jobDescription?.message
              }
              label="Funciones Específicas del Puesto"
            >
              <Controller
                name={`workingExperiences.${index}.jobDescription`}
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
            <div className="flex w-full justify-end items-center">
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
                  remove(index);
                  countryOptionList.splice(index, 1);
                  stateOptionList.splice(index, 1);
                  cityOptionList.splice(index, 1);
                }}
              >
                Eliminar Experiencia Laboral
              </Button>
            </div>
          </Card>
        ))}
        <Button
          type="button"
          variant="solid"
          onClick={() => {
            append({} as ProfileSchema);
            countryOptionList.push(countriesOptions);
            stateOptionList.push([]);
            cityOptionList.push([]);
          }}
          style={{ marginTop: '10px' }}
        >
          Agregar Experiencia Laboral
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

export default SettingsWorkingExperience;
