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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { TbTrash } from 'react-icons/tb';
import {
  SoftwareSkillsData,
  User,
  LanguageSkillsData,
  OtherSkillsData,
} from '@prisma/client';
import { Card, Checkbox, toast } from '@/components/ui';
import { useCatalogContext } from '../../../../context/catalogContext';
import apiService from '../../../../services/apiService';
import { useUserContext } from '../../../../context/userContext';

type LanguageSkillsDataSchema = Omit<
  LanguageSkillsData,
  | 'userId'
  | 'created_at'
  | 'updated_at'
  | 'applicantId'
  | 'companyId'
  | 'created_by'
  | 'updated_by'
>;

type SoftwareSkillsDataSchema = Omit<
  SoftwareSkillsData,
  | 'userId'
  | 'created_at'
  | 'updated_at'
  | 'applicantId'
  | 'companyId'
  | 'created_by'
  | 'updated_by'
>;

type OtherSkillsDataSchema = Omit<
  OtherSkillsData,
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
type KnowledgeSchema = {
  languages: LanguageSkillsDataSchema[];
  softwareSkills: SoftwareSkillsDataSchema[];
  otherSkills: OtherSkillsDataSchema;
};

type Option = {
  value: number;
  label: string;
  className: string;
};

const { Control } = components;

const validationSchema = z.object({
  languages: z.array(
    z.object({
      id: z.number().optional().nullable(),
      languageId: z
        .number()
        .int()
        .nonnegative('Por favor seleccione un idioma.'),
      skillLevelId: z
        .number()
        .int()
        .nonnegative('Por favor seleccione un nivel.'),
    })
  ),
  softwareSkills: z.array(
    z.object({
      id: z.number().optional().nullable(),
      softwareId: z
        .number()
        .int()
        .nonnegative('Por favor seleccione un programa.'),
      skillLevelId: z
        .number()
        .int()
        .nonnegative('Por favor seleccione un nivel.'),
    })
  ),
  otherSkills: z.object({
    id: z.number().optional().nullable(),
    skillIds: z.array(z.string()).optional().or(z.null()),
    otherSkills: z.string().optional().or(z.null()),
  }),
});

