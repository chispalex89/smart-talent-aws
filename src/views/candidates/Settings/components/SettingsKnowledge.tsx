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
import { TbPlus, TbTrash } from 'react-icons/tb';
import type { ZodType } from 'zod';
import type { GetSettingsProfileResponse } from '../types';
import { City, AcademicData, User } from '@prisma/client';
import { Alert, Checkbox, DatePicker, Switcher } from '@/components/ui';
import { useCatalogContext } from '../../../../context/catalogContext';
import apiService from '../../../../services/apiService';

type PersonalDataSchema = Omit<
  AcademicData,
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

const SettingsKnowledge = () => {
  const { data, mutate } = useSWR('/api/settings/profile/', () => {}, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  const { languages, skillLevels, softwareSkills, otherSkills } =
    useCatalogContext();

  const languageOptions = useMemo(() => {
    return languages.map((language) => ({
      label: language.name,
      value: language.id,
      className: 'text-gray-900',
    }));
  }, [languages]);

  const skillLevelOptions = useMemo(() => {
    return skillLevels.map((skillLevel) => ({
      label: skillLevel.name,
      value: skillLevel.id,
      className: 'text-gray-900',
    }));
  }, [skillLevels]);

  const softwareSkillOptions = useMemo(() => {
    return softwareSkills.map((softwareSkill) => ({
      label: softwareSkill.name,
      value: softwareSkill.id,
      className: 'text-gray-900',
    }));
  }, [softwareSkills]);

  const otherSkillsOptions = useMemo(() => {
    return otherSkills.map((otherSkill) => ({
      label: otherSkill.name,
      value: otherSkill.id,
      className: 'text-gray-900',
    }));
  }, [otherSkills]);

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
      <h4 className="mb-8">Idiomas y Otros Conocimientos</h4>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Idioma"
            invalid={Boolean(errors.languages)}
            errorMessage={errors.languages?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="languages"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Idioma"
                  {...field}
                  options={languageOptions}
                  value={languageOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Nivel"
            invalid={Boolean(errors.languages)}
            errorMessage={errors.languages?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="languagesLevel"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Nivel"
                  {...field}
                  options={skillLevelOptions}
                  value={skillLevelOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
        </div>
        {[1, 2, 3].map((i) => (
          <div className="grid md:grid-cols-5 gap-4">
            <FormItem
              label="Idioma"
              invalid={Boolean(errors.languages)}
              errorMessage={errors.languages?.message}
              className="w-[calc(100%-30px)] md:w-[100%] col-span-2"
            >
              <Controller
                name={`languages${i}`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="Idioma"
                    {...field}
                    options={languageOptions}
                    value={languageOptions.filter(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </FormItem>
            <FormItem
              label="Nivel"
              invalid={Boolean(errors.languages)}
              errorMessage={errors.languages?.message}
              className="w-[calc(100%-30px)] md:w-[100%] col-span-2"
            >
              <Controller
                name={`languagesLevel${i}`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="Nivel"
                    {...field}
                    options={skillLevelOptions}
                    value={skillLevelOptions.filter(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </FormItem>
            <Button
              variant="plain"
              className="mt-8"
              icon={<TbTrash />}
              onClick={() => {}}
            />
          </div>
        ))}
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Programas de Software"
            invalid={Boolean(errors.softwareSkills)}
            errorMessage={errors.softwareSkills?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="softwareSkills"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Programa"
                  {...field}
                  options={softwareSkillOptions}
                  value={softwareSkillOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.softwareSkills)}
            errorMessage={errors.softwareSkills?.message}
            label="Nivel"
          >
            <Controller
              name="softwareSkillLevels"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  placeholder="Nivel"
                  {...field}
                  options={skillLevelOptions}
                  value={skillLevelOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
        </div>
        {[1, 2, 3].map((i) => (
          <div className="grid md:grid-cols-5 gap-4">
            <FormItem
              label="Programas de Software"
              invalid={Boolean(errors.softwareSkills)}
              errorMessage={errors.softwareSkills?.message}
              className="w-[calc(100%-30px)] md:w-[100%] col-span-2"
            >
              <Controller
                name={`softwareSkills${i}`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="Programa"
                    {...field}
                    options={softwareSkillOptions}
                    value={softwareSkillOptions.filter(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </FormItem>
            <FormItem
              className="w-[calc(100%-30px)] md:w-[100%] col-span-2"
              invalid={Boolean(errors.softwareSkills)}
              errorMessage={errors.softwareSkills?.message}
              label="Nivel"
            >
              <Controller
                name={`softwareSkillLevels${i}`}
                control={control}
                render={({ field }) => (
                  <Select<Option>
                    placeholder="Nivel"
                    {...field}
                    options={skillLevelOptions}
                    value={skillLevelOptions.filter(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </FormItem>
            <Button
              variant="plain"
              className="mt-8"
              icon={<TbTrash />}
              onClick={() => {}}
            />
          </div>
        ))}
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Otros Conocimientos"
            invalid={Boolean(errors.otherSkillsDescription)}
            errorMessage={errors.otherSkillsDescription?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="otherSkillsDescription"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  autoComplete="off"
                  textArea
                  rows={5}
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormItem>
          <FormItem
            className="w-[calc(100%-30px)] md:w-[100%]"
            invalid={Boolean(errors.otherSkills)}
            errorMessage={errors.otherSkills?.message}
            label="Habilidades"
          >
            <Controller
              name="otherSkills"
              control={control}
              render={({ field }) => (
                <Checkbox.Group
                  vertical
                  className="flex mt-4"
                  {...field}
                  value={(field.value ?? []).map(String)}
                >
                  {otherSkillsOptions.map((source) => (
                    <Checkbox
                      key={source.value}
                      name={field.name}
                      value={String(source.value)}
                      className={`justify-between flex-row-reverse heading-text ${source.className}`}
                    >
                      {source.label}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
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

export default SettingsKnowledge;
