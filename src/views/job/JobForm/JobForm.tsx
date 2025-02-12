import { Form } from '@/components/ui/Form';
import Affix from '@/components/shared/Affix';
import Card from '@/components/ui/Card';
import Container from '@/components/shared/Container';
import BottomStickyBar from '@/components/template/BottomStickyBar';
import JobOfferDetailsSection from '../components/JobOfferDetailSection';
import ApplicantRequirementsDetailsSection from '../components/ApplicantRequirementesDetailsSection';
import ContractDetailsSection from '../components/ContractDetailsSection';
import Navigator from '../components/Navigator';
import useLayoutGap from '@/utils/hooks/useLayoutGap';
import useResponsive from '@/utils/hooks/useResponsive';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ZodType } from 'zod';
import { useEffect, type ReactNode } from 'react';
import type { JobFormSchema } from './types';
import type { CommonProps } from '@/@types/common';
import PublishJobOffer from '../components/PublishJobOffer';

type JobFormProps = {
  children: ReactNode;
  onSubmit: (values: JobFormSchema) => void;
  defaultValues?: JobFormSchema;
  newOrder?: boolean;
} & CommonProps;

const validationSchema: ZodType<JobFormSchema> = z.object({
  name: z
    .string({ message: 'Nombre del trabajo requerido' })
    .min(1, { message: 'Nombre del trabajo requerido' }),
  description: z
    .string({ message: 'Descripción requerida' })
    .min(1, { message: 'Descripción requerida' }),
  hiringDate: z.date({ message: 'Fecha de reclutamiento requerida' }),
  publicationDate: z.date({ message: 'Fecha de publicación requerida' }),
  ageRangeFrom: z.number().min(18, { message: 'Edad mínima requerida' }),
  ageRangeTo: z.number().max(99, { message: 'Edad máxima requerida' }),
  uuid: z.string().optional(),
  publicDescription: z.string().optional(),
  countryId: z.number({ message: 'País requerido' }),
  isExperienceRequired: z.boolean({ message: 'Experiencia requerida' }),
  requiredExperience: z.number().nullable().optional(),
  expectedDriverLicense: z.array(z.number()).optional(),
  professionId: z.number({ message: 'Profesión requerida' }),
  employmentSectorId: z.number({ message: 'Area de trabajo requerida' }),
  jobHierarchyId: z.number({ message: 'Nivel de puesto requerido' }),
  maritalStatusId: z.number({ message: 'Nivel de puesto requerido' }),
  genderPreferenceId: z.number({ message: 'Nivel de puesto requerido' }),
  featured: z.boolean({ message: 'Prioridad necesaria' }),
  minimumAcademicLevelId: z.number({
    message: 'Nivel Academco minimo es requerido',
  }),
  mainLanguageId: z.number({ message: 'Lenguaje principal es requerido' }),
  stateId: z.number({ message: 'Departamento es requerido' }),
  cityId: z.number({ message: 'Municipio es requerido' }),
  contractTypeId: z.number({ message: 'El tipo de contrato es requerido' }),
  workShiftId: z.number({ message: 'Jornada laboral requerida requerido' }),
  salaryRangeId: z.number({ message: 'Es requerido un Salario' }),
  schedule: z.string({ message: 'Horario es requerido' }),
  requiredDriverLicense: z.boolean({
    message: 'Licencia de conducir es requerido',
  }),
  requiredAvailabilityToTravel: z.boolean({
    message: 'Disponibilidad para viajar requerida ',
  }),
  vacancies: z.number().min(1, {
    message: 'Cantidad de espacios disponibles requerida',
  }),
  softwareSkills: z.object({}, {}).optional(),
  languageSkills: z.object({}, {}).optional(),
  otherLanguages: z.object({}, {}).optional(),
  isConfidential: z.boolean({ message: 'Confidencialidad requerida' }),
  receivesResumesByEmail: z.boolean().optional(),
  companyId: z.number(),
});

const JobForm = (props: JobFormProps) => {
  const { children, defaultValues } = props;

  const { getTopGapValue } = useLayoutGap();

  const { larger } = useResponsive();

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const { expectedDriverLicense, hiringDate, publicationDate } = getValues();
    if (typeof hiringDate === 'string') {
      setValue('hiringDate', new Date(hiringDate));
    }
    if (typeof publicationDate === 'string') {
      setValue('publicationDate', new Date(publicationDate));
    }
    // TODO: FIX THIS
    setValue('softwareSkills', {});
    setValue('languageSkills', {});
    setValue('otherLanguages', {});
    setValue(
      'expectedDriverLicense',
      expectedDriverLicense?.map((edl: any) => edl.value) ?? [],
    );
    setValue('ageRangeFrom', Number(getValues('ageRangeFrom')));
    setValue('ageRangeTo', Number(getValues('ageRangeTo')));
    const requiredExperience = getValues('requiredExperience');
    setValue(
      'requiredExperience',
      requiredExperience ? Number(requiredExperience) : null,
    );
    setValue('vacancies', Number(getValues('vacancies')));
    setValue('companyId', 1);
    handleSubmit(onSubmit)();
  };

  const onSubmit = (values: JobFormSchema) => {
    props.onSubmit(values);
  };

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
    control,
  } = useForm<JobFormSchema>({
    defaultValues: {
      ...(defaultValues
        ? defaultValues
        : {
            featured: false,
            isExperienceRequired: false,
            isConfidential: false,
            requiredDriverLicense: false,
            requiredAvailabilityToTravel: false,
            receivesResumesByEmail: false,
          }),
    },
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <div className="flex">
      <Form
        className="flex-1 flex flex-col overflow-hidden"
        onSubmit={handleSubmitForm}
      >
        <Container>
          <div className="flex gap-4">
            {larger.xl && (
              <div className="w-[360px]">
                <Affix offset={getTopGapValue()}>
                  <Card>
                    <Navigator />
                  </Card>
                </Affix>
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-col gap-4">
                <JobOfferDetailsSection
                  control={control}
                  errors={errors}
                  watch={watch}
                />
                <ApplicantRequirementsDetailsSection
                  control={control}
                  errors={errors}
                  watch={watch}
                />
                <ContractDetailsSection
                  control={control}
                  errors={errors}
                  watch={watch}
                />
                <PublishJobOffer
                  control={control}
                  errors={errors}
                  watch={watch}
                />
              </div>
            </div>
          </div>
        </Container>
        <BottomStickyBar>{children}</BottomStickyBar>
      </Form>
    </div>
  );
};

export default JobForm;