const SettingsKnowledge = () => {
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
    getValues,
  } = useForm<KnowledgeSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      languages: [],
      softwareSkills: [],
      otherSkills: { skillIds: [], otherSkills: '' },
    },
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: 'languages',
  });

  const {
    fields: softwareFields,
    append: appendSoftware,
    remove: removeSoftware,
  } = useFieldArray({
    control,
    name: 'softwareSkills',
  });

  const [deletedLanguages, setDeletedLanguages] = useState<number[]>([]);
  const [deletedSoftwareSkills, setDeletedSoftwareSkills] = useState<number[]>(
    []
  );

  useEffect(() => {
    if (user) {
      mutate();
    }
  }, [user]);

  useEffect(() => {
    if (data) {
      const { languageSkillsData, otherSkillsData, softwareSkillsData } = data;
      const otherSkills = otherSkillsData[0];
      reset({
        languages: languageSkillsData,
        softwareSkills: softwareSkillsData,
        otherSkills: otherSkills
          ? {
              id: otherSkills.id,
              skillIds: otherSkills.skillIds?.map(String) || [],
              otherSkills: otherSkills.otherSkills,
            }
          : {},
      });
    }
  }, [data]);

  const onSubmit = async (values: KnowledgeSchema) => {
    const { languages, softwareSkills, otherSkills } = values;
    const { id } = data;
    try {
      const languagePromises = languages.map((language) => {
        if (language.id) {
          return apiService.put(
            `/language-skills-data/${language.id}`,
            language
          );
        } else {
          return apiService.post('/language-skills-data', {
            ...language,
            applicantId: id,
          });
        }
      });

      const softwarePromises = softwareSkills.map((softwareSkill) => {
        if (softwareSkill.id) {
          return apiService.put(
            `/software-skills-data/${softwareSkill.id}`,
            softwareSkill
          );
        } else {
          return apiService.post('/software-skills-data', {
            ...softwareSkill,
            applicantId: id,
          });
        }
      });

      const { skillIds, ...otherSkillsData } = otherSkills;

      const otherSkillsPromise = otherSkills.id
        ? apiService.put(`/other-skills-data/${otherSkills.id}`, {
            ...otherSkillsData,
            skillIds: skillIds.map(Number),
          })
        : apiService.post('/other-skills-data', {
            ...otherSkillsData,
            skillIds: skillIds.map(Number),
            applicantId: id,
          });

      const deleteLanguagePromises = deletedLanguages.map((languageId) =>
        apiService.delete(`/language-skills-data/${languageId}`)
      );

      const deleteSoftwarePromises = deletedSoftwareSkills.map((softwareId) =>
        apiService.delete(`/software-skills-data/${softwareId}`)
      );

      const results = await Promise.allSettled([
        ...languagePromises,
        ...softwarePromises,
        otherSkillsPromise,
        ...deleteLanguagePromises,
        ...deleteSoftwarePromises,
      ]);

      const hasErrors = results.some((result) => result.status === 'rejected');

      if (hasErrors) {
        toast.push(
          <Notification type="danger">
            Ha ocurrido un error al guardar los conocimientos extra.
          </Notification>
        );
      } else {
        toast.push(
          <Notification type="success">
            Los conocimientos extra se han guardado correctamente.
          </Notification>
        );
      }

      mutate();
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          ¡Error al actualizar los conocimientos!
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    }
  };

  const onError = (errors: any) => {
    console.log(errors);
  };

  return (
    <>
      <h4 className="mb-8">Idiomas y Otros Conocimientos</h4>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Card>
          <h6>Idiomas</h6>
          {languageFields.map((field, index) => (
            <div key={field.id} className="grid md:grid-cols-5 gap-4">
              <FormItem
                label="Idioma"
                invalid={Boolean(errors.languages?.[index]?.languageId)}
                errorMessage={errors.languages?.[index]?.languageId?.message}
                className="w-[calc(100%-30px)] md:w-[100%] col-span-2"
              >
                <Controller
                  name={`languages.${index}.languageId`}
                  control={control}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Idioma"
                      {...field}
                      options={languageOptions}
                      value={languageOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Nivel"
                invalid={Boolean(errors.languages?.[index]?.skillLevelId)}
                errorMessage={errors.languages?.[index]?.skillLevelId?.message}
                className="w-[calc(100%-30px)] md:w-[100%] col-span-2"
              >
                <Controller
                  name={`languages.${index}.skillLevelId`}
                  control={control}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Nivel"
                      {...field}
                      options={skillLevelOptions}
                      value={skillLevelOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
                <Controller
                  name={`languages.${index}.id`}
                  control={control}
                  render={({ field }) => <Input type="hidden" {...field} />}
                />
              </FormItem>
              <Button
                variant="plain"
                className="mt-8"
                icon={<TbTrash />}
                onClick={() => {
                  setDeletedLanguages([
                    ...deletedLanguages,
                    getValues().languages[index].id,
                  ]);
                  removeLanguage(index);
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              if (deletedLanguages.length) {
                setDeletedLanguages(deletedLanguages.splice(-1));
              }
              appendLanguage({} as LanguageSkillsDataSchema);
            }}
          >
            Agregar Idioma
          </Button>
        </Card>
        <br />
        <Card>
          <h6>Programas de Computadora</h6>
          {softwareFields.map((field, index) => (
            <div key={field.id} className="grid md:grid-cols-5 gap-4">
              <FormItem
                label="Programa"
                invalid={Boolean(errors.softwareSkills?.[index]?.softwareId)}
                errorMessage={
                  errors.softwareSkills?.[index]?.softwareId?.message
                }
                className="w-[calc(100%-30px)] md:w-[100%] col-span-2"
              >
                <Controller
                  name={`softwareSkills.${index}.softwareId`}
                  control={control}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Programa"
                      {...field}
                      options={softwareSkillOptions}
                      value={softwareSkillOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Nivel"
                invalid={Boolean(errors.softwareSkills?.[index]?.skillLevelId)}
                errorMessage={
                  errors.softwareSkills?.[index]?.skillLevelId?.message
                }
                className="w-[calc(100%-30px)] md:w-[100%] col-span-2"
              >
                <Controller
                  name={`softwareSkills.${index}.skillLevelId`}
                  control={control}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Nivel"
                      {...field}
                      options={skillLevelOptions}
                      value={skillLevelOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
                <Controller
                  name={`softwareSkills.${index}.id`}
                  control={control}
                  render={({ field }) => <Input type="hidden" {...field} />}
                />
              </FormItem>
              <Button
                variant="plain"
                className="mt-8"
                icon={<TbTrash />}
                onClick={() => {
                  removeSoftware(index);
                  setDeletedSoftwareSkills([
                    ...deletedSoftwareSkills,
                    getValues().softwareSkills[index].id,
                  ]);
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              if (deletedSoftwareSkills.length) {
                setDeletedLanguages(deletedSoftwareSkills.splice(-1));
              }
              appendSoftware({} as SoftwareSkillsDataSchema);
            }}
          >
            Agregar Programa de Computadora
          </Button>
        </Card>
        <div className="grid md:grid-cols-2 gap-4">
          <FormItem
            label="Otros Conocimientos"
            invalid={Boolean(errors.otherSkills?.otherSkills)}
            errorMessage={errors.otherSkills?.otherSkills?.message}
            className="w-[calc(100%-30px)] md:w-[100%]"
          >
            <Controller
              name="otherSkills.otherSkills"
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
            invalid={Boolean(errors.otherSkills?.skillIds)}
            errorMessage={errors.otherSkills?.skillIds?.message}
            label="Habilidades"
          >
            <Controller
              name="otherSkills.skillIds"
              control={control}
              render={({ field }) => (
                <Checkbox.Group
                  vertical
                  className="flex mt-4"
                  {...field}
                  value={(field.value ?? []).map(String)}
                  onChange={(value) => {
                    field.onChange(value);
                    console.log(value);
                  }}
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
          <FormItem>
            <Controller
              name="otherSkills.id"
              control={control}
              render={({ field }) => <Input type="hidden" {...field} />}
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
